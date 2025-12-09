
export interface User {
  id: string;
  name: string;
  email?: string;
  headline: string;
  avatarUrl: string;
  connections: number;
  mutualConnections?: number;
  location?: string;
  about?: string;
  backgroundImageUrl?: string;
  experience?: Experience[];
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string; // or 'Present'
  description?: string;
  logoUrl?: string;
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

export interface Message {
  id: string;
  senderId: string; // 'me' refers to current user
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  contact: User;
  messages: Message[];
  lastMessageTimestamp: string;
  unreadCount: number;
  isOnline?: boolean;
}

export type NotificationType = 'like' | 'comment' | 'connection' | 'job' | 'view' | 'mention';

export interface Notification {
  id: string;
  type: NotificationType;
  actor: {
    name: string;
    avatarUrl: string;
    type: 'user' | 'company';
  };
  content: string;
  targetContext?: string; // e.g., "your post about EUV", "Process Engineer role"
  timestamp: string;
  isRead: boolean;
}
