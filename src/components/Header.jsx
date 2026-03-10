import React from 'react';

export default function Header({
    filterText, setFilterText,
    filterHospital, setFilterHospital,
    filterDepartment, setFilterDepartment,
    filterJobTitle, setFilterJobTitle,
    uniqueHospitals, uniqueDepartments, uniqueJobTitles,
    currentReviewer, setCurrentReviewer,
    showEvaluated, setShowEvaluated,
    reviewers = [],
    phase
}) {
    return (
        <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50 border-b border-amber-500/30">
            {/* Top Header Row */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row justify-between items-center py-4 gap-4">

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <svg className="w-6 h-6 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-serif font-bold tracking-wider text-slate-50">良平アワード</h1>
                                <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                    {phase}
                                </span>
                            </div>
                            <p className="text-xs text-amber-400/80 tracking-widest uppercase mt-0.5">Review Dashboard</p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto">

                        {/* ログイン（審査員選択）と未審査トグル */}
                        <div className="flex items-center gap-3 bg-slate-800/80 px-4 py-2 rounded-lg border border-slate-700 w-full md:w-auto shrink-0 justify-center">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400 whitespace-nowrap">あなたの名前:</span>
                                <select
                                    value={currentReviewer}
                                    onChange={(e) => setCurrentReviewer(e.target.value)}
                                    className="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm text-amber-400 focus:outline-none focus:border-amber-500 max-w-[120px] truncate"
                                >
                                    <option value="">（未選択）</option>
                                    {reviewers.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>

                            {currentReviewer && (
                                <label className="flex items-center gap-2 cursor-pointer border-l border-slate-700 pl-3">
                                    <input
                                        type="checkbox"
                                        checked={!showEvaluated}
                                        onChange={(e) => setShowEvaluated(!e.target.checked)}
                                        className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-600 focus:ring-amber-500 focus:ring-offset-slate-800"
                                    />
                                    <span className="text-xs text-slate-300 font-medium whitespace-nowrap">未審査のみ</span>
                                </label>
                            )}
                        </div>

                        {/* 検索バー */}
                        <div className="w-full md:w-64 shrink-0 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-slate-700 rounded-lg leading-5 bg-slate-800 text-slate-100 placeholder-slate-400 focus:outline-none focus:bg-slate-700 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition-colors"
                                placeholder="フリーワード検索..."
                                value={filterText}
                                onChange={(e) => setFilterText(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Row */}
            <div className="bg-slate-800/50 border-t border-slate-700/50 py-3">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap gap-3 items-center text-sm">
                    <span className="text-slate-400 font-bold hidden md:inline-block mr-2">
                        <svg className="w-4 h-4 inline-block -mt-0.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                        絞り込み
                    </span>

                    <select
                        className="bg-slate-700 text-slate-200 border border-slate-600 rounded px-3 py-1.5 focus:outline-none focus:border-amber-500 text-sm"
                        value={filterHospital}
                        onChange={(e) => setFilterHospital(e.target.value)}
                    >
                        <option value="">すべての病院</option>
                        {uniqueHospitals.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>

                    <select
                        className="bg-slate-700 text-slate-200 border border-slate-600 rounded px-3 py-1.5 focus:outline-none focus:border-amber-500 text-sm"
                        value={filterDepartment}
                        onChange={(e) => setFilterDepartment(e.target.value)}
                    >
                        <option value="">すべての所属（部署）</option>
                        {uniqueDepartments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>

                    <select
                        className="bg-slate-700 text-slate-200 border border-slate-600 rounded px-3 py-1.5 focus:outline-none focus:border-amber-500 text-sm"
                        value={filterJobTitle}
                        onChange={(e) => setFilterJobTitle(e.target.value)}
                    >
                        <option value="">すべての職種</option>
                        {uniqueJobTitles.map(j => <option key={j} value={j}>{j}</option>)}
                    </select>

                    {/* クリアボタン */}
                    {(filterHospital || filterDepartment || filterJobTitle) && (
                        <button
                            onClick={() => { setFilterHospital(''); setFilterDepartment(''); setFilterJobTitle(''); }}
                            className="text-slate-400 hover:text-white underline text-xs ml-auto transition-colors"
                        >
                            条件をリセット
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}
