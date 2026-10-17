export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  content: string; // Rich markdown or detailed paragraph text
  coverUrl: string;
  tags: string[];
  category: "web" | "mobile" | "branding" | "experimental" | "game";
  timeline: string;
  role: string;
  client?: string;
  websiteUrl?: string;
  githubUrl?: string;
  featured: boolean;
  views: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  status: 'unread' | 'read';
}

export interface AnalyticsEvent {
  id: string;
  timestamp: string;
  type: 'visit' | 'project_view' | 'contact_open' | 'contact_submit' | 'external_click' | 'admin_login' | 'time_spent';
  detail?: string;
  device?: string;
  duration?: number; // cumulative seconds for time_spent event
}
