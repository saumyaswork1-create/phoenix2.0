
export enum BudgetCategory {
  A = 'A (Less than ₹4 Lakhs)',
  B = 'B (₹4–8 Lakhs)',
  C = 'C (₹8–12 Lakhs)',
  D = 'D (₹12–20 Lakhs)',
  E = 'E (Above ₹20 Lakhs)'
}

export interface Ranks {
  GEN: string;
  OBC: string;
  SC: string;
  ST: string;
}

export interface College {
  id: string;
  collegeName: string;
  course: string;
  fees: {
    total: string;
  };
  admissions: {
    entranceExam: string;
    tentativeExamDate: string;
    admissionWindow: string;
    openingRanks: Ranks;
    closingRanks: Ranks;
  };
  scholarships: string[];
  placements: {
    averagePackage: string;
    topRecruiters: string[];
  };
  notableAlumni: string[];
  careerOutcomes: string[];
  foreignTieUps: string;
  summary: string;
}

export interface Resource {
  title: string;
  type: 'Book' | 'Website' | 'Video' | 'Mock Test';
  link: string;
}

export interface StudyPlan {
  examName: string;
  roadmap: string[];
  tips: string[];
  recommendedResources: Resource[];
}

export interface Counsellor {
  name: string;
  specialization: string;
  phone: string;
  email: string;
  bookingLink: string;
  note: string;
}

export interface GuidanceData {
  recommendations: College[];
  studyPlan: StudyPlan;
  careerCounsellor: Counsellor;
  studentNextSteps: string[];
  locationNote?: string;
}

export interface StudentDetails {
  academicMetric: string; // Single input for marks, ranks, OR percentage
  preferredCourse: string;
  budgetCategory: 'A' | 'B' | 'C' | 'D' | 'E';
  preferredLocation: string;
}

export interface User {
  name: string;
  email: string;
}
