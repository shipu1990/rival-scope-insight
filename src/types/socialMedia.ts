export type SocialPlatform = 'facebook' | 'instagram' | 'linkedin' | 'tiktok';

export interface ConnectedAccount {
  id: string;
  platform: SocialPlatform;
  accountName: string;
  accountId: string;
  profileImage?: string;
  connectedAt: string;
  accessToken?: string;
}

export interface EnhancedPost {
  id: string;
  date: string;
  content: string;
  postType: 'photo' | 'video' | 'carousel' | 'link' | 'text';
  thumbnailUrl?: string;
  likes: number;
  comments: number;
  shares: number;
  saves?: number;
  reach: number;
  impressions: number;
  engagementRate: number;
  videoViews?: number;
  avgWatchTime?: number;
  reactions?: {
    like: number;
    love: number;
    wow: number;
    haha: number;
    sad: number;
    angry: number;
  };
}

export interface FacebookPageInsights {
  pageId: string;
  name: string;
  profilePicture: string;
  coverPhoto?: string;
  about?: string;
  followers: number;
  followersGained: number;
  followersLost: number;
  posts: EnhancedPost[];
  totalReach: number;
  totalImpressions: number;
}

export interface InstagramBusinessInsights {
  profileId: string;
  username: string;
  bio?: string;
  profilePicture: string;
  followers: number;
  following: number;
  posts: EnhancedPost[];
  storiesPerformance?: {
    views: number;
    replies: number;
    exits: number;
  };
}

export interface LinkedInCompanyInsights {
  companyId: string;
  name: string;
  logoUrl?: string;
  followers: number;
  posts: EnhancedPost[];
  totalImpressions: number;
  engagementRate: number;
}

export interface TikTokBusinessInsights {
  profileId: string;
  username: string;
  profilePicture: string;
  followers: number;
  totalLikes: number;
  videos: EnhancedPost[];
  avgCompletionRate: number;
}
