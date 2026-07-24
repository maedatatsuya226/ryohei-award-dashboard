import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import CandidateCard from './components/CandidateCard';
import EvaluationModal from './components/EvaluationModal';
import ReviewerLoginModal from './components/ReviewerLoginModal';
import { useCandidates } from './hooks/useCandidates';

function App() {
  const { candidates, phase, loading, error, markEvaluated } = useCandidates();

  // States for Modals
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // States for Filtering
  const [filterText, setFilterText] = useState('');
  const [filterHospital, setFilterHospital] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterJobTitle, setFilterJobTitle] = useState('');

  // States for Reviewer filtering
  const [currentReviewer, setCurrentReviewer] = useState(() => localStorage.getItem('ryohei_evaluator') || '');
  const [showEvaluated, setShowEvaluated] = useState(false);
  const [reviewers, setReviewers] = useState([]);

  // 評価者リストを取得
  useEffect(() => {
    const fetchReviewers = async () => {
      try {
        const GAS_URL = import.meta.env.VITE_GAS_API_URL;
        if (!GAS_URL) return;
        const response = await fetch(`${GAS_URL}?action=getReviewers`);
        const json = await response.json();
        if (Array.isArray(json)) {
          setReviewers(json);
        }
      } catch (err) {
        console.error('Failed to fetch reviewers:', err);
      }
    };
    fetchReviewers();
  }, []);

  // 1. 各項目のユニークなリストを生成（プルダウン用）
  const uniqueHospitals = useMemo(() => [...new Set(candidates.map(c => c.hospitalName).filter(Boolean))].sort(), [candidates]);
  const uniqueDepartments = useMemo(() => [...new Set(candidates.map(c => c.department).filter(Boolean))].sort(), [candidates]);
  const uniqueJobTitles = useMemo(() => [...new Set(candidates.map(c => c.jobTitle).filter(Boolean))].sort(), [candidates]);

  // 2. フィルタリング処理（プルダウン ＋ フリーワードのAND検索 ＋ 評価済みフィルタ）
  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => {
      // 評価済みフィルタ（未審査のみ表示設定のとき、すでに評価済みなら除外）
      if (!showEvaluated && currentReviewer) {
        if (c.evaluatedBy && c.evaluatedBy.includes(currentReviewer)) {
          return false;
        }
      }

      // プルダウンによる完全一致フィルター
      if (filterHospital && c.hospitalName !== filterHospital) return false;
      if (filterDepartment && c.department !== filterDepartment) return false;
      if (filterJobTitle && c.jobTitle !== filterJobTitle) return false;

      // フェーズ・docTypeによる対象者の絞り込み
      if (phase === '1次審査') {
        if (c.docType !== 'entry') return false;
      }
      if (phase === '2次審査') {
        if (c.docType !== 'entry' || !c.advancedTo2nd) return false;
      }
      if (phase === '最終選考') {
        // 最終選考用のデータは無条件で表示。エントリー用データは最終選考進出フラグが立っている人のみ表示
        if (c.docType === 'final') return true;
        if (c.docType === 'entry' && !c.advancedToFinal) return false;
      }

      // フリーワードによる部分一致検索
      if (filterText) {
        const lowerFilter = filterText.toLowerCase();
        const matchesText =
          (c.candidateName && c.candidateName.toLowerCase().includes(lowerFilter)) ||
          (c.hospitalName && c.hospitalName.toLowerCase().includes(lowerFilter)) ||
          (c.department && c.department.toLowerCase().includes(lowerFilter)) ||
          (c.jobTitle && c.jobTitle.toLowerCase().includes(lowerFilter)) ||
          (c.theme && c.theme.toLowerCase().includes(lowerFilter));

        if (!matchesText) return false;
      }

      return true; // 全条件をクリアしたら表示
    });
  }, [candidates, filterText, filterHospital, filterDepartment, filterJobTitle, currentReviewer, showEvaluated]);

  const resetAllFilters = () => {
    setFilterText('');
    setFilterHospital('');
    setFilterDepartment('');
    setFilterJobTitle('');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      <Header
        filterText={filterText} setFilterText={setFilterText}
        filterHospital={filterHospital} setFilterHospital={setFilterHospital}
        filterDepartment={filterDepartment} setFilterDepartment={setFilterDepartment}
        filterJobTitle={filterJobTitle} setFilterJobTitle={setFilterJobTitle}
        uniqueHospitals={uniqueHospitals}
        uniqueDepartments={uniqueDepartments}
        uniqueJobTitles={uniqueJobTitles}
        currentReviewer={currentReviewer}
        setCurrentReviewer={(name) => {
          setCurrentReviewer(name);
          localStorage.setItem('ryohei_evaluator', name);
        }}
        showEvaluated={showEvaluated}
        setShowEvaluated={setShowEvaluated}
        reviewers={reviewers}
        phase={phase}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded shadow-sm">
            <p className="text-red-700 font-medium">データの取得に失敗しました: {error}</p>
          </div>
        )}

        {/* 状態に応じたUIの出し分け */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium animate-pulse">候補者データを読み込み中...</p>
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-slate-200">
            <svg className="mx-auto h-12 w-12 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-slate-900">該当する候補者が見つかりません</h3>
            <p className="mt-1 text-slate-500 text-sm">検索条件を変更してお試しください。</p>
            <button
              onClick={resetAllFilters}
              className="mt-4 px-4 py-2 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-md text-sm font-medium transition-colors border border-amber-200"
            >
              全ての絞り込みをクリア
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6 flex justify-between items-end">
              <h2 className="text-xl font-bold text-slate-800">
                審査対象一覧 <span className="text-sm font-normal text-slate-500 ml-2">({filteredCandidates.length}件)</span>
              </h2>
            </div>

            {/* Masonry Layout Container */}
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {filteredCandidates.map((candidate) => (
                <div key={candidate.id} className="break-inside-avoid">
                  <CandidateCard
                    candidate={candidate}
                    onEvaluate={() => setSelectedCandidate(candidate)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal conditionally rendered over everything */}
      {selectedCandidate && (
        <EvaluationModal
          candidate={selectedCandidate}
          phase={phase}
          currentReviewer={currentReviewer}
          onEvaluated={markEvaluated}
          onClose={() => setSelectedCandidate(null)}
        />
      )}

      {/* 初期ログイン（審査員選択）モーダル */}
      {!currentReviewer && (
        <ReviewerLoginModal
          reviewers={reviewers}
          onSelect={(name) => {
            setCurrentReviewer(name);
            localStorage.setItem('ryohei_evaluator', name);
          }}
        />
      )}
    </div>
  );
}

export default App;
