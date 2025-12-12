export interface ForecastData {
  model_r_squared: number;
  forecast_2026: number;
  annual_growth_rate: number;
  title: string;
  model_efficiency?: string;
}

export interface Achievement {
  id: number;
  category: string;
  type: string;
  issuer: string;
  title: string;
  image_url: string;
  verified: boolean;
  date?: string;
  hash?: string;
}

export interface StudentProfile {
  name: string;
  id: string;
  university: string;
  gpa: number;
  major: string;
  stage?: string;
  skills: string[];
  achievements: Achievement[];
}

export interface AuthResponse {
  is_valid: boolean;
  message: string;
}

export interface PendingItem {
  id: string;
  type: 'LOGIN_FAILURE' | 'INVALID_CERT';
  content: string;
  timestamp: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface SkillGapData {
  target_role: string;
  match_percentage: number;
  market_demand_level: string;
  owned_skills: string[];
  missing_skills: string[];
  recommended_courses: { title: string; provider: string }[];
}

export interface JobMatchData {
  score: number;
  rank: string;
  recommendation: string;
  badges: string[];
}

export interface BlockchainResponse {
  is_verified: boolean;
  blockchain_hash: string;
  timestamp: number;
  ledger: string;
}

export interface PredictiveScore {
  score: number;
  category: string;
  description: string;
  potential_role: string;
}

export interface Candidate {
  id: string;
  name: string;
  major: string;
  university: string;
  gpa: number;
  status: 'Open' | 'Interviewing' | 'Hired';
  last_verified_hash?: string;
}

export interface StudentMetrics {
  student_id: string;
  classification: string;
  improvement_metric: string;
  readiness_score: number;
  metric_description: string;
  labels: string[];
  score_display?: number;
}

export enum UserRole {
  STUDENT = 'student',
  HR = 'hr',
  GUEST = 'guest'
}