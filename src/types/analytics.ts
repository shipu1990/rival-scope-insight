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
}

export interface DailyMetric {
  date: string;
  posts: number;
  engagement: number;
  reach: number;
}

export interface Report {
  id: string;
  companyUrl: string;
  competitorUrl: string;
  timeframe: string;
  createdAt: string;
  data: ComparisonData;
}

export type TimeframeOption = '7days' | '30days' | 'custom';
