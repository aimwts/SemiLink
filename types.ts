
export interface User {
  id: string;
  name: string;
  headline: string;
  avatarUrl: string;
  connections: number;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  timestamp: string;
  tags: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  readers: number;
  time: string;
}

export enum PostTopic {
  FAB_UPDATE = 'Fab Update',
  DESIGN_VERIFICATION = 'Design Verification',
  PACKAGING = 'Advanced Packaging',
  MARKET_TRENDS = 'Market Trends',
  RISCV = 'RISC-V'
}

export type JobIndustry = 'Fab Manufacturing' | 'IC Design' | 'EDA / Software' | 'Equipment' | 'Semiconductor Materials';
export type JobExperience = 'Entry Level' | 'Mid-Senior' | 'Director' | 'Executive';
export type JobLocationType = 'Remote' | 'On-site' | 'Hybrid';
export type JobFunction = 'Engineering' | 'Research' | 'Operations' | 'Product Management' | 'Sales' | 'Marketing';
export type JobSeniority = 'Intern' | 'Junior' | 'Senior' | 'Lead' | 'Principal' | 'Manager';

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  type: JobLocationType;
  industry: JobIndustry;
  experienceLevel: JobExperience;
  jobFunction?: JobFunction;
  seniority?: JobSeniority;
  postedTime: string;
  applicants: number;
  salaryRange?: string;
  description?: string;
  requirements?: string[];
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  banner: string;
  description: string;
  headquarters: string;
  website: string;
  followers: number;
  industry: string;
}
