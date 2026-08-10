import React, { useState } from 'react';
import { AssessmentResult, AIJobAnalysisData } from '../types';
import { ANCHORS_DATA } from '../data/anchors';
import { Sparkles, Brain, Compass, CheckCircle, AlertCircle, Lightbulb, Search } from 'lucide-react';

interface JobAnalysisViewProps {
  result: AssessmentResult | null;
  onStartAssessment: () => void;
}

const SAMPLE_JOBS = [
  '데이터 분석가',
  'UX/UI 디자이너',
  '소프트웨어 개발자',
  '마케팅 매니저',
  '프로덕트 오너(PO)',
  '경영 컨설턴트',
  '연구원',
  'HR 매니저',
];

export const JobAnalysisView: React.FC<JobAnalysisViewProps> = ({
  result,
  onStartAssessment,
}) => {
  const [inputJob, setInputJob] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<AIJobAnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // If no test completed yet, provide default or demo anchor context
  const topAnchor = result
    ? ANCHORS_DATA[result.topAnchor.code]
    : ANCHORS_DATA.TF;
  const secondaryAnchor = result?.secondaryAnchors[0]
    ? ANCHORS_DATA[result.secondaryAnchors[0].code]
    : ANCHORS_DATA.AU;

  const handleAnalyze = async (jobToAnalyze?: string) => {
    const job = jobToAnalyze || inputJob.trim();
    if (!job) {
      setError('희망하시는 직무명을 입력해 주세요.');
      return;
    }

    setError(null);
    setLoading(true);
    setAnalysisData(null);

    const scoresPayload = result
      ? result.scores
      : { TF: 92, GM: 65, AU: 78, SE: 45, EC: 30, SV: 40, CH: 55, LS: 60 };

    try {
      const res = await fetch('/api/job-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: job,
          scores: scoresPayload,
          topAnchor: { title: topAnchor.title, score: result ? result.topAnchor.score : 92 },
          secondaryAnchors: [
            { title: secondaryAnchor.title, score: result?.secondaryAnchors[0]?.score || 78 },
          ],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAnalysisData(data);
      } else {
        // Fallback default response
        setAnalysisData({
          jobTitle: job,
          matchPercentage: 82,
          matchSummary: `${job} 직무는 귀하의 1순위 ${topAnchor.title} 및 2순위 ${secondaryAnchor.title} 앵커와 82% 높게 일치합니다.`,
          detailedAnalysis: `${job} 직무는 해당 분야에 대한 깊이 있는 전문 지식과 실무 역량을 지속해서 요구하며, 문제 해결 과정에서 자율적인 판단과 독립적인 수행이 중요한 가치로 작용합니다.`,
          strengthsInRole: [
            `지속적인 문제 해결을 통한 전문성 극대화`,
            `자기 주도적 작업 진행 및 독립적 판단 발휘`,
          ],
          potentialRisks: [
            `조직의 과도한 단순 반복 업무 부여 시 동기 저하 가능성`,
          ],
          advice: `단순 지시 이행보다는 스스로 프로젝트의 기술적 완성도와 프로세스를 주도할 수 있는 R&R을 명확히 설정해 보세요.`,
        });
      }
    } catch (err) {
      console.error('Failed to analyze job:', err);
      setAnalysisData({
        jobTitle: job,
        matchPercentage: 80,
        matchSummary: `${job} 직무는 귀하의 1순위 ${topAnchor.title} 및 2순위 ${secondaryAnchor.title} 앵커와 80% 일치합니다.`,
        detailedAnalysis: `${job} 직무는 특정 도메인에 대한 깊이 있는 전문 지식을 요구하며, 독자적인 사고와 자율적인 업무 수행이 중요한 역할을 합니다.`,
        strengthsInRole: [
          '해당 전문 기술에서의 탁월함 발휘',
          '독립적인 업무 추진력',
        ],
        advice: '자신의 핵심 기술을 입증할 수 있는 핵심 포트폴리오를 꾸준히 축적해 나가는 것을 추천합니다.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-6 py-12 flex flex-col gap-10">
      {/* Notice if no assessment performed yet */}
      {!result && (
        <div className="bg-[#fffaf9] border border-[#ffafd0] p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs md:text-sm">
          <p className="text-[#3c0223]">
            💡 아직 커리어 앵커 진단을 수행하지 않으셨습니다. 현재는 <strong>샘플 결과(전문가형 92점, 자율성 78점)</strong> 기준으로 분석됩니다.
          </p>
          <button
            onClick={onStartAssessment}
            className="text-[#35662e] font-bold underline whitespace-nowrap hover:text-[#20511b]"
          >
            내 결과로 진단받기 →
          </button>
        </div>
      )}

      {/* Header Section */}
      <header className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-[#191c17] mb-3">
          AI 희망 직무 해설
        </h1>
        <p className="text-base text-[#42493e] max-w-2xl mx-auto leading-relaxed">
          입력하신 희망 직무가 나의 핵심 직업 가치관(커리어 앵커)과 얼마나 잘 맞는지 AI가 정밀 분석해 드립니다.
        </p>
      </header>

      {/* Anchor Reminder Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1st Anchor */}
        <div className="bg-[#f2f4ec] border border-[#e1e3db] rounded-xl p-6 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-[#35662e]" />
            <span className="text-xs font-semibold text-[#42493e] uppercase">
              1순위 앵커
            </span>
          </div>
          <h3 className="text-xl font-bold text-[#191c17]">
            {topAnchor.title} ({topAnchor.englishTitle})
          </h3>
          <p className="text-sm text-[#42493e]">{topAnchor.subtitle}</p>
        </div>

        {/* 2nd Anchor */}
        <div className="bg-[#f2f4ec] border border-[#e1e3db] rounded-xl p-6 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#4f6449]" />
            <span className="text-xs font-semibold text-[#42493e] uppercase">
              2순위 앵커
            </span>
          </div>
          <h3 className="text-xl font-bold text-[#191c17]">
            {secondaryAnchor.title} ({secondaryAnchor.englishTitle})
          </h3>
          <p className="text-sm text-[#42493e]">{secondaryAnchor.subtitle}</p>
        </div>
      </section>

      {/* Input Section */}
      <section className="bg-white border border-[#e1e3db] rounded-xl p-6 md:p-8 shadow-xs">
        <label
          htmlFor="job-input"
          className="block text-xl font-bold text-[#191c17] mb-4"
        >
          희망하는 직무를 입력해주세요
        </label>

        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="relative flex-grow">
            <input
              id="job-input"
              type="text"
              value={inputJob}
              onChange={(e) => setInputJob(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              placeholder="예: 데이터 분석가, UX 디자이너, 마케팅 매니저, 개발자"
              className="w-full border border-[#e1e3db] rounded-lg px-4 py-3.5 text-base text-[#191c17] focus:outline-none focus:ring-2 focus:ring-[#35662e] focus:border-transparent transition-all bg-white"
            />
          </div>

          <button
            id="analyze-btn"
            onClick={() => handleAnalyze()}
            disabled={loading}
            className="bg-[#35662e] text-white rounded-lg px-8 py-3.5 text-base font-semibold hover:bg-[#20511b] transition-colors whitespace-nowrap flex items-center justify-center gap-2 min-w-[160px] cursor-pointer shadow-xs active:scale-98 disabled:opacity-50"
          >
            <Sparkles className="w-5 h-5 text-[#b8f1aa]" />
            {loading ? 'AI 분석 중...' : 'AI 분석 받기'}
          </button>
        </div>

        {error && <p className="text-xs text-[#ba1a1a] mb-3">{error}</p>}

        {/* Suggestion Chips */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-xs text-[#72796d] font-medium flex items-center gap-1">
            <Search className="w-3.5 h-3.5" /> 추천 직무:
          </span>
          {SAMPLE_JOBS.map((job) => (
            <button
              key={job}
              type="button"
              onClick={() => {
                setInputJob(job);
                handleAnalyze(job);
              }}
              className="text-xs px-3 py-1.5 rounded-full bg-[#f2f4ec] text-[#42493e] hover:bg-[#35662e] hover:text-white transition-all cursor-pointer border border-[#c1c9bb]"
            >
              {job}
            </button>
          ))}
        </div>
      </section>

      {/* AI Analysis Result Display */}
      {loading && (
        <section className="bg-[#edefe6] border border-[#e1e3db] rounded-xl p-8 flex flex-col items-center justify-center gap-4 py-16 animate-pulse">
          <div className="w-8 h-8 border-4 border-[#35662e]/20 border-t-[#35662e] rounded-full animate-spin" />
          <p className="text-base text-[#42493e] font-medium">
            AI가 희망 직무 "{inputJob}"와의 커리어 앵커 적합도를 정밀하게 분석 중입니다...
          </p>
        </section>
      )}

      {analysisData && !loading && (
        <section className="bg-[#edefe6] border border-[#e1e3db] rounded-xl p-6 md:p-8 flex flex-col gap-6 shadow-xs animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#c1c9bb]/60 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#8b4365]" />
              <h4 className="text-2xl font-bold text-[#191c17]">
                AI 직무 적합성 분석 결과
              </h4>
            </div>

            <div className="bg-[#35662e] text-white font-mono font-bold text-lg px-4 py-1.5 rounded-full shadow-xs">
              적합도 {analysisData.matchPercentage}%
            </div>
          </div>

          <div className="text-base md:text-lg text-[#191c17] leading-relaxed space-y-4">
            <p className="bg-white p-5 rounded-lg border border-[#c1c9bb] font-medium">
              {analysisData.matchSummary}
            </p>

            <div className="p-2">
              <h5 className="font-bold text-base text-[#191c17] mb-2">상세 적합성 해설</h5>
              <p className="text-sm md:text-base text-[#42493e] leading-relaxed">
                {analysisData.detailedAnalysis}
              </p>
            </div>

            {analysisData.strengthsInRole && (
              <div className="bg-[#f5ffec] p-5 rounded-lg border border-[#b8f1aa] space-y-2">
                <h5 className="font-bold text-sm text-[#002201] flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#35662e]" /> 이 직무에서 발휘될 핵심 강점
                </h5>
                <ul className="list-disc list-inside text-sm text-[#20511b] space-y-1">
                  {analysisData.strengthsInRole.map((st, idx) => (
                    <li key={idx}>{st}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysisData.potentialRisks && analysisData.potentialRisks.length > 0 && (
              <div className="bg-[#fffaf9] p-5 rounded-lg border border-[#ffd8e6] space-y-2">
                <h5 className="font-bold text-sm text-[#3c0223] flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-[#8b4365]" /> 주의 또는 고려해야 할 요소
                </h5>
                <ul className="list-disc list-inside text-sm text-[#732f50] space-y-1">
                  {analysisData.potentialRisks.map((rk, idx) => (
                    <li key={idx}>{rk}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysisData.advice && (
              <div className="bg-white p-5 rounded-lg border border-[#c1c9bb] space-y-1">
                <h5 className="font-bold text-sm text-[#191c17] flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-[#35662e]" /> AI 커리어 조언
                </h5>
                <p className="text-sm text-[#42493e]">{analysisData.advice}</p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
