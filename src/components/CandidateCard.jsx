import React, { useState } from 'react';

export default function CandidateCard({ candidate, onEvaluate }) {
    const [isExpanded, setIsExpanded] = useState(false);

    // 評価項目のチェックボックス状況を配列化
    const evalChecks = [
        { label: "主体性・積極性", checked: candidate.eval1_check, note: candidate.eval1_note },
        { label: "他者への貢献・連携", checked: candidate.eval2_check, note: candidate.eval2_note },
        { label: "理念の体現", checked: candidate.eval3_check, note: candidate.eval3_note },
        { label: "専門性の発揮", checked: candidate.eval4_check, note: candidate.eval4_note },
        { label: "問題解決能力", checked: candidate.eval5_check, note: candidate.eval5_note },
        { label: "リーダーシップ", checked: candidate.eval6_check, note: candidate.eval6_note },
    ].filter(item => item.checked || item.note); // いずれかが入力されているものだけ抽出

    return (
        <div className="bg-white rounded-xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden hover:shadow-xl hover:border-amber-200 transition-all duration-300 group flex flex-col h-full">

            {/* 1. Header Section (Navy) */}
            <div className="bg-slate-900 p-5 pb-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

                <div className="flex justify-between items-start relative z-10 mb-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded inline-block ${candidate.docType === 'final' ? 'bg-amber-500 text-slate-900' : 'bg-slate-700 text-slate-300'}`}>
                        {candidate.docType === 'final' ? '最終選考' : 'エントリー'}
                    </span>
                    {candidate.fileUrls && candidate.fileUrls.length > 0 && (
                        <div className="bg-amber-500/20 text-amber-400 text-xs px-2 py-1 rounded border border-amber-500/30 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                            資料 {candidate.fileUrls.length}件
                        </div>
                    )}
                </div>

                <div className="relative z-10">
                    <h2 className="text-2xl font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">
                        {candidate.candidateName} <span className="text-sm font-normal text-slate-400 ml-2">{candidate.age ? `${candidate.age}歳` : ''} {candidate.yearsOfService ? `(勤続${candidate.yearsOfService}年)` : ''}</span>
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                        <svg className="w-4 h-4 text-amber-500/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                        <span>{candidate.hospitalName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                        <span>{candidate.department}</span>
                        <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                        <span>{candidate.jobTitle}</span>
                    </div>
                </div>
            </div>

            {/* 2. Primary Information Section (Always visible) */}
            <div className="p-5 flex-1 flex flex-col gap-5 relative bg-white">
                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 border-b border-slate-100 pb-1">活動テーマ ({candidate.startYear ? (String(candidate.startYear).match(/年/) ? `${candidate.startYear}` : `${candidate.startYear}年`) : '時期未定'})</h3>
                    <p className="text-slate-800 font-bold text-base leading-relaxed">{candidate.theme || '未入力'}</p>
                </div>

                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 border-b border-slate-100 pb-1">事由・活動の概要</h3>
                    <p className={`text-slate-600 text-sm leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`}>
                        {candidate.summary || candidate.reason || '未入力'}
                    </p>
                </div>

                {candidate.episode && (
                    <div className="mt-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 border-b border-slate-100 pb-1 flex items-center gap-1">
                            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                            特筆すべき具体的なエピソード
                        </h3>
                        <p className={`text-slate-600 text-sm leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`}>
                            {candidate.episode}
                        </p>
                    </div>
                )}

                {candidate.results && (
                    <div className="bg-amber-50/50 p-4 rounded-lg border border-amber-100/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-bl-full"></div>
                        <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2 flex items-center gap-1 relative z-10">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                            主な成果
                        </h3>
                        <p className="text-slate-800 text-sm font-medium relative z-10">{candidate.results}</p>
                    </div>
                )}

                {/* --- Expandable Area --- */}
                {isExpanded && (
                    <div className="border-t border-slate-100 pt-5 mt-2 space-y-6 animate-[fadeIn_0.3s_ease-out]">

                        {/* 最終選考の詳細データ */}
                        {(candidate.continuity || candidate.rippleEffect || candidate.socialContribution || candidate.selfAnalysis) && (
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-white bg-slate-800 inline-block px-2 py-1 rounded">最終選考 詳細データ</h3>

                                {candidate.continuity && (
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-500 mb-1">活動内容の継続性</h4>
                                        <p className="text-sm text-slate-700">{candidate.continuity}</p>
                                    </div>
                                )}
                                {candidate.rippleEffect && (
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-500 mb-1">他部署への波及効果</h4>
                                        <p className="text-sm text-slate-700">{candidate.rippleEffect}</p>
                                    </div>
                                )}
                                {candidate.socialContribution && (
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-500 mb-1">社会・地域貢献度</h4>
                                        <p className="text-sm text-slate-700">{candidate.socialContribution}</p>
                                    </div>
                                )}
                                {candidate.selfAnalysis && (
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-500 mb-1">自身が発揮した能力</h4>
                                        <p className="text-sm text-slate-700">{candidate.selfAnalysis}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 推薦者への特記事項リスト */}
                        {evalChecks.length > 0 && (
                            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                <h3 className="text-xs font-bold text-slate-500 mb-3 border-b border-slate-200 pb-2">該当する評価項目</h3>
                                <ul className="space-y-3">
                                    {evalChecks.map((item, idx) => (
                                        <li key={idx} className="flex gap-2">
                                            {item.checked ? (
                                                <svg className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                            ) : (
                                                <span className="w-4 h-4 mt-0.5 shrink-0"></span> // インデント合わせ
                                            )}
                                            <div className="flex-1">
                                                {item.checked && <span className="text-xs font-bold text-slate-700 block mb-0.5">{item.label}</span>}
                                                {item.note && <p className="text-sm text-slate-600">{item.note}</p>}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* 備考と推薦者情報 */}
                        <div className="bg-slate-100/50 rounded-lg p-4 text-sm">
                            <h3 className="text-xs font-bold text-slate-400 mb-2">備考</h3>
                            <p className="text-slate-700 mb-4">{candidate.remarks || 'なし'}</p>

                            <div className="flex justify-between items-end border-t border-slate-200 pt-3">
                                <div>
                                    <p className="text-xs text-slate-400">推薦者</p>
                                    <p className="font-bold text-slate-700">{candidate.recommenderName || '未記入'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-500">{candidate.recommenderDept}</p>
                                    <p className="text-xs text-slate-500">{candidate.recommenderTitle}</p>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
                {/* --- Expandable Area End --- */}

                {/* 3. Action Buttons Section */}
                <div className="mt-auto space-y-3 pt-5 border-t border-slate-100">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="w-full text-center py-2 text-xs font-bold text-slate-500 hover:text-amber-600 hover:bg-amber-50/50 rounded transition-colors flex items-center justify-center gap-1"
                    >
                        {isExpanded ? (
                            <>閉じる <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg></>
                        ) : (
                            <>全ての内容を読む <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg></>
                        )}
                    </button>

                    {candidate.fileUrls && candidate.fileUrls.length > 0 && (
                        <div className="space-y-2 w-full">
                            {candidate.fileUrls.map((url, idx) => (
                                <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="block w-full">
                                    <button className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-medium rounded border border-slate-200 shadow-sm transition-all focus:ring-2 focus:ring-amber-500 focus:outline-none">
                                        <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                        添付資料 {candidate.fileUrls.length > 1 ? `${idx + 1} ` : ''}を閲覧
                                    </button>
                                </a>
                            ))}
                        </div>
                    )}

                    <button
                        onClick={onEvaluate}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded shadow-lg shadow-slate-900/20 transition-all active:scale-[0.98] focus:ring-2 focus:ring-amber-500 focus:outline-none group/eval"
                    >
                        <svg className="w-4 h-4 text-amber-400 group-hover/eval:animate-bounce" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                        この候補者を評価する
                    </button>
                </div>
            </div>
        </div>
    );
}
