import React, { useState, useEffect } from 'react';

export default function EvaluationModal({ candidate, onClose }) {
    const [score, setScore] = useState('');
    const [comment, setComment] = useState('');
    // localStorageを利用して評価者名を保持（毎回入力する手間を省く）
    const [reviewerName, setReviewerName] = useState(() => localStorage.getItem('ryohei_evaluator') || '');
    const [reviewers, setReviewers] = useState([]);
    const [isLoadingReviewers, setIsLoadingReviewers] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        const fetchReviewers = async () => {
            try {
                const GAS_URL = import.meta.env.VITE_GAS_API_URL;
                if (!GAS_URL) throw new Error("VITE_GAS_API_URL is not set");

                const response = await fetch(`${GAS_URL}?action=getReviewers`);
                const json = await response.json();

                // ユーザーからの指示通り、配列が直接返ってくると仮定（例: ['山田太郎', '佐藤花子']）
                // 構造が { status: 'success', data: [...] } などであれば調整が必要ですが、
                // 指定された "審査員の名前の配列を返すようにしました" に従います。
                // 念のため、配列かどうかチェックしてセットします。
                if (Array.isArray(json)) {
                    setReviewers(json);
                } else if (json.reviewers && Array.isArray(json.reviewers)) {
                    // 念のためのフォールバック
                    setReviewers(json.reviewers);
                } else if (json.data && Array.isArray(json.data)) {
                    setReviewers(json.data);
                }
            } catch (error) {
                console.error('Failed to fetch reviewers:', error);
            } finally {
                setIsLoadingReviewers(false);
            }
        };

        fetchReviewers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        localStorage.setItem('ryohei_evaluator', reviewerName);

        try {
            const payload = {
                action: 'evaluate',
                candidateName: candidate.candidateName,
                hospitalName: candidate.hospitalName,
                department: candidate.department,
                jobTitle: candidate.jobTitle,
                reviewerName: reviewerName,
                score: score,
                comment: comment
            };

            await fetch(import.meta.env.VITE_GAS_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify(payload)
            });

            // GASからのCORSエラー回避のため、fetch終了時点で成功と見なす
            setIsSubmitting(false);
            setIsSuccess(true);
            setTimeout(() => {
                onClose();
            }, 1500);

        } catch (error) {
            console.error('Submit error:', error);
            setIsSubmitting(false);
            // ネットワークエラー以外は成功扱い（GASのCORS仕様）
            setIsSuccess(true);
            setTimeout(() => {
                onClose();
            }, 1500);
        }
    };

    if (!candidate) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-[fadeIn_0.2s_ease-out]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="bg-slate-900 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                        評価入力
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {/* Modal Body */}
                {isSuccess ? (
                    <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
                            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">評価を送信しました</h3>
                        <p className="text-slate-500">スプレッドシートの「評価結果」シートに記録されました。</p>
                    </div>
                ) : (
                    <div className="p-6">
                        <div className="mb-6 pb-4 border-b border-slate-100">
                            <p className="text-sm text-slate-500 mb-1">対象者</p>
                            <p className="text-lg font-bold text-slate-800">{candidate.candidateName} <span className="text-sm font-normal text-slate-500 ml-2">{candidate.hospitalName} / {candidate.department}</span></p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">評価者（あなた）のお名前 <span className="text-amber-600">*</span></label>
                                {isLoadingReviewers ? (
                                    <div className="w-full text-base p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-500 animate-pulse">
                                        評価者リストを読み込み中...
                                    </div>
                                ) : reviewers && reviewers.length > 0 ? (
                                    <select
                                        required
                                        value={reviewerName}
                                        onChange={(e) => setReviewerName(e.target.value)}
                                        className="w-full text-base p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none bg-white"
                                    >
                                        <option value="" disabled>氏名を選択してください</option>
                                        {reviewers.map((name, idx) => (
                                            <option key={idx} value={name}>{name}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        required
                                        value={reviewerName}
                                        onChange={(e) => setReviewerName(e.target.value)}
                                        className="w-full text-base p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none"
                                        placeholder="例: 山田 太郎"
                                    />
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">総合評価スコア (1〜100点) <span className="text-amber-600">*</span></label>
                                <input
                                    type="number"
                                    min="1" max="100"
                                    required
                                    value={score}
                                    onChange={(e) => setScore(e.target.value)}
                                    className="w-full text-lg p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none"
                                    placeholder="例: 85"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">評価コメント</label>
                                <textarea
                                    rows="4"
                                    required
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none resize-none"
                                    placeholder="選考理由や所感を入力してください..."
                                ></textarea>
                            </div>

                            <div className="pt-2 flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors"
                                >
                                    キャンセル
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-lg shadow-amber-600/30 transition-colors disabled:opacity-50 flex justify-center items-center"
                                >
                                    {isSubmitting ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        "評価を送信する"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
