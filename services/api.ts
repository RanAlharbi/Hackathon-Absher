import axios from 'axios';
import { AuthResponse, ForecastData, StudentProfile, SkillGapData, BlockchainResponse, JobMatchData, Candidate, PredictiveScore, StudentMetrics } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

// --- FALLBACK MOCK DATA (Offline/Demo Mode) ---
const MOCK_FORECAST: ForecastData = {
  model_r_squared: 0.8940,
  forecast_2026: 512441,
  annual_growth_rate: 19069.0,
  title: "إثبات قابلية التوسع",
  model_efficiency: "كفاءة تنبؤ عالية"
};

const MOCK_PROFILE: StudentProfile = {
  name: "روان سليمان رجاء الله الصاعدي",
  id: "20241156",
  university: "الجامعة السعودية الإلكترونية",
  major: "علوم الحاسب",
  stage: "بكالوريوس",
  gpa: 3.92,
  skills: ["Python", "React", "Data Analysis", "Project Management", "Strategic Planning"],
  achievements: [
    {
      id: 1,
      category: "الذكاء الاصطناعي",
      type: "شهادات احترافية",
      issuer: "أكاديمية كاوست",
      title: "مقدمة في تعلم الآلة",
      image_url: "https://images.unsplash.com/photo-1555949963-aa79dcee481c?w=600&q=80",
      verified: true,
      date: "2023",
      hash: "0x9A3B...7F1E"
    },
    {
      id: 2,
      category: "البرمجة",
      type: "شهادات احترافية",
      issuer: "جامعة SEU",
      title: "دورة Python متقدمة",
      image_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80",
      verified: true,
      date: "2024",
      hash: "0x8C2D...5B3A"
    },
    {
      id: 3,
      category: "التطوير المهني",
      type: "تدريب تعاوني",
      issuer: "شركة تقنية المعلومات",
      title: "برنامج التدريب الصيفي (3 أشهر)",
      image_url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80",
      verified: true,
      date: "2024",
      hash: "0x7F2C...1A9D"
    },
    {
      id: 4,
      category: "القيادة والتطوع",
      type: "أعمال تطوعية",
      issuer: "مؤسسة وطنية",
      title: "شهادة تطوع (40 ساعة)",
      image_url: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&q=80",
      verified: false,
      date: "2024"
    }
  ]
};

const MOCK_SKILL_GAP: SkillGapData = {
  target_role: "محلل أمن سيبراني (Cybersecurity Analyst)",
  match_percentage: 75,
  market_demand_level: "High (Vision 2030 Priority)",
  owned_skills: ["Python", "Network Basics", "Risk Management"],
  missing_skills: ["Penetration Testing", "Cloud Security", "SIEM Tools"],
  recommended_courses: [
    { title: "مقدمة في اختبار الاختراق", provider: "الأكاديمية الوطنية" },
    { title: "أمن السحابة المتقدم", "provider": "Google Cloud Skills" }
  ]
};

const MOCK_JOB_MATCH: JobMatchData = {
  score: 92,
  rank: "موهبة وطنية واعدة",
  recommendation: "أنت جاهز للتقديم في قطاع التقنية والتحول الرقمي، متوافق مع رؤية 2030.",
  badges: ["متميز أكاديمياً", "جاهزية 2030", "مهارات تقنية"]
};

// HR Mocks
const MOCK_CANDIDATES: Candidate[] = [
  { id: "20241156", name: "روان سليمان الصاعدي", major: "علوم الحاسب", university: "الجامعة السعودية الإلكترونية", gpa: 4.92, status: 'Open', last_verified_hash: "0x9A3B_IMMUTABLE_BLOCK_2024" },
  { id: "20241199", name: "أحمد محمد العلي", major: "هندسة برمجيات", university: "جامعة الملك سعود", gpa: 4.75, status: 'Interviewing', last_verified_hash: "0x8C2D_IMMUTABLE_BLOCK_2023" },
  { id: "20242288", name: "سارة خالد العمري", major: "أمن سيبراني", university: "جامعة الأميرة نورة", gpa: 4.88, status: 'Hired', last_verified_hash: "0x7F1E_IMMUTABLE_BLOCK_2024" },
  { id: "20251122", name: "خالد فهد السبيعي", major: "ذكاء اصطناعي", university: "جامعة الملك فهد للبترول والمعادن", gpa: 4.95, status: 'Open', last_verified_hash: "0x3D4F_IMMUTABLE_BLOCK_2024" },
  { id: "20253344", name: "نورة عبدالله القحطاني", major: "نظم معلومات", university: "جامعة الإمام محمد بن سعود", gpa: 4.80, status: 'Open', last_verified_hash: "0x5E6A_IMMUTABLE_BLOCK_2024" }
];

const MOCK_PREDICTIVE_SCORE: PredictiveScore = {
  score: 95,
  category: "توافق ممتاز (Excellent Match)",
  description: "بناءً على السجل الأكاديمي والنشاطات اللاصفية، يُظهر المرشح احتمالية نجاح عالية جداً في بيئات العمل التقنية سريعة التغير.",
  potential_role: "قائد فريق تقني مستقبلي"
};

const MOCK_STUDENT_METRICS: StudentMetrics = {
  student_id: "20241156",
  classification: "موهبة وطنية واعدة",
  improvement_metric: "تحسين المهارات المطلوبة لسوق العمل",
  readiness_score: 92,
  metric_description: "مقياس التحسين المستمر يعكس التزام الطالب بإكمال المسارات التدريبية المقترحة من وزارة الموارد البشرية.",
  labels: ["متميز أكاديمياً", "جاهزية 2030", "مهارات تقنية"],
  score_display: 92
};

// Helper to handle API calls with robust fallback
const safeRequest = async <T,>(request: () => Promise<any>, fallback: T): Promise<T> => {
  try {
    const response = await request();
    if (typeof response.data === 'string' && response.data.trim().startsWith('<')) {
        throw new Error("Received HTML instead of JSON");
    }
    return response.data;
  } catch (error) {
    console.warn("Backend unreachable or returned invalid data. Using fallback data for Demo Presentation.", error);
    return fallback;
  }
};

// Local Luhn implementation
function luhnCheck(id: string): boolean {
  if (!/^\d+$/.test(id)) return false;
  let nCheck = 0, bEven = false;
  for (let n = id.length - 1; n >= 0; n--) {
    let cDigit = parseInt(id.charAt(n), 10);
    if (bEven) {
      if ((cDigit *= 2) > 9) cDigit -= 9;
    }
    nCheck += cDigit;
    bEven = !bEven;
  }
  return (nCheck % 10) === 0;
}

export const api = {
  auth: {
    validateId: async (nationalId: string): Promise<AuthResponse> => {
      try {
        const response = await axios.post(`${API_BASE_URL}/auth/validate_id`, { national_id: nationalId });
        return response.data;
      } catch (error) {
        return { is_valid: luhnCheck(nationalId), message: "تم التحقق محلياً (Offline Mode)" };
      }
    },
    login: async (credentials: any) => { return { token: "mock_token" }; }
  },
  data: {
    getForecast: async (): Promise<ForecastData> => {
      return safeRequest(() => axios.get(`${API_BASE_URL}/data/forecast`), MOCK_FORECAST);
    },
    getTranscript: async (studentId: string): Promise<StudentProfile> => {
      return safeRequest(() => axios.get(`${API_BASE_URL}/data/transcript/${studentId}`), MOCK_PROFILE);
    },
    getSkillGap: async (studentId: string): Promise<SkillGapData> => {
      return safeRequest(() => axios.get(`${API_BASE_URL}/data/skill_gap/${studentId}`), MOCK_SKILL_GAP);
    },
    getJobMatch: async (studentId: string): Promise<JobMatchData> => {
      return safeRequest(() => axios.get(`${API_BASE_URL}/data/job_match_score/${studentId}`), MOCK_JOB_MATCH);
    },
    verifyBlockchain: async (): Promise<BlockchainResponse> => {
      return safeRequest(() => axios.post(`${API_BASE_URL}/data/verify_blockchain`), {
        is_verified: true,
        blockchain_hash: "0x9A3B_MOCK_HASH_IMMUTABLE_BLOCK_2024",
        timestamp: Date.now(),
        ledger: "National EduChain Network (Simulated)"
      });
    }
  },
  hr: {
    getStudents: async (): Promise<Candidate[]> => {
       return safeRequest(() => axios.get(`${API_BASE_URL}/hr/students`), MOCK_CANDIDATES);
    },
    getPredictiveScore: async (studentId: string): Promise<PredictiveScore> => {
       if (studentId === "20241156") return safeRequest(() => axios.get(`${API_BASE_URL}/hr/predictive_score/${studentId}`), MOCK_PREDICTIVE_SCORE);
       
       return {
         score: Math.floor(Math.random() * (95 - 75) + 75),
         category: "توافق جيد",
         description: "مرشح واعد بمهارات تقنية قوية وقابلية للتعلم.",
         potential_role: "مطور برمجيات"
       };
    },
    getStudentMetrics: async (studentId: string): Promise<StudentMetrics> => {
      if (studentId === "20241156") return safeRequest(() => axios.get(`${API_BASE_URL}/hr/student_metrics/${studentId}`), MOCK_STUDENT_METRICS);
      
      return {
        ...MOCK_STUDENT_METRICS,
        student_id: studentId,
        readiness_score: Math.floor(Math.random() * (95 - 70) + 70),
        score_display: Math.floor(Math.random() * (95 - 70) + 70)
      };
    }
  }
};