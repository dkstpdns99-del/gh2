import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Overall Career Insight Endpoint
app.post("/api/ai-insight", async (req, res) => {
  try {
    const { scores, topAnchor, secondaryAnchors } = req.body;

    if (!scores || !topAnchor) {
      return res.status(400).json({ error: "Missing required scores or topAnchor data" });
    }

    const ai = getGeminiClient();

    const prompt = `
당신은 세계적인 직업 심리학자이자 에드거 샤인(Edgar Schein)의 커리어 앵커(Career Anchors) 분야의 최고 전문가입니다.
사용자의 커리어 가치관 진단 결과(8개 앵커 점수, 100점 환산)는 다음과 같습니다:

- 1순위 핵심 앵커: ${topAnchor.title} (${topAnchor.englishTitle}, 점수: ${topAnchor.score}점)
- 주 서브 앵커: ${secondaryAnchors?.map((a: any) => `${a.title}(${a.score}점)`).join(", ") || "없음"}

전체 8개 앵커 점수:
- 전문가형 (TF): ${scores.TF || 0}점
- 일반 관리자형 (GM): ${scores.GM || 0}점
- 자율/독립형 (AU): ${scores.AU || 0}점
- 안전/안정형 (SE): ${scores.SE || 0}점
- 기업가적 창의성 (EC): ${scores.EC || 0}점
- 봉사/헌신형 (SV): ${scores.SV || 0}점
- 순수한 도전형 (CH): ${scores.CH || 0}점
- 라이프스타일형 (LS): ${scores.LS || 0}점

다음 지침을 준수하여 전문적이면서도 따뜻하고 명확한 AI 커리어 인사이트를 한국어로 제공해 주세요:
1. 요약 분석 (150~200자): 핵심 앵커와 서브 앵커의 조합이 의미하는 사용자의 직업적 성향, 강점, 동기 요인을 정교하게 분석합니다.
2. 선호하는 조직 및 업무 환경 3가지
3. 기피해야 할 직무 및 조직 문화 2가지
4. 향후 커리어 개발 전략 팁 2가지

응답은 유효한 JSON 형식으로 다음과 같이 작성해 주세요:
{
  "summary": "분석 요약 글...",
  "preferredEnvironments": ["환경 1", "환경 2", "환경 3"],
  "avoidEnvironments": ["주의 환경 1", "주의 환경 2"],
  "careerTips": ["전략 팁 1", "전략 팁 2"]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const jsonText = response.text || "{}";
    const data = JSON.parse(jsonText);
    res.json(data);
  } catch (error: any) {
    console.error("AI Insight Error:", error);
    res.status(500).json({
      error: "AI 커리어 인사이트 생성 중 오류가 발생했습니다.",
      details: error.message,
    });
  }
});

// AI Job Analysis Endpoint
app.post("/api/job-analysis", async (req, res) => {
  try {
    const { jobTitle, scores, topAnchor, secondaryAnchors } = req.body;

    if (!jobTitle || !scores) {
      return res.status(400).json({ error: "희망 직무명과 점수 정보가 필요합니다." });
    }

    const ai = getGeminiClient();

    const prompt = `
당신은 에드거 샤인의 커리어 앵커 전문가이자 최고 직무 적합성 컨설턴트입니다.
사용자가 입력한 희망 직무: "${jobTitle}"

사용자의 커리어 앵커 진단 결과:
- 1순위 핵심 앵커: ${topAnchor?.title} (${topAnchor?.score}점)
- 2순위 서브 앵커: ${secondaryAnchors?.[0]?.title || "없음"} (${secondaryAnchors?.[0]?.score || 0}점)
- 전체 점수: TF:${scores.TF}, GM:${scores.GM}, AU:${scores.AU}, SE:${scores.SE}, EC:${scores.EC}, SV:${scores.SV}, CH:${scores.CH}, LS:${scores.LS}

요청 사항:
사용자가 희망하는 직무 "${jobTitle}"가 사용자의 커리어 앵커 프로필과 얼마나 잘 부합하는지 정밀 분석해 주세요.

다음 규격의 JSON으로만 응답해 주세요:
{
  "jobTitle": "${jobTitle}",
  "matchPercentage": 85, // 0~100 사이의 적합도 숫자
  "matchSummary": "'${jobTitle}' 직무는 귀하의 1순위 ${topAnchor?.title || "핵심"} 앵커 및 서브 앵커와 XX% 일치합니다.",
  "detailedAnalysis": "상세 적합성 분석 설명 글 (2~3문장)...",
  "strengthsInRole": ["이 직무에서 발휘될 강점 1", "이 직무에서 발휘될 강점 2"],
  "potentialRisks": ["우려되거나 고려해야 할 점 1"],
  "advice": "성공적인 커리어를 위한 맞춤 조언 1문장"
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const jsonText = response.text || "{}";
    const data = JSON.parse(jsonText);
    res.json(data);
  } catch (error: any) {
    console.error("Job Analysis Error:", error);
    res.status(500).json({
      error: "AI 직무 분석 생성 중 오류가 발생했습니다.",
      details: error.message,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
