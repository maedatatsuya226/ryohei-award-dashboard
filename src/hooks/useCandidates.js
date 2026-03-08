import { useState, useEffect } from 'react';

// === モックデータは万が一のフォールバック用に温存（不要であれば削除可） ===
import { mockCandidates } from '../data/mockCandidates';

export function useCandidates() {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCandidates = async () => {
            setLoading(true);
            setError(null);

            // 環境変数からGASのウェブアプリURLを取得
            // VITE_GAS_API_URL が設定されていない場合は、エラーを出すかモックを使用する
            const GAS_URL = import.meta.env.VITE_GAS_API_URL;

            if (!GAS_URL) {
                console.warn("VITE_GAS_API_URL is not set. Using mock data for demonstration.");
                setTimeout(() => {
                    setCandidates(mockCandidates);
                    setLoading(false);
                }, 800);
                return;
            }

            try {
                const response = await fetch(GAS_URL);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const json = await response.json();

                if (json.status !== 'success') {
                    throw new Error(json.message || 'API responded with error statu');
                }

                // GASからのJSONデータを、Dashboardの既存のキー（英語）にマッピングする
                const mappedData = json.data.map((row) => {
                    return {
                        id: row.id,

                        // 基本情報
                        docType: row['選考種別'] === '最終選考' ? 'final' : 'entry',
                        candidateName: row['対象者名'] || '',
                        hospitalName: row['病院名'] || '',
                        department: row['所属部署'] || '',
                        jobTitle: row['職種'] || '',
                        age: row['年齢'] || '',
                        yearsOfService: row['勤続年数'] || '',

                        // エントリー用
                        reason: row['推薦理由'] || '',
                        episode: row['特筆エピソード'] || '',

                        // 最終選考用
                        theme: row['活動テーマ'] || '',
                        startYear: row['活動開始年'] || '',
                        summary: row['活動概要'] || '',
                        results: row['活動の成果'] || '',
                        continuity: row['継続性・発展性'] || '',
                        rippleEffect: row['波及効果・拡張性'] || '',
                        socialContribution: row['社会貢献度'] || '',
                        selfAnalysis: row['自己分析・改善点'] || '',

                        // 評価項目 (GASでは '☑' or '□' で出力されている)
                        eval1_check: row['評価1_医療貢献(済)'] && row['評価1_医療貢献(済)'].includes('☑'),
                        eval1_note: row['評価1_備考'] || '',
                        eval2_check: row['評価2_業務改善(済)'] && row['評価2_業務改善(済)'].includes('☑'),
                        eval2_note: row['評価2_備考'] || '',
                        eval3_check: row['評価3_対外活動(済)'] && row['評価3_対外活動(済)'].includes('☑'),
                        eval3_note: row['評価3_備考'] || '',
                        eval4_check: row['評価4_多職種連携(済)'] && row['評価4_多職種連携(済)'].includes('☑'),
                        eval4_note: row['評価4_備考'] || '',
                        eval5_check: row['評価5_次世代(済)'] && row['評価5_次世代(済)'].includes('☑'),
                        eval5_note: row['評価5_備考'] || '',
                        eval6_check: row['評価6_その他(済)'] && row['評価6_その他(済)'].includes('☑'),
                        eval6_note: row['評価6_備考'] || '',

                        // その他
                        remarks: row['備考'] || '',
                        recommenderName: row['推薦者_氏名'] || '',
                        recommenderDept: row['推薦者_所属'] || '',
                        recommenderTitle: row['推薦者_役職'] || '',

                        // ファイル
                        fileUrl: row['添付ファイルURL'] || null,
                        fileName: row['添付ファイルURL'] ? '【添付】関連資料を開く' : null,

                        // NEW: 評価済み審査員リスト
                        evaluatedBy: row.evaluatedBy || [],
                    };
                });

                // データの新しい順（IDの降順）などに並び替える場合はここで
                const sortedData = mappedData.reverse();

                setCandidates(sortedData);

            } catch (err) {
                console.error('Failed to fetch from GAS:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCandidates();
    }, []);

    return { candidates, loading, error };
}
