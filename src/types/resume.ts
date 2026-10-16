export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
  technologies?: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
  gpa?: string;
  location?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  link?: string;
  bullets: string[];
  technologies: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface SkillCategories {
  technical: string[];
  soft: string[];
  tools: string[];
  domain: string[];
}

export interface ResumeData {
  id: string;
  title: string;
  lastModified: string;
  personalInfo: PersonalInfo;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  skills: SkillCategories;
  certifications: CertificationItem[];
}

export interface JobDescriptionData {
  title: string;
  company: string;
  rawText: string;
  requiredSkills: string[];
  preferredSkills: string[];
  keywords: Array<{
    word: string;
    category: 'technical' | 'soft' | 'domain' | 'tool';
    frequency: number;
    required: boolean;
  }>;
  keyResponsibilities: string[];
}

export interface AtsAuditResult {
  overallScore: number;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'Needs Work';
  keywordMatch: {
    score: number;
    matchedCount: number;
    totalRequired: number;
    matched: string[];
    missing: string[];
  };
  formatting: {
    score: number;
    checks: Array<{
      id: string;
      label: string;
      passed: boolean;
      tip: string;
    }>;
  };
  quantifiedImpact: {
    score: number;
    metricBulletsCount: number;
    totalBulletsCount: number;
    percentage: number;
    feedback: string;
  };
  antiAiAuthenticity: {
    score: number;
    humanProbability: number;
    burstinessScore: number;
    lexicalDiversity: number;
    flaggedAiPhrases: string[];
    suggestions: string[];
  };
  sectionStructure: {
    score: number;
    presentSections: string[];
    missingSections: string[];
  };
  actionItems: string[];
}

export interface GroundBaseProfile {
  id: string;
  sourceFiles: Array<{ name: string; type: string; uploadedAt: string }>;
  masterPersonalInfo: PersonalInfo;
  aggregatedExperiences: ExperienceItem[];
  aggregatedEducation: EducationItem[];
  aggregatedProjects: ProjectItem[];
  aggregatedSkills: SkillCategories;
  aggregatedCertifications: CertificationItem[];
  totalRawBulletPoints: number;
}

export interface CoverLetterConfig {
  recipientName: string;
  recipientTitle: string;
  companyName: string;
  jobTitle: string;
  tone: 'direct_tech' | 'executive' | 'confident_bold' | 'consultative' | 'mission_driven';
  customInstructions?: string;
}
