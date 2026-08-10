import React, { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ServiceIntroView } from './components/ServiceIntroView';
import { QuestionnaireView } from './components/QuestionnaireView';
import { ResultsView } from './components/ResultsView';
import { JobAnalysisView } from './components/JobAnalysisView';
import { calculateScores } from './data/questions';
import { ANCHORS_DATA } from './data/anchors';
import { AnchorCode, AssessmentResult, Responses } from './types';

export function App() {
  const [currentView, setCurrentView] = useState<
    'intro' | 'method' | 'questionnaire' | 'results' | 'jobAnalysis'
  >('intro');

  const [responses, setResponses] = useState<Responses>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const handleStartAssessment = () => {
    setResponses({});
    setCurrentView('questionnaire');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteQuestionnaire = () => {
    const { rawScores, scaledScores } = calculateScores(responses);

    // Sort anchor codes by scaled score descending
    const sorted = (Object.keys(scaledScores) as AnchorCode[]).sort(
      (a, b) => scaledScores[b] - scaledScores[a]
    );

    const topCode = sorted[0];
    const topAnchor = {
      code: topCode,
      title: ANCHORS_DATA[topCode].title,
      englishTitle: ANCHORS_DATA[topCode].englishTitle,
      score: scaledScores[topCode],
    };

    const secondaryAnchors = sorted.slice(1, 3).map((code) => ({
      code,
      title: ANCHORS_DATA[code].title,
      englishTitle: ANCHORS_DATA[code].englishTitle,
      score: scaledScores[code],
    }));

    const newResult: AssessmentResult = {
      scores: scaledScores as Record<AnchorCode, number>,
      rawScores,
      topAnchor,
      secondaryAnchors,
      completedAt: new Date().toISOString(),
    };

    setResult(newResult);
    setCurrentView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f8faf1] text-[#191c17] flex flex-col font-sans selection:bg-[#35662e] selection:text-white">
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        hasCompletedTest={!!result}
        onStartAssessment={handleStartAssessment}
      />

      <main className="flex-1 w-full">
        {currentView === 'intro' && (
          <ServiceIntroView
            mode="intro"
            onStartAssessment={handleStartAssessment}
            onNavigateJobAnalysis={() => setCurrentView('jobAnalysis')}
          />
        )}

        {currentView === 'method' && (
          <ServiceIntroView
            mode="method"
            onStartAssessment={handleStartAssessment}
            onNavigateJobAnalysis={() => setCurrentView('jobAnalysis')}
          />
        )}

        {currentView === 'questionnaire' && (
          <QuestionnaireView
            responses={responses}
            setResponses={setResponses}
            onComplete={handleCompleteQuestionnaire}
          />
        )}

        {currentView === 'results' && result && (
          <ResultsView
            result={result}
            onNavigateJobAnalysis={() => setCurrentView('jobAnalysis')}
            onRetake={handleStartAssessment}
          />
        )}

        {currentView === 'jobAnalysis' && (
          <JobAnalysisView
            result={result}
            onStartAssessment={handleStartAssessment}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
