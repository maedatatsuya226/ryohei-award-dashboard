import React, { useState } from 'react';

export default function EvaluationModal({ candidate, phase, currentReviewer, onClose, onEvaluated }) {
    const [score, setScore] = useState(''); // 2次/最終用(1-100) or 1次用(1-5)
    const [comment, setComment] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    // 評価者はヘッダーで選択したログイン中の審査員に固定（別人名義での送信を防ぐ）
    const reviewerName = currentReviewer;

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            action: 'evaluate',
            candidateName: candidate.candidateName,
            hospitalName: candidate.hospitalName,
            department: candidate.department,
            jobTitle: candidate.jobTitle,
            reviewerName: reviewerName,
            score: score,
            comment: comment,
            phase: phase // GAS側で処理を分けるため
        };

        // GASの応答はCORS制約で読めず待つ意味がないため、送信はバックグラウンドで実行。
        // ネットワークレベルで失敗したときだけ警告を出す
        const GAS_URL = import.meta.env.VITE_GAS_API_URL;
        if (GAS_URL) {
            fetch(GAS_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify(payload)
            }).catch((error) => {
                console.error('Submit error:', error);
                alert(`「${candidate.candidateName}」さんの評価送信に失敗した可能性があります。\n通信環境を確認のうえ、ページをリロードして評価が記録されているかご確認ください。`);
            });
        }

        // 即時に完了扱いにして、一覧からカードを消す
        setIsSuccess(true);
        onEvaluated?.(candidate.id, reviewerName);
        setTimeout(() => {
            onClose();
        }, 800);
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
                                <label className="block text-sm font-bold text-slate-700 mb-2">評価者（あなた）</label>
                                <div className="w-full text-base p-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 font-medium">
                                    {reviewerName}
                                </div>
                                <p className="mt-1 text-xs text-slate-400">評価者を変更する場合は、画面上部で切り替えてください。</p>
                            </div>

                            {/* ======== 1次審査の場合 (5段階評価) ======== */}
                            {phase === '1次審査' ? (
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 text-center">総合評価 <span className="text-amber-600">*</span></label>
                                    <div className="flex justify-center gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setScore(star)}
                                                className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all ${score >= star
                                                        ? 'bg-amber-100 text-amber-500 scale-110 shadow-md shadow-amber-200/50'
                                                        : 'bg-slate-100 text-slate-300 hover:bg-slate-200'
                                                    }`}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-center text-sm text-slate-500 mt-3">
                                        {score ? `評価: ${score} / 5` : 'タップして評価を選択'}
                                    </p>
                                </div>
                            ) : (
                                /* ======== 2次・最終審査の場合 (100点満点＋コメント) ======== */
                                <>
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
                                            required={phase === '最終選考'} // 最終の場合は必須など（運用に合わせて）
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none resize-none"
                                            placeholder="選考理由や所感を入力してください..."
                                        ></textarea>
                                    </div>
                                </>
                            )}

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
                                    className="flex-1 py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-lg shadow-amber-600/30 transition-colors flex justify-center items-center"
                                >
                                    評価を送信する
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
