export interface SocialMetrics {
  totalPosts: number;
  likes: number;
  comments: number;
  shares: number;
  reach: number;
  engagementRate: number;
  followersGained: number;
  followersLost: number;
  netFollowers: number;
}

export interface PostData {
  id: string;
  date: string;
  content: string;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
}

export interface ComparisonData {
  company: {
    name: string;
    url: string;
    metrics: SocialMetrics;
    posts: PostData[];
    dailyData: DailyMetric[];
  };
  competitor: {
    name: string;
    url: string;
    metrics: SocialMetrics;
    posts: PostData[];
    dailyData: DailyMetric[];
  };
  timeframe: string;
  generatedAt: string;
  startDate?: string;
  endDate?: string;
}

export interface MonthlyReportData {
  page: {
    name: string;
    url: string;
    metrics: SocialMetrics;
    posts: PostData[];
    dailyData: DailyMetric[];
  };
  timeframe: string;
  generatedAt: string;
  startDate: string;
  endDate: string;
}

export interface DailyMetric {
  date: string;
  posts: number;
  engagement: number;
  reach: number;
}

export interface Report {
  id: string;
  mode: 'compare' | 'monthly';
  companyUrl: string;
  competitorUrl?: string;
  timeframe: string;
  createdAt: string;
  startDate: string;
  endDate: string;
  data?: ComparisonData | MonthlyReportData;
}

export type TimeframeOption = '7days' | '30days' | '60days' | 'previous_month' | 'previous_2_months' | 'previous_quarter' | 'custom';

export interface DateRange {
  startDate: Date | undefined;
  endDate: Date | undefined;
}
