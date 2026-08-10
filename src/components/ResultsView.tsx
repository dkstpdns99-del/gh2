import React, { useState, useEffect, useRef } from 'react';
import { AssessmentResult, AIInsightData } from '../types';
import { ANCHORS_DATA } from '../data/anchors';
import { RadarChart } from './RadarChart';
import { Sparkles, ChevronDown, Award, Briefcase, Target, AlertTriangle, ArrowRight, Download, Printer, RefreshCw, FileText, CheckCircle2 } from 'lucide-react';
import html2pdf from 'html2pdf.js';

interface ResultsViewProps {
  result: AssessmentResult;
  onNavigateJobAnalysis: () => void;
  onRetake: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  result,
  onNavigateJobAnalysis,
  onRetake,
}) => {
  const [aiInsight, setAiInsight] = useState<AIInsightData | null>(null);
  const [loadingAi, setLoadingAi] = useState<boolean>(true);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(result.topAnchor.code);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [pdfSuccess, setPdfSuccess] = useState<boolean>(false);

  const reportRef = useRef<HTMLDivElement>(null);
  const topAnchorInfo = ANCHORS_DATA[result.topAnchor.code];

  useEffect(() => {
    async function fetchAiInsight() {
      setLoadingAi(true);
      try {
        const res = await fetch('/api/ai-insight', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            scores: result.scores,
            topAnchor: result.topAnchor,
            secondaryAnchors: result.secondaryAnchors,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setAiInsight(data);
        } else {
          // Fallback static insight
          setAiInsight({
            summary: `${topAnchorInfo.title} 지향성이 매우 뚜렷합니다. 관리직으로의 승진보다는 해당 직무 분야에서 최고의 전문가로 인정받는 환경을 강력히 선호하며, 끊임없는 기술적 도전과 깊이 있는 연구를 통해 높은 성취감을 느낍니다.`,
            preferredEnvironments: topAnchorInfo.idealEnvironments,
            avoidEnvironments: ['마이크로매니징이 심한 관료적 조직', '전문성 향상 기회가 부족하고 단기 성과만 요구하는 환경'],
            careerTips: ['해당 분야 최신 트렌드/자격증 취득', '독립적인 실무 재량권 확보'],
          });
        }
      } catch (e) {
        console.error('Failed to fetch AI insight:', e);
        setAiInsight({
          summary: `${topAnchorInfo.title} 지향성이 높습니다. 자신의 전문성을 발휘하고 인정받을 때 최고의 직업적 만족을 느끼는 타입입니다.`,
          preferredEnvironments: topAnchorInfo.idealEnvironments,
          avoidEnvironments: ['자율성과 전문성이 제한된 단조로운 환경'],
          careerTips: ['지속적인 전문 기술 습득 및 프로젝트 리드'],
        });
      } finally {
        setLoadingAi(false);
      }
    }

    fetchAiInsight();
  }, [result]);

  const toggleAccordion = (code: string) => {
    setActiveAccordion((prev) => (prev === code ? null : code));
  };

  const handleDownloadPdf = async () => {
    if (!reportRef.current || isGeneratingPdf) return;

    setIsGeneratingPdf(true);
    setPdfSuccess(false);

    try {
      const element = reportRef.current;
      const todayStr = new Date().toISOString().slice(0, 10);
      const filename = `커리어앵커_진단결과_리포트_${todayStr}.pdf`;

      const options = {
        margin: [10, 10, 10, 10] as [number, number, number, number], // top, left, bottom, right in mm
        filename: filename,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          windowWidth: 1200,
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      };

      await html2pdf().set(options as any).from(element).save();
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 4000);
    } catch (error) {
      console.error('PDF generation failed:', error);
      // Fallback to window.print() if html2pdf encounters an issue
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = async () => {
    if (!reportRef.current) return;

    try {
      // Remove any previously appended print iframe
      const existingFrame = document.getElementById('print-iframe');
      if (existingFrame) {
        document.body.removeChild(existingFrame);
      }

      // Create a hidden print iframe
      const iframe = document.createElement('iframe');
      iframe.id = 'print-iframe';
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow?.document;
      if (!doc) {
        window.print();
        return;
      }

      // Extract stylesheets from current document
      const styleSheets = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
        .map((s) => s.outerHTML)
        .join('\n');

      const content = reportRef.current.innerHTML;

      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html lang="ko">
          <head>
            <meta charset="utf-8">
            <title>나만의 커리어앵커 진단 리포트</title>
            ${styleSheets}
            <style>
              body { background: #ffffff !important; color: #191c17 !important; padding: 20px; font-family: sans-serif; }
              .print\\:hidden { display: none !important; }
              @page { size: A4 portrait; margin: 10mm; }
            </style>
          </head>
          <body>
            ${content}
          </body>
        </html>
      `);
      doc.close();

      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (e) {
          console.warn('Iframe print failed, attempting direct window.print or fallback:', e);
          try {
            window.print();
          } catch (err2) {
            handleDownloadPdf();
          }
        }
      }, 400);
    } catch (err) {
      console.warn('Print creation failed, falling back to PDF download:', err);
      handleDownloadPdf();
    }
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6 py-12">
      {/* Top Action Bar for PDF & Retake */}
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#e1e3db] shadow-xs print:hidden">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#35662e]" />
          <span className="text-sm font-semibold text-[#191c17]">
            진단 결과 리포트 저장
          </span>
          {pdfSuccess && (
            <span className="text-xs bg-[#f5ffec] text-[#20511b] border border-[#b8f1aa] px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#35662e]" /> 다운로드 완료!
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="download-pdf-btn"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="bg-[#35662e] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#20511b] transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-95 disabled:opacity-60"
          >
            {isGeneratingPdf ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                PDF 생성 중...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                PDF 리포트 다운로드
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="bg-[#f2f4ec] text-[#191c17] px-4 py-2.5 rounded-lg text-sm font-medium border border-[#c1c9bb] hover:bg-[#e7e9e0] transition-colors flex items-center gap-2 cursor-pointer"
            title="브라우저 인쇄 / PDF 저장"
          >
            <Printer className="w-4 h-4 text-[#42493e]" />
            인쇄 / PDF 저장
          </button>

          <button
            onClick={onRetake}
            className="text-[#42493e] hover:text-[#35662e] px-3 py-2.5 text-sm font-medium transition-colors flex items-center gap-1.5 ml-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            진단 다시하기
          </button>
        </div>
      </div>

      {/* Printable Report Container */}
      <div ref={reportRef} className="bg-white p-2 md:p-6 rounded-2xl">
        {/* Result Summary Header */}
        <section className="text-center mb-12">
          <p className="text-xs font-mono font-medium text-[#42493e] mb-3 tracking-widest uppercase">
            Career Anchor Diagnostic Report
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-[#35662e] mb-6 leading-tight">
            당신의 핵심 앵커는 <br className="hidden md:inline" />
            <span style={{ color: topAnchorInfo.color }}>
              {topAnchorInfo.title}({topAnchorInfo.englishTitle})
            </span>
            입니다.
          </h1>
          <p className="text-base md:text-lg text-[#42493e] max-w-2xl mx-auto leading-relaxed">
            {topAnchorInfo.longDescription}
          </p>
        </section>

        {/* Main Dashboard Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Radar Chart Area (7 cols on lg) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-[#e1e3db] p-6 md:p-8 flex flex-col items-center justify-center shadow-xs">
            <h2 className="text-xl font-semibold text-[#191c17] mb-6 self-start">
              커리어 가치관 프로필 (8대 앵커 점수)
            </h2>
            <RadarChart scores={result.scores} />
          </div>

          {/* AI Insight & Secondary Anchors (5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* AI Box */}
            <div className="bg-[#edefe6] rounded-xl border border-[#e1e3db] p-6 md:p-8 flex-1 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-4 text-[#4f6449]">
                <Sparkles className="w-5 h-5 text-[#35662e]" />
                <span className="text-lg font-semibold text-[#191c17]">AI 커리어 인사이트</span>
              </div>

              {loadingAi ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 bg-[#e1e3db] rounded w-full"></div>
                  <div className="h-4 bg-[#e1e3db] rounded w-5/6"></div>
                  <div className="h-4 bg-[#e1e3db] rounded w-4/6"></div>
                  <p className="text-xs text-[#72796d] mt-4">AI가 당신의 8개 앵커 프로필을 정밀 분석 중입니다...</p>
                </div>
              ) : (
                <div className="space-y-4 text-sm md:text-base text-[#191c17] leading-relaxed">
                  <p>{aiInsight?.summary}</p>

                  {aiInsight?.preferredEnvironments && aiInsight.preferredEnvironments.length > 0 && (
                    <div className="pt-2 border-t border-[#c1c9bb]/60">
                      <span className="font-semibold text-xs text-[#35662e] block mb-1">
                        💡 추천 근무 환경:
                      </span>
                      <ul className="list-disc list-inside text-xs md:text-sm text-[#42493e] space-y-1">
                        {aiInsight.preferredEnvironments.slice(0, 3).map((env, i) => (
                          <li key={i}>{env}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Secondary High Scores Box */}
            <div className="bg-white rounded-xl border border-[#e1e3db] p-6 md:p-8 shadow-xs">
              <h3 className="text-lg font-semibold text-[#191c17] mb-5">
                주목해야 할 서브 앵커
              </h3>
              <div className="space-y-5">
                {result.secondaryAnchors.map((sub, idx) => {
                  const subInfo = ANCHORS_DATA[sub.code];
                  return (
                    <div key={sub.code}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span
                          className="text-xs font-mono font-semibold"
                          style={{ color: subInfo.color }}
                        >
                          {idx + 2}순위: {subInfo.title} ({subInfo.englishTitle})
                        </span>
                        <span className="text-sm font-medium text-[#42493e]">
                          {sub.score}점
                        </span>
                      </div>
                      <div className="w-full bg-[#e1e3db] rounded-full h-2 overflow-hidden">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${sub.score}%`,
                            backgroundColor: subInfo.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Accordion / List Section */}
        <section className="max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-[#191c17] mb-8 text-center">
            8가지 앵커 상세 분석
          </h2>

          <div className="bg-white rounded-xl border border-[#e1e3db] divide-y divide-[#e1e3db] shadow-xs">
            {Object.values(ANCHORS_DATA).map((anchor) => {
              const score = result.scores[anchor.code] || 0;
              const isOpen = activeAccordion === anchor.code;

              return (
                <div key={anchor.code} className="transition-colors">
                  <button
                    type="button"
                    onClick={() => toggleAccordion(anchor.code)}
                    className="w-full flex justify-between items-center p-6 md:p-8 text-left focus:outline-none hover:bg-[#f2f4ec] transition-colors"
                  >
                    <div>
                      <span
                        className="text-xs font-mono font-semibold block mb-1"
                        style={{ color: anchor.color }}
                      >
                        {anchor.englishTitle}
                      </span>
                      <span className="text-lg font-bold text-[#191c17]">
                        {anchor.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className="text-2xl font-bold font-mono"
                        style={{ color: anchor.color }}
                      >
                        {score}점
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-[#72796d] transition-transform duration-300 print:hidden ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 md:px-8 pb-8 space-y-4 text-sm text-[#42493e] border-t border-[#f2f4ec]">
                      <p className="leading-relaxed mt-4">{anchor.longDescription}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div className="bg-[#f2f4ec] p-4 rounded-lg">
                          <span className="font-semibold text-[#191c17] flex items-center gap-1.5 mb-2">
                            <Target className="w-4 h-4 text-[#35662e]" /> 핵심 가치
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {anchor.coreValues.map((v, i) => (
                              <span key={i} className="bg-white px-2.5 py-1 rounded-md text-xs font-medium text-[#191c17] border border-[#c1c9bb]">
                                {v}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-[#f2f4ec] p-4 rounded-lg">
                          <span className="font-semibold text-[#191c17] flex items-center gap-1.5 mb-2">
                            <Briefcase className="w-4 h-4 text-[#35662e]" /> 추천 직무 예시
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {anchor.recommendedCareers.map((c, i) => (
                              <span key={i} className="bg-white px-2.5 py-1 rounded-md text-xs font-medium text-[#191c17] border border-[#c1c9bb]">
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Footer info for report */}
        <div className="pt-8 border-t border-[#e1e3db] text-center text-xs text-[#72796d] space-y-1">
          <p className="font-bold text-[#191c17]">나만의 커리어앵커 - Edgar Schein 8-Anchor Diagnostic Report</p>
          <p>진단 완료일: {new Date(result.completedAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* CTA Banner to AI Job Analyzer */}
      <div className="mt-12 bg-[#f5ffec] border border-[#b8f1aa] rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs print:hidden">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="text-xl font-bold text-[#002201] flex items-center justify-center md:justify-start gap-2">
            <Sparkles className="w-5 h-5 text-[#35662e]" />
            내가 꿈꾸는 직무와 커리어 앵커가 잘 맞을까?
          </h3>
          <p className="text-sm text-[#20511b]">
            AI 희망 직무 적합성 분석에서 데이터 분석가, UX 디자이너, 개발자 등 희망 직무를 입력해 보세요.
          </p>
        </div>
        <button
          onClick={onNavigateJobAnalysis}
          className="bg-[#35662e] text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-[#20511b] transition-all flex items-center gap-2 whitespace-nowrap shadow-xs cursor-pointer active:scale-95"
        >
          AI 희망 직무 해설 받기
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

