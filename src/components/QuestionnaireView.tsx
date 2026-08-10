import React, { useState } from 'react';
import { QUESTIONS, TOTAL_PAGES, QUESTIONS_PER_PAGE } from '../data/questions';
import { Responses } from '../types';
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

interface QuestionnaireViewProps {
  responses: Responses;
  setResponses: React.Dispatch<React.SetStateAction<Responses>>;
  onComplete: () => void;
}

const LIKERT_OPTIONS = [
  { value: 1, label: '전혀 아니다' },
  { value: 2, label: '아니다' },
  { value: 3, label: '그렇다' },
  { value: 4, label: '항상 그렇다' },
];

export const QuestionnaireView: React.FC<QuestionnaireViewProps> = ({
  responses,
  setResponses,
  onComplete,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
  const currentQuestions = QUESTIONS.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);
  const progressPercent = Math.round((currentPage / TOTAL_PAGES) * 100);

  const handleSelect = (questionId: number, value: number) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
    setErrorMsg(null);
  };

  const isCurrentPageComplete = currentQuestions.every((q) => responses[q.id]);

  const handleNext = () => {
    if (!isCurrentPageComplete) {
      setErrorMsg('모든 문항에 답변을 선택해 주세요.');
      return;
    }

    if (currentPage < TOTAL_PAGES) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Quick helper to fill current page or sample fill for immediate testing
  const handleAutoFill = () => {
    const sampleResponses: Responses = {};
    QUESTIONS.forEach((q) => {
      // Create realistic non-flat variation pattern
      if (q.anchorCode === 'TF') sampleResponses[q.id] = 4;
      else if (q.anchorCode === 'AU') sampleResponses[q.id] = 3;
      else if (q.anchorCode === 'GM') sampleResponses[q.id] = 3;
      else if (q.anchorCode === 'SE') sampleResponses[q.id] = 2;
      else if (q.anchorCode === 'EC') sampleResponses[q.id] = 1;
      else sampleResponses[q.id] = (q.id % 4) + 1;
    });
    setResponses(sampleResponses);
    setErrorMsg(null);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 md:px-6 py-10">
      {/* Header & Progress */}
      <header className="mb-10 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-[#191c17] mb-2 tracking-tight">
          커리어 가치관 진단
        </h1>
        <p className="text-[#42493e] text-base mb-6">
          나에게 가장 중요한 직업적 가치를 찾아보세요.
        </p>

        <div className="flex items-center justify-between mb-2.5 text-sm font-medium">
          <span className="text-[#42493e]">진행률</span>
          <span className="text-[#35662e] font-semibold">
            {currentPage} / {TOTAL_PAGES} 페이지 ({progressPercent}%)
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#e1e3db] rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-[#35662e] h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Auto fill quick helper */}
        <div className="mt-3 flex justify-end">
          <button
            onClick={handleAutoFill}
            type="button"
            className="text-xs text-[#72796d] hover:text-[#35662e] flex items-center gap-1 underline transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            샘플 응답으로 자동 채우기
          </button>
        </div>
      </header>

      {/* Questionnaire Form */}
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6 flex flex-col">
        {currentQuestions.map((q) => {
          const selectedValue = responses[q.id];

          return (
            <div
              key={q.id}
              className="bg-white border border-[#c1c9bb] rounded-xl p-6 shadow-xs hover:shadow-md transition-shadow duration-200"
            >
              <h3 className="text-base md:text-lg font-medium text-[#191c17] mb-6 leading-relaxed">
                {q.text}
              </h3>

              {/* Likert Scale */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {LIKERT_OPTIONS.map((opt) => {
                  const isChecked = selectedValue === opt.value;

                  return (
                    <label
                      key={opt.value}
                      onClick={() => handleSelect(q.id, opt.value)}
                      className={`flex items-center p-3.5 border rounded-lg cursor-pointer transition-all md:justify-center ${
                        isChecked
                          ? 'border-[#35662e] bg-[#f5ffec] text-[#002201] ring-1 ring-[#35662e]'
                          : 'border-[#c1c9bb] hover:bg-[#edefe6] text-[#191c17]'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={opt.value}
                        checked={isChecked}
                        onChange={() => handleSelect(q.id, opt.value)}
                        className="w-4 h-4 text-[#35662e] border-[#72796d] focus:ring-[#35662e]"
                      />
                      <span className="ml-3 text-sm md:text-base font-normal">
                        {opt.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}

        {errorMsg && (
          <div className="p-3 bg-[#ffdad6] text-[#93000a] text-sm rounded-lg text-center font-medium">
            {errorMsg}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-12 pt-6 border-t border-[#c1c9bb]">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-6 py-3 border border-[#35662e] text-[#35662e] rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              currentPage === 1
                ? 'opacity-40 cursor-not-allowed border-[#72796d] text-[#72796d]'
                : 'hover:bg-[#f2f4ec] active:scale-98'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            이전
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-3 bg-[#35662e] text-white rounded-lg text-sm font-medium hover:bg-[#20511b] transition-all flex items-center gap-2 shadow-xs active:scale-98"
          >
            {currentPage === TOTAL_PAGES ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                진단 결과 확인하기
              </>
            ) : (
              <>
                다음
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
