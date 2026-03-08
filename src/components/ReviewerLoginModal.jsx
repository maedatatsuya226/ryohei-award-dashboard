import React, { useState } from 'react';

export default function ReviewerLoginModal({ reviewers = [], onSelect }) {
    const [selectedName, setSelectedName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedName) {
            onSelect(selectedName);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-[fadeIn_0.3s_ease-out]">
                <div className="bg-slate-900 px-6 py-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 mx-auto mb-4 rotate-3">
                        <svg className="w-10 h-10 text-slate-900 -rotate-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-wider">良平アワード 審査ダッシュボード</h2>
                    <p className="text-amber-400/80 text-sm mt-1">Reviewer Login</p>
                </div>

                <div className="p-8">
                    <div className="mb-6 text-center">
                        <h3 className="text-lg font-bold text-slate-800 mb-2">審査員を選択してください</h3>
                        <p className="text-sm text-slate-500">
                            ご自身のお名前を選択すると、<br />
                            あなたがまだ審査していない候補者のみが表示されます。
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            {reviewers.length === 0 ? (
                                <div className="text-center p-4 rounded-lg bg-slate-50 text-slate-500 text-sm border border-slate-200 animate-pulse">
                                    審査員リストを読み込み中...
                                </div>
                            ) : (
                                <select
                                    required
                                    value={selectedName}
                                    onChange={(e) => setSelectedName(e.target.value)}
                                    className="w-full text-lg p-4 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-white font-medium text-slate-700 transition-all cursor-pointer"
                                >
                                    <option value="" disabled>▼ ここからお名前を選択</option>
                                    {reviewers.map(r => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={!selectedName || reviewers.length === 0}
                            className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-lg shadow-amber-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg flex justify-center items-center group"
                        >
                            ダッシュボードを開く
                            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
