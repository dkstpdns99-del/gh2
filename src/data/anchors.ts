import { AnchorCode, AnchorInfo } from '../types';

export const ANCHORS_DATA: Record<AnchorCode, AnchorInfo> = {
  TF: {
    code: 'TF',
    title: '전문가형',
    englishTitle: 'TECHNICAL/FUNCTIONAL',
    subtitle: '전문 지식 및 기술 연마',
    color: '#35662e',
    bgLight: '#f5ffec',
    description: '자신의 전문 분야에서 기술을 연마하고 실력을 발휘하는 것을 중요시합니다.',
    longDescription: '자신의 전문 분야에서 기술을 연마하고 실력을 발휘하는 것을 중요시합니다. 경영이나 관리직보다는 해당 분야의 최고 전문가로 성장하는 것을 목표로 삼습니다. 기술적인 도전 과제를 해결하는 과정에서 큰 동기를 부여받습니다.',
    coreValues: ['지격 숙달', '전문적 인정', '기술적 난제 해결', '실무 지식'],
    idealEnvironments: ['기술 및 연구개발 중심 조직', '전문적 재량권이 부여된 직무', '지속적 학습과 교육 기회가 보장되는 환경'],
    recommendedCareers: ['소프트웨어 엔지니어', '데이터 과학자', '연구원', '전문 기획자', '의료/법률/금융 전문직']
  },
  GM: {
    code: 'GM',
    title: '일반 관리자형',
    englishTitle: 'GENERAL MANAGERIAL',
    subtitle: '조직 리더십 및 종합 관리',
    color: '#4f6449',
    bgLight: '#d1eac7',
    description: '조직 전체를 책임지고 리드하는 역할에 매력을 느낍니다.',
    longDescription: '조직 전체를 책임지고 리드하는 역할에 매력을 느낍니다. 다양한 부서의 의견을 조율하고 조직의 목표를 달성하는 과정에서 성취감을 얻습니다. 단순 전문성보다는 종합적인 관리 능력과 의사결정 리더십을 중요시합니다.',
    coreValues: ['경영 리더십', '의사결정 권한', '성과 책임', '사람 및 자원 관리'],
    idealEnvironments: ['글로벌 대기업', '조직 체계가 명확한 기업', '임원 및 총괄 매니저 트랙'],
    recommendedCareers: ['총괄 매니저', '사업부장', '경영 전략 컨설턴트', 'COO / CEO']
  },
  AU: {
    code: 'AU',
    title: '자율/독립형',
    englishTitle: 'AUTONOMY/INDEPENDENCE',
    subtitle: '스스로 일하는 방식과 시간 결정',
    color: '#8b4365',
    bgLight: '#ffd8e6',
    description: '조직의 규칙에 얽매이지 않고 자신의 방식과 속도대로 일하는 것을 선호합니다.',
    longDescription: '조직의 규칙이나 규범에 얽매이는 것을 싫어하며, 자신의 일하는 방식, 시간, 장소를 스스로 결정하고 싶어 합니다. 마이크로매니징을 기피하며 자율성과 독립성이 높은 작업 환경을 강력히 선호합니다.',
    coreValues: ['자유로운 일정', '의사결정의 자율성', '관료주의 탈피', '결과 중심 평가'],
    idealEnvironments: ['자율근무제/원격근무 기업', '독립 프로젝트 단위 조직', '프리랜서 및 1인 기업'],
    recommendedCareers: ['독립 컨설턴트', '프리랜서 디자이너/개발자', '대학 교수/연구원', '자유 기증 작가']
  },
  SE: {
    code: 'SE',
    title: '안전/안정형',
    englishTitle: 'SECURITY/STABILITY',
    subtitle: '고용 안정과 예측 가능한 미래',
    color: '#4d8044',
    bgLight: '#e7e9e0',
    description: '경제적인 안정과 고용 보장이 보장된 직장을 가지는 것이 가장 중요합니다.',
    longDescription: '장기적인 예측 가능성과 안정을 최우선 가치로 둡니다. 직장의 정년 보장, 안정적인 급여 체계, 명확한 역할과 직무 안정성을 누릴 수 있는 곳에서 가장 편안함과 만족을 얻습니다.',
    coreValues: ['고용 안정성', '예측 가능성', '복리후생', '위험 최소화'],
    idealEnvironments: ['공공기관 및 공기업', '탄탄한 중견/대기업', '안정적 복지 제도가 갖춰진 환경'],
    recommendedCareers: ['공무원/공기업 직원', '금융기관 행원', '안정적 내근 행정 관리자', '품질 관리 전문가']
  },
  EC: {
    code: 'EC',
    title: '기업가적 창의성',
    englishTitle: 'ENTREPRENEURIAL CREATIVITY',
    subtitle: '새로운 사업 및 가치 창출',
    color: '#a85b7e',
    bgLight: '#ffafd0',
    description: '새로운 사업이나 상품, 조직을 무에서 유로 직접 만들어내는 것을 즐깁니다.',
    longDescription: '자신만의 아이디어를 바탕으로 사업체나 서비스, 조직을 새롭게 창출하고자 하는 강력한 욕구가 있습니다. 위험을 감수하더라도 새로운 도전을 즐기며, 자신의 노력에 대한 직접적 성과 창출을 원합니다.',
    coreValues: ['새로운 사업 창출', '혁신적 도전', '개인적 소유권', '위험과 보상'],
    idealEnvironments: ['스타트업 창업', '신사업 개발 부서', '사내 벤처 조직', '비즈니스 빌더'],
    recommendedCareers: ['스타트업 창업가(CEO)', '신사업 기획자', '벤처 캐피털리스트', '프로덕트 오너(PO)']
  },
  SV: {
    code: 'SV',
    title: '봉사/헌신형',
    englishTitle: 'SERVICE/DEDICATION',
    subtitle: '사회적 가치와 타인 기여',
    color: '#386931',
    bgLight: '#f5ffec',
    description: '나의 일이 사회에 긍정적인 영향을 미치고 타인을 돕는 일이었으면 좋겠습니다.',
    longDescription: '개인적 금전이나 권력보다 세상을 더 낫게 만들고 타인을 돕는 사회적 가치를 일의 가장 큰 목적으로 삼습니다. 가치관과 부합하는 일에서 엄청난 열정과 신념을 발휘합니다.',
    coreValues: ['사회적 영향력', '이타주의', '가치 지향성', '타인 돕기'],
    idealEnvironments: ['비영리단체(NGO)', '소셜벤처/임팩트 기업', '친환경/사회공헌 가치 중심 조직'],
    recommendedCareers: ['소셜 임팩트 매니저', '사회복지사', '환경/ESG 전문가', '교육자/상담사']
  },
  CH: {
    code: 'CH',
    title: '순수한 도전형',
    englishTitle: 'PURE CHALLENGE',
    subtitle: '극단적 난제와 경쟁 극복',
    color: '#72796d',
    bgLight: '#e1e3db',
    description: '극복하기 어려운 장애물이나 치열한 경쟁 상황을 파헤쳐 승리하는 것을 원합니다.',
    longDescription: '남들이 해결하기 어렵다고 여겨지는 불가능한 난제, 어려운 경쟁자, 극단적인 기술적/비즈니스적 문제를 극복하는 것 자체에서 짜릿한 동기와 즐거움을 얻습니다.',
    coreValues: ['승리와 성취', '문제 해결', '경쟁 우위', '끊임없는 변화'],
    idealEnvironments: ['위기관리/턴어라운드 컨설팅', '고난도 기술 연구소', '성과 중심 수주 영업/위기 관리'],
    recommendedCareers: ['전략 컨설턴트', '위기 관리 전문가', '고난도 문제 해결사', 'M&A 전문가']
  },
  LS: {
    code: 'LS',
    title: '라이프스타일형',
    englishTitle: 'LIFESTYLE',
    subtitle: '일과 삶, 개인적 요구의 균형',
    color: '#384c32',
    bgLight: '#d1eac7',
    description: '일, 개인의 삶, 가족의 행복 사이에서 균형을 이루는 통합적인 라이프스타일을 추구합니다.',
    longDescription: '커리어가 개인의 삶 전체를 지배하기보다, 개인적 삶·가족·취미와 조화롭게 어우러지는 통합적인 균형(Work-Life Harmony)을 가장 중요시합니다. 유연성이 높은 근무 제도를 선호합니다.',
    coreValues: ['워라밸(Work-Life Balance)', '유연한 삶', '가정과의 조화', '개인적 안녕'],
    idealEnvironments: ['워라밸 보장 기업', '유비쿼터스/유연근무제 회사', '시간외 근무가 적고 개인 시간이 존중되는 조직'],
    recommendedCareers: ['유연한 전문 직무자', '원격근무 전문직', '안정적 시간관리 가능 기업인', '공공기관 전문가']
  }
};

export const ANCHOR_LIST = Object.values(ANCHORS_DATA);
