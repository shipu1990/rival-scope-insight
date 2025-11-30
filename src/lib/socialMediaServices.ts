import { 
  SocialPlatform, 
  ConnectedAccount, 
  EnhancedPost,
  FacebookPageInsights,
  InstagramBusinessInsights,
  LinkedInCompanyInsights,
  TikTokBusinessInsights
} from '@/types/socialMedia';

// Mock storage for connected accounts
let connectedAccounts: ConnectedAccount[] = [];

// ============================================
// OAuth Connection Handlers (Mock Implementation)
// ============================================

export const initiateFacebookOAuth = async (): Promise<string> => {
  // In production, redirect to:
  // https://www.facebook.com/v18.0/dialog/oauth?client_id={app-id}&redirect_uri={redirect-uri}&scope=pages_show_list,pages_read_engagement,pages_read_user_content,read_insights
  console.log('Initiating Facebook OAuth...');
  return 'mock_facebook_auth_url';
};

export const initiateInstagramOAuth = async (): Promise<string> => {
  // In production, redirect to:
  // https://api.instagram.com/oauth/authorize?client_id={app-id}&redirect_uri={redirect-uri}&scope=user_profile,user_media&response_type=code
  console.log('Initiating Instagram OAuth...');
  return 'mock_instagram_auth_url';
};

export const initiateLinkedInOAuth = async (): Promise<string> => {
  // In production, redirect to:
  // https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id={client-id}&redirect_uri={redirect-uri}&scope=r_organization_social,rw_organization_admin
  console.log('Initiating LinkedIn OAuth...');
  return 'mock_linkedin_auth_url';
};

export const initiateTikTokOAuth = async (): Promise<string> => {
  // In production, redirect to:
  // https://www.tiktok.com/auth/authorize?client_key={client-key}&redirect_uri={redirect-uri}&scope=user.info.basic,video.list
  console.log('Initiating TikTok OAuth...');
  return 'mock_tiktok_auth_url';
};

// ============================================
// Mock Connection Simulator
// ============================================

export const simulateOAuthConnection = async (platform: SocialPlatform): Promise<ConnectedAccount> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const mockAccounts: Record<SocialPlatform, Omit<ConnectedAccount, 'id' | 'connectedAt'>> = {
    facebook: {
      platform: 'facebook',
      accountName: 'My Business Page',
      accountId: 'fb_123456789',
      profileImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=100&fit=crop',
    },
    instagram: {
      platform: 'instagram',
      accountName: '@mybusiness',
      accountId: 'ig_987654321',
      profileImage: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=100&h=100&fit=crop',
    },
    linkedin: {
      platform: 'linkedin',
      accountName: 'My Company LLC',
      accountId: 'li_456789123',
      profileImage: 'https://images.unsplash.com/photo-1611944212129-29977ae1398c?w=100&h=100&fit=crop',
    },
    tiktok: {
      platform: 'tiktok',
      accountName: '@mybusiness_tiktok',
      accountId: 'tt_321654987',
      profileImage: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=100&h=100&fit=crop',
    },
  };

  const newAccount: ConnectedAccount = {
    ...mockAccounts[platform],
    id: `${platform}_${Date.now()}`,
    connectedAt: new Date().toISOString(),
    accessToken: `mock_token_${platform}_${Date.now()}`,
  };

  connectedAccounts.push(newAccount);
  return newAccount;
};

export const disconnectAccount = (accountId: string): void => {
  connectedAccounts = connectedAccounts.filter(acc => acc.id !== accountId);
};

export const getConnectedAccounts = (): ConnectedAccount[] => {
  return [...connectedAccounts];
};

// ============================================
// Mock Data Generators for Enhanced Posts
// ============================================

const generateMockThumbnail = (postType: EnhancedPost['postType']): string => {
  const thumbnails = [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=300&h=300&fit=crop',
  ];
  return thumbnails[Math.floor(Math.random() * thumbnails.length)];
};

export const generateEnhancedPosts = (count: number = 15): EnhancedPost[] => {
  const postTypes: EnhancedPost['postType'][] = ['photo', 'video', 'carousel', 'link', 'text'];
  const captions = [
    '🚀 Excited to announce our new product launch! Check out the link in bio for more details. #innovation #launch',
    '📊 This week\'s analytics are looking great! Our team has been working hard to deliver results.',
    '💡 Tips for improving your social media presence: 1. Be consistent 2. Engage with your audience 3. Quality over quantity',
    '🎉 Thank you for 10K followers! We couldn\'t have done it without your amazing support.',
    '📸 Behind the scenes at our latest photoshoot. Stay tuned for more exciting content!',
    '🌟 Customer spotlight: See how @customer transformed their business using our platform.',
    '📈 Q3 results are in! We\'ve exceeded our growth targets by 25%. Here\'s how we did it...',
    '💼 We\'re hiring! Join our team and help us build the future of social media analytics.',
    '🎯 New feature alert: Introducing advanced competitor analysis. Try it now!',
    '🤝 Proud to partner with @partner to bring you even better insights and tools.',
    '📱 Mobile app update: Faster load times, new charts, and improved UX. Update now!',
    '💪 Monday motivation: Success is not final, failure is not fatal. Keep pushing!',
    '🎨 Check out our new brand refresh! Same great product, fresh new look.',
    '📚 Free webinar this Thursday: "Mastering Social Media Analytics in 2024"',
    '🏆 Awarded "Best Analytics Platform" by TechReview. Thank you for believing in us!',
  ];

  return Array.from({ length: count }, (_, i) => {
    const postType = postTypes[Math.floor(Math.random() * postTypes.length)];
    const isVideo = postType === 'video';
    const baseEngagement = Math.floor(Math.random() * 5000) + 500;
    
    return {
      id: `post_${Date.now()}_${i}`,
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      content: captions[i % captions.length],
      postType,
      thumbnailUrl: postType !== 'text' ? generateMockThumbnail(postType) : undefined,
      likes: baseEngagement + Math.floor(Math.random() * 2000),
      comments: Math.floor(baseEngagement * 0.1) + Math.floor(Math.random() * 200),
      shares: Math.floor(baseEngagement * 0.05) + Math.floor(Math.random() * 100),
      saves: Math.floor(baseEngagement * 0.08) + Math.floor(Math.random() * 150),
      reach: baseEngagement * 10 + Math.floor(Math.random() * 50000),
      impressions: baseEngagement * 15 + Math.floor(Math.random() * 75000),
      engagementRate: parseFloat((Math.random() * 8 + 2).toFixed(2)),
      videoViews: isVideo ? baseEngagement * 5 + Math.floor(Math.random() * 25000) : undefined,
      avgWatchTime: isVideo ? Math.floor(Math.random() * 45) + 15 : undefined,
      reactions: {
        like: Math.floor(baseEngagement * 0.6),
        love: Math.floor(baseEngagement * 0.2),
        wow: Math.floor(baseEngagement * 0.08),
        haha: Math.floor(baseEngagement * 0.05),
        sad: Math.floor(baseEngagement * 0.02),
        angry: Math.floor(baseEngagement * 0.01),
      },
    };
  }).sort((a, b) => b.likes - a.likes);
};

// ============================================
// Platform-Specific API Handlers (Mock)
// ============================================

export const fetchFacebookPageInsights = async (pageId: string): Promise<FacebookPageInsights> => {
  // In production, call: GET /v18.0/{page-id}/insights
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    pageId,
    name: 'My Business Page',
    profilePicture: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=200&fit=crop',
    coverPhoto: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=300&fit=crop',
    about: 'Leading provider of social media analytics and insights.',
    followers: 45678,
    followersGained: 1234,
    followersLost: 156,
    posts: generateEnhancedPosts(15),
    totalReach: 2345678,
    totalImpressions: 5678901,
  };
};

export const fetchInstagramBusinessInsights = async (profileId: string): Promise<InstagramBusinessInsights> => {
  // In production, call: GET /v18.0/{ig-user-id}/insights
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    profileId,
    username: '@mybusiness',
    bio: '📊 Social Media Analytics | 🚀 Growth Expert | 💡 Data-Driven Insights',
    profilePicture: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=200&h=200&fit=crop',
    followers: 32456,
    following: 1234,
    posts: generateEnhancedPosts(15),
    storiesPerformance: {
      views: 12345,
      replies: 234,
      exits: 567,
    },
  };
};

export const fetchLinkedInCompanyInsights = async (companyId: string): Promise<LinkedInCompanyInsights> => {
  // In production, call: GET /v2/organizationalEntityShareStatistics
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    companyId,
    name: 'My Company LLC',
    logoUrl: 'https://images.unsplash.com/photo-1611944212129-29977ae1398c?w=200&h=200&fit=crop',
    followers: 15678,
    posts: generateEnhancedPosts(15),
    totalImpressions: 1234567,
    engagementRate: 4.56,
  };
};

export const fetchTikTokBusinessInsights = async (profileId: string): Promise<TikTokBusinessInsights> => {
  // In production, call: GET /v2/research/user/info/
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    profileId,
    username: '@mybusiness_tiktok',
    profilePicture: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=200&h=200&fit=crop',
    followers: 78901,
    totalLikes: 456789,
    videos: generateEnhancedPosts(15).map(post => ({ ...post, postType: 'video' as const })),
    avgCompletionRate: 67.8,
  };
};
