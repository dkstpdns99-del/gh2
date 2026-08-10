import React from 'react';
import { Anchor, CheckCircle2, Compass, Play, Shield, Target, Award, ArrowRight } from 'lucide-react';
import { ANCHOR_LIST } from '../data/anchors';

interface ServiceIntroViewProps {
  mode: 'intro' | 'method';
  onStartAssessment: () => void;
  onNavigateJobAnalysis: () => void;
}

export const ServiceIntroView: React.FC<ServiceIntroViewProps> = ({
  mode,
  onStartAssessment,
  onNavigateJobAnalysis,
}) => {
  if (mode === 'method') {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-12 space-y-12">
        <header className="text-center space-y-3">
          <p className="text-xs font-mono font-bold text-[#35662e] tracking-widest uppercase">
            ASSESSMENT METHODOLOGY
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#191c17]">
            커리어 앵커 진단 방법
          </h1>
          <p className="text-base text-[#42493e] max-w-2xl mx-auto leading-relaxed">
            MIT 슬론 경영대학원 에드거 샤인(Edgar Schein) 교수의 검증된 8가지 직업 가치관 모델을 바탕으로 정밀하게 설계되었습니다.
          </p>
        </header>

        {/* 3 Step Method Process */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-[#e1e3db] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#f5ffec] text-[#35662e] flex items-center justify-center font-bold font-mono text-lg">
              01
            </div>
            <h3 className="text-lg font-bold text-[#191c17]">40개 질문 응답</h3>
            <p className="text-sm text-[#42493e] leading-relaxed">
              총 8개 페이지, 페이지당 5개의 실무 상황 기반 질문에 4점 리커트 척도(1점: 전혀 아니다 ~ 4점: 항상 그렇다)로 진솔하게 답합니다.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#e1e3db] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#f5ffec] text-[#35662e] flex items-center justify-center font-bold font-mono text-lg">
              02
            </div>
            <h3 className="text-lg font-bold text-[#191c17]">8대 앵커 점수 산출</h3>
            <p className="text-sm text-[#42493e] leading-relaxed">
              응답 결과를 바탕으로 전문가형(TF), 자율성(AU) 등 8개 카테고리별 가중치가 100점 만점으로 환산 정밀하게 분석됩니다.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#e1e3db] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#f5ffec] text-[#35662e] flex items-center justify-center font-bold font-mono text-lg">
              03
            </div>
            <h3 className="text-lg font-bold text-[#191c17]">AI 맞춤 해설 & 직무 적합도</h3>
            <p className="text-sm text-[#42493e] leading-relaxed">
              1순위 핵심 앵커와 서브 앵커를 시각화한 레이더 차트 및 Gemini AI의 맞춤형 커리어 코칭 및 희망 직무 해설을 받습니다.
            </p>
          </div>
        </section>

        {/* Start Call to Action */}
        <div className="bg-[#35662e] text-white rounded-xl p-8 text-center space-y-4 shadow-md">
          <h2 className="text-2xl font-bold">지금 바로 내 커리어 앵커를 진단해 보세요</h2>
          <p className="text-sm text-[#b8f1aa] max-w-lg mx-auto">
            소요 시간 약 5분. 내 일과 삶의 균형을 잡아줄 직업적 나침반을 발견하세요.
          </p>
          <button
            onClick={onStartAssessment}
            className="mt-2 bg-white text-[#35662e] font-bold px-8 py-3.5 rounded-lg hover:bg-[#f5ffec] transition-all inline-flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Play className="w-4 h-4 fill-current" /> 진단 시작하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-6 py-12 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 bg-[#f5ffec] border border-[#b8f1aa] px-4 py-1.5 rounded-full text-xs font-semibold text-[#20511b]">
          <Anchor className="w-4 h-4 text-[#35662e]" /> 에드거 샤인의 8가지 커리어 앵커 기반
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-[#191c17] leading-tight max-w-3xl mx-auto">
          나를 움직이는 진짜 직업 가치관, <br />
          <span className="text-[#35662e]">나만의 커리어앵커</span>에서 찾으세요.
        </h1>

        <p className="text-base md:text-lg text-[#42493e] max-w-2xl mx-auto leading-relaxed">
          '커리어 앵커(Career Anchor)'는 어떠한 상황에서도 쉽게 타협하거나 포기할 수 없는 당신의 직업적 정체성이자 내면의 핵심 가치관입니다.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={onStartAssessment}
            className="w-full sm:w-auto bg-[#35662e] text-white font-semibold text-base px-8 py-3.5 rounded-lg hover:bg-[#20511b] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98"
          >
            <Play className="w-5 h-5 fill-current" /> 5분 커리어 진단 시작
          </button>

          <button
            onClick={onNavigateJobAnalysis}
            className="w-full sm:w-auto bg-[#f2f4ec] text-[#191c17] font-semibold text-base px-8 py-3.5 rounded-lg border border-[#c1c9bb] hover:bg-[#e7e9e0] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            AI 희망 직무 해설 보기
            <ArrowRight className="w-4 h-4 text-[#35662e]" />
          </button>
        </div>
      </section>

      {/* 8 Anchors Grid Overview */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-[#191c17]">
            8가지 커리어 앵커 유형
          </h2>
          <p className="text-sm text-[#42493e]">
            당신의 가치관은 이 8가지 영역 중 어디에 닻을 내리고 있나요?
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ANCHOR_LIST.map((anchor) => (
            <div
              key={anchor.code}
              className="bg-white p-5 rounded-xl border border-[#e1e3db] hover:border-[#35662e] transition-all shadow-xs space-y-2"
            >
              <span
                className="text-xs font-mono font-bold block"
                style={{ color: anchor.color }}
              >
                {anchor.code} - {anchor.englishTitle}
              </span>
              <h3 className="text-lg font-bold text-[#191c17]">{anchor.title}</h3>
              <p className="text-xs text-[#42493e] leading-relaxed">{anchor.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why knowing your anchor matters */}
      <section className="bg-[#f2f4ec] rounded-xl p-8 border border-[#e1e3db] grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#35662e] shadow-xs">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-[#191c17]">명확한 커리어 나침반</h3>
          <p className="text-xs text-[#42493e] leading-relaxed">
            이직이나 승진, 직무 전환 갈림길에서 나에게 맞는 결정을 내리는 기준이 됩니다.
          </p>
        </div>

        <div className="space-y-2">
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#35662e] shadow-xs">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-[#191c17]">직무 번아웃 예방</h3>
          <p className="text-xs text-[#42493e] leading-relaxed">
            내 가치관과 충돌하는 직무 환경을 미리 파악하고 피할 수 있습니다.
          </p>
        </div>

        <div className="space-y-2">
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#35662e] shadow-xs">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-[#191c17]">AI 직무 적합도 검증</h3>
          <p className="text-xs text-[#42493e] leading-relaxed">
            Gemini AI를 활용해 내가 바라는 희망 직무와의 가치관 정합성을 즉시 측정합니다.
          </p>
        </div>
      </section>
    </div>
  );
};
