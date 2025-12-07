import { supabase } from '@/integrations/supabase/client';
import { ComparisonData, MonthlyReportData, TimeframeOption } from '@/types/analytics';
import { format } from 'date-fns';
import { getDateRangeFromTimeframe } from './mockData';

// Validate Facebook URL format
export function isValidFacebookUrl(url: string): boolean {
  if (!url) return false;
  
  const patterns = [
    /facebook\.com\/(?:pages\/)?[^\/\?]+/i,
    /fb\.com\/[^\/\?]+/i,
    /^[a-zA-Z0-9._-]+$/, // Just page ID or username
  ];
  
  return patterns.some(pattern => pattern.test(url.trim()));
}

// Transform API response to match existing ComparisonData interface
function transformToComparisonData(apiResponse: any): ComparisonData {
  return {
    company: {
      name: apiResponse.company.name,
      url: apiResponse.company.url,
      metrics: {
        totalPosts: apiResponse.company.metrics.totalPosts,
        likes: apiResponse.company.metrics.likes,
        comments: apiResponse.company.metrics.comments,
        shares: apiResponse.company.metrics.shares,
        reach: typeof apiResponse.company.metrics.reach === 'number' ? apiResponse.company.metrics.reach : 0,
        engagementRate: typeof apiResponse.company.metrics.engagementRate === 'number' ? apiResponse.company.metrics.engagementRate : 0,
        followersGained: typeof apiResponse.company.metrics.followersGained === 'number' ? apiResponse.company.metrics.followersGained : 0,
        followersLost: typeof apiResponse.company.metrics.followersLost === 'number' ? apiResponse.company.metrics.followersLost : 0,
        netFollowers: typeof apiResponse.company.metrics.netFollowers === 'number' ? apiResponse.company.metrics.netFollowers : 0,
      },
      posts: apiResponse.company.posts.map((post: any, index: number) => ({
        id: post.id || `post-${index}`,
        date: post.date,
        content: post.content || '',
        likes: post.likes,
        comments: post.comments,
        shares: post.shares,
        engagementRate: post.engagementRate,
        thumbnail: post.thumbnail,
        type: post.type,
      })),
      dailyData: apiResponse.company.dailyData,
    },
    competitor: {
      name: apiResponse.competitor.name,
      url: apiResponse.competitor.url,
      metrics: {
        totalPosts: apiResponse.competitor.metrics.totalPosts,
        likes: apiResponse.competitor.metrics.likes,
        comments: apiResponse.competitor.metrics.comments,
        shares: apiResponse.competitor.metrics.shares,
        reach: typeof apiResponse.competitor.metrics.reach === 'number' ? apiResponse.competitor.metrics.reach : 0,
        engagementRate: typeof apiResponse.competitor.metrics.engagementRate === 'number' ? apiResponse.competitor.metrics.engagementRate : 0,
        followersGained: typeof apiResponse.competitor.metrics.followersGained === 'number' ? apiResponse.competitor.metrics.followersGained : 0,
        followersLost: typeof apiResponse.competitor.metrics.followersLost === 'number' ? apiResponse.competitor.metrics.followersLost : 0,
        netFollowers: typeof apiResponse.competitor.metrics.netFollowers === 'number' ? apiResponse.competitor.metrics.netFollowers : 0,
      },
      posts: apiResponse.competitor.posts.map((post: any, index: number) => ({
        id: post.id || `post-${index}`,
        date: post.date,
        content: post.content || '',
        likes: post.likes,
        comments: post.comments,
        shares: post.shares,
        engagementRate: post.engagementRate,
        thumbnail: post.thumbnail,
        type: post.type,
      })),
      dailyData: apiResponse.competitor.dailyData,
    },
    timeframe: apiResponse.timeframe,
    generatedAt: apiResponse.generatedAt,
    startDate: apiResponse.startDate,
    endDate: apiResponse.endDate,
  };
}

// Transform API response to match existing MonthlyReportData interface
function transformToMonthlyData(apiResponse: any): MonthlyReportData {
  return {
    page: {
      name: apiResponse.page.name,
      url: apiResponse.page.url,
      metrics: {
        totalPosts: apiResponse.page.metrics.totalPosts,
        likes: apiResponse.page.metrics.likes,
        comments: apiResponse.page.metrics.comments,
        shares: apiResponse.page.metrics.shares,
        reach: typeof apiResponse.page.metrics.reach === 'number' ? apiResponse.page.metrics.reach : 0,
        engagementRate: typeof apiResponse.page.metrics.engagementRate === 'number' ? apiResponse.page.metrics.engagementRate : 0,
        followersGained: typeof apiResponse.page.metrics.followersGained === 'number' ? apiResponse.page.metrics.followersGained : 0,
        followersLost: typeof apiResponse.page.metrics.followersLost === 'number' ? apiResponse.page.metrics.followersLost : 0,
        netFollowers: typeof apiResponse.page.metrics.netFollowers === 'number' ? apiResponse.page.metrics.netFollowers : 0,
      },
      posts: apiResponse.page.posts.map((post: any, index: number) => ({
        id: post.id || `post-${index}`,
        date: post.date,
        content: post.content || '',
        likes: post.likes,
        comments: post.comments,
        shares: post.shares,
        engagementRate: post.engagementRate,
        thumbnail: post.thumbnail,
        type: post.type,
      })),
      dailyData: apiResponse.page.dailyData,
    },
    timeframe: apiResponse.timeframe,
    generatedAt: apiResponse.generatedAt,
    startDate: apiResponse.startDate,
    endDate: apiResponse.endDate,
  };
}

// Fetch comparison data from Facebook API
export async function fetchFacebookComparison(
  companyUrl: string,
  competitorUrl: string,
  timeframe: TimeframeOption,
  customStartDate?: Date,
  customEndDate?: Date,
  userAccessToken?: string
): Promise<ComparisonData> {
  // Validate URLs
  if (!isValidFacebookUrl(companyUrl)) {
    throw new Error('Invalid Facebook page URL for your company');
  }
  
  if (!isValidFacebookUrl(competitorUrl)) {
    throw new Error('Invalid Facebook page URL for competitor');
  }
  
  // Get date range
  const { startDate, endDate } = getDateRangeFromTimeframe(timeframe, customStartDate, customEndDate);
  
  const { data, error } = await supabase.functions.invoke('facebook-analytics', {
    body: {
      mode: 'compare',
      companyUrl,
      competitorUrl,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      userAccessToken,
    },
  });
  
  if (error) {
    console.error('Error fetching Facebook comparison:', error);
    throw new Error(error.message || 'Failed to fetch Facebook data');
  }
  
  if (data.error) {
    throw new Error(data.error);
  }
  
  return transformToComparisonData(data);
}

// Fetch monthly report data from Facebook API
export async function fetchFacebookMonthlyReport(
  pageUrl: string,
  timeframe: TimeframeOption,
  customStartDate?: Date,
  customEndDate?: Date,
  userAccessToken?: string
): Promise<MonthlyReportData> {
  // Validate URL
  if (!isValidFacebookUrl(pageUrl)) {
    throw new Error('Invalid Facebook page URL');
  }
  
  // Get date range
  const { startDate, endDate } = getDateRangeFromTimeframe(timeframe, customStartDate, customEndDate);
  
  const { data, error } = await supabase.functions.invoke('facebook-analytics', {
    body: {
      mode: 'monthly',
      pageUrl,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      userAccessToken,
    },
  });
  
  if (error) {
    console.error('Error fetching Facebook monthly report:', error);
    throw new Error(error.message || 'Failed to fetch Facebook data');
  }
  
  if (data.error) {
    throw new Error(data.error);
  }
  
  return transformToMonthlyData(data);
}

// Facebook OAuth URL generator (for "Your Page" authentication)
export function getFacebookOAuthUrl(): string {
  const appId = import.meta.env.VITE_FACEBOOK_APP_ID || '';
  const redirectUri = `${window.location.origin}/auth/facebook/callback`;
  const scope = 'pages_read_engagement,pages_read_user_content,pages_show_list';
  
  return `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code`;
}
