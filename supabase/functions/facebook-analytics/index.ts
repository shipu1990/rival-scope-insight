import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FACEBOOK_APP_ID = Deno.env.get('FACEBOOK_APP_ID');
const FACEBOOK_APP_SECRET = Deno.env.get('FACEBOOK_APP_SECRET');
const GRAPH_API_VERSION = 'v18.0';
const GRAPH_API_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

interface FacebookPage {
  id: string;
  name: string;
  picture?: { data: { url: string } };
  category?: string;
  fan_count?: number;
  followers_count?: number;
  is_verified?: boolean;
  overall_star_rating?: number;
  about?: string;
}

interface FacebookPost {
  id: string;
  message?: string;
  created_time: string;
  full_picture?: string;
  attachments?: {
    data: Array<{
      type: string;
      media?: { image?: { src: string } };
      subattachments?: { data: Array<{ media?: { image?: { src: string } } }> };
    }>;
  };
  reactions?: { summary: { total_count: number } };
  comments?: { summary: { total_count: number } };
  shares?: { count: number };
  type?: string;
}

interface PageInsights {
  page_impressions?: number;
  page_impressions_organic?: number;
  page_impressions_paid?: number;
  page_engaged_users?: number;
  page_fans?: number;
  page_fan_adds?: number;
  page_fan_removes?: number;
  page_views_total?: number;
}

// Validate Facebook page URL and extract page ID
function extractPageId(url: string): string | null {
  if (!url) return null;
  
  // Clean the URL
  let cleanUrl = url.trim();
  
  // Handle various Facebook URL formats
  const patterns = [
    /facebook\.com\/(?:pages\/)?([^\/\?]+)/i,
    /fb\.com\/([^\/\?]+)/i,
    /^([a-zA-Z0-9._-]+)$/,  // Just page ID or username
  ];
  
  for (const pattern of patterns) {
    const match = cleanUrl.match(pattern);
    if (match && match[1]) {
      // Filter out common non-page paths
      const pageId = match[1];
      if (!['profile.php', 'home', 'watch', 'marketplace', 'groups'].includes(pageId.toLowerCase())) {
        return pageId;
      }
    }
  }
  
  return null;
}

// Get app access token
async function getAppAccessToken(): Promise<string> {
  const response = await fetch(
    `${GRAPH_API_BASE}/oauth/access_token?client_id=${FACEBOOK_APP_ID}&client_secret=${FACEBOOK_APP_SECRET}&grant_type=client_credentials`
  );
  
  if (!response.ok) {
    const error = await response.text();
    console.error('Failed to get app access token:', error);
    throw new Error('Failed to authenticate with Facebook');
  }
  
  const data = await response.json();
  return data.access_token;
}

// Fetch public page info (no user token required)
async function fetchPublicPageInfo(pageId: string, accessToken: string): Promise<{ page: FacebookPage | null; error?: string }> {
  const fields = 'id,name,picture.type(large),category,fan_count,followers_count,is_verified,overall_star_rating,about';
  
  const response = await fetch(
    `${GRAPH_API_BASE}/${pageId}?fields=${fields}&access_token=${accessToken}`
  );
  
  if (!response.ok) {
    const error = await response.json();
    console.error('Failed to fetch page info:', error);
    
    // Check for permission-related errors
    if (error?.error?.code === 100) {
      const message = error?.error?.message || '';
      if (message.includes('pages_read_engagement') || message.includes('Page Public Content Access')) {
        return { 
          page: null, 
          error: `Cannot access page "${pageId}". Your Facebook App requires "Page Public Content Access" feature approval. Visit developers.facebook.com to submit your app for review.`
        };
      }
      if (message.includes('does not exist')) {
        return { page: null, error: `Facebook page "${pageId}" does not exist or is not accessible.` };
      }
    }
    
    return { page: null, error: `Could not fetch page "${pageId}": ${error?.error?.message || 'Unknown error'}` };
  }
  
  return { page: await response.json() };
}

// Fetch public posts (limited data without page token)
async function fetchPublicPosts(pageId: string, accessToken: string, since?: string, until?: string): Promise<FacebookPost[]> {
  let url = `${GRAPH_API_BASE}/${pageId}/posts?fields=id,message,created_time,full_picture,attachments{type,media,subattachments},type&limit=100&access_token=${accessToken}`;
  
  if (since) url += `&since=${since}`;
  if (until) url += `&until=${until}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    console.error('Failed to fetch posts:', await response.text());
    return [];
  }
  
  const data = await response.json();
  return data.data || [];
}

// Fetch post engagement (public reactions/comments/shares when available)
async function fetchPostEngagement(postId: string, accessToken: string): Promise<{
  reactions: number;
  comments: number;
  shares: number;
}> {
  const fields = 'reactions.summary(true),comments.summary(true),shares';
  
  const response = await fetch(
    `${GRAPH_API_BASE}/${postId}?fields=${fields}&access_token=${accessToken}`
  );
  
  if (!response.ok) {
    return { reactions: 0, comments: 0, shares: 0 };
  }
  
  const data = await response.json();
  
  return {
    reactions: data.reactions?.summary?.total_count || 0,
    comments: data.comments?.summary?.total_count || 0,
    shares: data.shares?.count || 0,
  };
}

// Fetch page insights (requires page access token with permissions)
async function fetchPageInsights(pageId: string, accessToken: string, since?: string, until?: string): Promise<PageInsights> {
  const metrics = [
    'page_impressions',
    'page_impressions_organic',
    'page_impressions_paid',
    'page_engaged_users',
    'page_fans',
    'page_fan_adds',
    'page_fan_removes',
    'page_views_total'
  ].join(',');
  
  let url = `${GRAPH_API_BASE}/${pageId}/insights?metric=${metrics}&period=day&access_token=${accessToken}`;
  
  if (since) url += `&since=${since}`;
  if (until) url += `&until=${until}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    console.error('Failed to fetch insights (may require page token):', await response.text());
    return {};
  }
  
  const data = await response.json();
  const insights: PageInsights = {};
  
  for (const metric of data.data || []) {
    const values = metric.values || [];
    const total = values.reduce((sum: number, v: { value: number }) => sum + (v.value || 0), 0);
    (insights as any)[metric.name] = total;
  }
  
  return insights;
}

// Process and aggregate data for a page
async function processPageData(
  pageId: string, 
  accessToken: string, 
  userAccessToken: string | null,
  startDate: string,
  endDate: string,
  isOwnPage: boolean
): Promise<{
  pageInfo: FacebookPage | null;
  metrics: {
    totalPosts: number;
    likes: number;
    comments: number;
    shares: number;
    reach: number | string;
    engagementRate: number | string;
    followersGained: number | string;
    followersLost: number | string;
    netFollowers: number | string;
    impressions?: number | string;
    organicReach?: number | string;
    paidReach?: number | string;
  };
  posts: Array<{
    id: string;
    date: string;
    content: string;
    likes: number;
    comments: number;
    shares: number;
    engagementRate: number;
    thumbnail?: string;
    type?: string;
  }>;
  dailyData: Array<{
    date: string;
    posts: number;
    engagement: number;
    reach: number;
  }>;
}> {
  // Determine which token to use
  const effectiveToken = isOwnPage && userAccessToken ? userAccessToken : accessToken;
  
  // Fetch page info
  const pageResult = await fetchPublicPageInfo(pageId, effectiveToken);
  
  if (!pageResult.page) {
    throw new Error(pageResult.error || `Invalid Facebook page: ${pageId}`);
  }
  
  const pageInfo = pageResult.page;
  
  // Fetch posts
  const startTimestamp = Math.floor(new Date(startDate).getTime() / 1000);
  const endTimestamp = Math.floor(new Date(endDate).getTime() / 1000);
  
  const posts = await fetchPublicPosts(pageId, effectiveToken, startTimestamp.toString(), endTimestamp.toString());
  
  // Fetch engagement for each post (limited to top 50 for performance)
  const postsWithEngagement = await Promise.all(
    posts.slice(0, 50).map(async (post) => {
      const engagement = await fetchPostEngagement(post.id, effectiveToken);
      return {
        id: post.id,
        date: post.created_time,
        content: post.message || '',
        likes: engagement.reactions,
        comments: engagement.comments,
        shares: engagement.shares,
        engagementRate: 0, // Will calculate after
        thumbnail: post.full_picture || post.attachments?.data?.[0]?.media?.image?.src,
        type: post.type || 'status',
      };
    })
  );
  
  // Calculate totals
  const totalLikes = postsWithEngagement.reduce((sum, p) => sum + p.likes, 0);
  const totalComments = postsWithEngagement.reduce((sum, p) => sum + p.comments, 0);
  const totalShares = postsWithEngagement.reduce((sum, p) => sum + p.shares, 0);
  const totalEngagement = totalLikes + totalComments + totalShares;
  
  // Fetch insights if we have proper permissions (own page with user token)
  let insights: PageInsights = {};
  let reach: number | string = 'Not Available';
  let engagementRate: number | string = 'Not Available';
  let followersGained: number | string = 'Not Available';
  let followersLost: number | string = 'Not Available';
  let netFollowers: number | string = 'Not Available';
  
  if (isOwnPage && userAccessToken) {
    try {
      insights = await fetchPageInsights(pageId, userAccessToken, startTimestamp.toString(), endTimestamp.toString());
      
      reach = insights.page_impressions || 0;
      followersGained = insights.page_fan_adds || 0;
      followersLost = insights.page_fan_removes || 0;
      netFollowers = (insights.page_fan_adds || 0) - (insights.page_fan_removes || 0);
      
      if (typeof reach === 'number' && reach > 0) {
        engagementRate = parseFloat(((totalEngagement / reach) * 100).toFixed(2));
      }
    } catch (error) {
      console.error('Failed to fetch insights:', error);
    }
  } else {
    // For competitor pages, estimate based on follower count if available
    if (pageInfo.fan_count && pageInfo.fan_count > 0) {
      engagementRate = parseFloat(((totalEngagement / pageInfo.fan_count) * 100).toFixed(2));
    }
  }
  
  // Calculate engagement rate for each post
  const totalFollowers = pageInfo.fan_count || pageInfo.followers_count || 1;
  postsWithEngagement.forEach(post => {
    const postEngagement = post.likes + post.comments + post.shares;
    post.engagementRate = parseFloat(((postEngagement / totalFollowers) * 100).toFixed(2));
  });
  
  // Sort posts by engagement
  postsWithEngagement.sort((a, b) => (b.likes + b.comments + b.shares) - (a.likes + a.comments + a.shares));
  
  // Generate daily data (aggregate posts by date)
  const dailyMap = new Map<string, { posts: number; engagement: number; reach: number }>();
  
  postsWithEngagement.forEach(post => {
    const dateKey = new Date(post.date).toISOString().split('T')[0];
    const existing = dailyMap.get(dateKey) || { posts: 0, engagement: 0, reach: 0 };
    dailyMap.set(dateKey, {
      posts: existing.posts + 1,
      engagement: existing.engagement + post.likes + post.comments + post.shares,
      reach: existing.reach + (post.likes * 10), // Estimate
    });
  });
  
  // Fill in missing dates
  const dailyData: Array<{ date: string; posts: number; engagement: number; reach: number }> = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateKey = d.toISOString().split('T')[0];
    const data = dailyMap.get(dateKey) || { posts: 0, engagement: 0, reach: 0 };
    dailyData.push({
      date: new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      ...data,
    });
  }
  
  return {
    pageInfo,
    metrics: {
      totalPosts: posts.length,
      likes: totalLikes,
      comments: totalComments,
      shares: totalShares,
      reach,
      engagementRate,
      followersGained,
      followersLost,
      netFollowers,
      impressions: insights.page_impressions || 'Not Available',
      organicReach: insights.page_impressions_organic || 'Not Available',
      paidReach: insights.page_impressions_paid || 'Not Available',
    },
    posts: postsWithEngagement.slice(0, 15),
    dailyData,
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      mode,
      companyUrl,
      competitorUrl,
      pageUrl,
      startDate,
      endDate,
      userAccessToken
    } = await req.json();

    console.log('Request received:', { mode, companyUrl, competitorUrl, pageUrl, startDate, endDate });

    if (!FACEBOOK_APP_ID || !FACEBOOK_APP_SECRET) {
      throw new Error('Facebook API credentials not configured');
    }

    // Get app access token
    const appAccessToken = await getAppAccessToken();

    if (mode === 'compare') {
      // Validate URLs
      const companyPageId = extractPageId(companyUrl);
      const competitorPageId = extractPageId(competitorUrl);

      if (!companyPageId) {
        return new Response(
          JSON.stringify({ error: 'Invalid Facebook page URL for your company' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!competitorPageId) {
        return new Response(
          JSON.stringify({ error: 'Invalid Facebook page URL for competitor' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Fetch data for both pages in parallel
      const [companyData, competitorData] = await Promise.all([
        processPageData(companyPageId, appAccessToken, userAccessToken, startDate, endDate, !!userAccessToken),
        processPageData(competitorPageId, appAccessToken, null, startDate, endDate, false),
      ]);

      const result = {
        company: {
          name: companyData.pageInfo?.name || 'Your Company',
          url: companyUrl,
          picture: companyData.pageInfo?.picture?.data?.url,
          category: companyData.pageInfo?.category,
          isVerified: companyData.pageInfo?.is_verified,
          followers: companyData.pageInfo?.fan_count || companyData.pageInfo?.followers_count,
          metrics: companyData.metrics,
          posts: companyData.posts,
          dailyData: companyData.dailyData,
        },
        competitor: {
          name: competitorData.pageInfo?.name || 'Competitor',
          url: competitorUrl,
          picture: competitorData.pageInfo?.picture?.data?.url,
          category: competitorData.pageInfo?.category,
          isVerified: competitorData.pageInfo?.is_verified,
          followers: competitorData.pageInfo?.fan_count || competitorData.pageInfo?.followers_count,
          metrics: competitorData.metrics,
          posts: competitorData.posts,
          dailyData: competitorData.dailyData,
        },
        timeframe: `${new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
        generatedAt: new Date().toISOString(),
        startDate,
        endDate,
      };

      console.log('Comparison result generated successfully');

      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (mode === 'monthly') {
      // Validate URL
      const pageId = extractPageId(pageUrl);

      if (!pageId) {
        return new Response(
          JSON.stringify({ error: 'Invalid Facebook page URL' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const pageData = await processPageData(pageId, appAccessToken, userAccessToken, startDate, endDate, !!userAccessToken);

      const result = {
        page: {
          name: pageData.pageInfo?.name || 'Your Page',
          url: pageUrl,
          picture: pageData.pageInfo?.picture?.data?.url,
          category: pageData.pageInfo?.category,
          isVerified: pageData.pageInfo?.is_verified,
          followers: pageData.pageInfo?.fan_count || pageData.pageInfo?.followers_count,
          metrics: pageData.metrics,
          posts: pageData.posts,
          dailyData: pageData.dailyData,
        },
        timeframe: `${new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
        generatedAt: new Date().toISOString(),
        startDate,
        endDate,
      };

      console.log('Monthly report generated successfully');

      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid mode. Use "compare" or "monthly"' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error in facebook-analytics function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
