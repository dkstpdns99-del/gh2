import React from 'react';
import { Anchor, Sparkles, Play, BarChart3, HelpCircle, Info } from 'lucide-react';

interface HeaderProps {
  currentView: 'intro' | 'method' | 'questionnaire' | 'results' | 'jobAnalysis';
  setCurrentView: (view: 'intro' | 'method' | 'questionnaire' | 'results' | 'jobAnalysis') => void;
  hasCompletedTest: boolean;
  onStartAssessment: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  hasCompletedTest,
  onStartAssessment,
}) => {
  return (
    <header className="sticky top-0 z-50 flex justify-between items-center px-4 md:px-8 py-4 w-full mx-auto bg-[#ffffff] dark:bg-[#2e312c] border-b border-[#e1e3db] dark:border-[#72796d] shadow-xs">
      <div 
        className="flex items-center gap-2 cursor-pointer group"
        onClick={() => setCurrentView('intro')}
      >
        <div className="w-9 h-9 rounded-lg bg-[#35662e] flex items-center justify-center text-white group-hover:bg-[#4d8044] transition-colors">
          <Anchor className="w-5 h-5" />
        </div>
        <span className="text-xl font-bold text-[#35662e] dark:text-[#b8f1aa] tracking-tight">
          나만의 커리어앵커
        </span>
      </div>

      <nav className="hidden md:flex gap-1 lg:gap-2 items-center">
        <button
          onClick={() => setCurrentView('intro')}
          className={`text-sm font-medium px-3.5 py-2 rounded-md transition-colors ${
            currentView === 'intro'
              ? 'text-[#35662e] font-bold bg-[#f2f4ec]'
              : 'text-[#42493e] hover:text-[#35662e] hover:bg-[#f2f4ec]'
          }`}
        >
          서비스 소개
        </button>
        <button
          onClick={() => setCurrentView('method')}
          className={`text-sm font-medium px-3.5 py-2 rounded-md transition-colors ${
            currentView === 'method'
              ? 'text-[#35662e] font-bold bg-[#f2f4ec]'
              : 'text-[#42493e] hover:text-[#35662e] hover:bg-[#f2f4ec]'
          }`}
        >
          진단 방법
        </button>
        {hasCompletedTest && (
          <button
            onClick={() => setCurrentView('results')}
            className={`text-sm font-medium px-3.5 py-2 rounded-md transition-colors ${
              currentView === 'results'
                ? 'text-[#35662e] font-bold border-b-2 border-[#35662e] pb-1'
                : 'text-[#42493e] hover:text-[#35662e] hover:bg-[#f2f4ec]'
            }`}
          >
            나의 결과
          </button>
        )}
        <button
          onClick={() => setCurrentView('jobAnalysis')}
          className={`text-sm font-medium px-3.5 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
            currentView === 'jobAnalysis'
              ? 'text-[#8b4365] font-bold bg-[#ffd8e6]/50'
              : 'text-[#42493e] hover:text-[#8b4365] hover:bg-[#ffd8e6]/30'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#8b4365]" />
          AI 희망 직무 해설
        </button>
      </nav>

      <div className="flex items-center gap-2">
        <button
          onClick={onStartAssessment}
          className="bg-[#35662e] text-white font-medium text-sm px-4 py-2 rounded-lg hover:bg-[#20511b] transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
        >
          <Play className="w-4 h-4 fill-current" />
          {hasCompletedTest ? '진단 다시하기' : '진단 시작하기'}
        </button>
      </div>
    </header>
  );
};
