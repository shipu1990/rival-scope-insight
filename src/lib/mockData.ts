import { ComparisonData, DailyMetric, PostData, SocialMetrics } from '@/types/analytics';

const generateDailyData = (days: number, baseEngagement: number): DailyMetric[] => {
  const data: DailyMetric[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      posts: Math.floor(Math.random() * 5) + 1,
      engagement: Math.floor(baseEngagement * (0.7 + Math.random() * 0.6)),
      reach: Math.floor((baseEngagement * 10) * (0.8 + Math.random() * 0.4)),
    });
  }
  
  return data;
};

const generatePosts = (count: number, avgEngagement: number): PostData[] => {
  const posts: PostData[] = [];
  const contents = [
    "Excited to announce our new product launch! 🚀",
    "Behind the scenes at our latest photoshoot 📸",
    "Thank you for 100K followers! 🎉",
    "Tips and tricks from our expert team 💡",
    "Customer spotlight: See how they use our product",
    "Big news coming soon... stay tuned! 👀",
    "Throwback to our company's founding moment",
    "Meet our amazing team members! 👋",
  ];
  
  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    const likes = Math.floor(avgEngagement * (0.5 + Math.random()));
    const comments = Math.floor(likes * 0.1);
    const shares = Math.floor(likes * 0.05);
    
    posts.push({
      id: `post-${i}`,
      date: date.toISOString(),
      content: contents[i % contents.length],
      likes,
      comments,
      shares,
      engagementRate: parseFloat(((likes + comments + shares) / (avgEngagement * 10) * 100).toFixed(2)),
    });
  }
  
  return posts.sort((a, b) => b.likes - a.likes);
};

const generateMetrics = (isCompany: boolean): SocialMetrics => {
  const baseMultiplier = isCompany ? 1 : 0.85 + Math.random() * 0.3;
  
  const likes = Math.floor(45000 * baseMultiplier);
  const comments = Math.floor(3200 * baseMultiplier);
  const shares = Math.floor(1800 * baseMultiplier);
  const reach = Math.floor(250000 * baseMultiplier);
  
  return {
    totalPosts: Math.floor(28 * baseMultiplier),
    likes,
    comments,
    shares,
    reach,
    engagementRate: parseFloat(((likes + comments + shares) / reach * 100).toFixed(2)),
    followersGained: Math.floor(1200 * baseMultiplier),
    followersLost: Math.floor(150 * baseMultiplier),
    netFollowers: Math.floor(1050 * baseMultiplier),
  };
};

export const generateMockComparison = (
  companyUrl: string,
  competitorUrl: string,
  timeframe: string
): ComparisonData => {
  const days = timeframe === '7days' ? 7 : 30;
  
  const companyMetrics = generateMetrics(true);
  const competitorMetrics = generateMetrics(false);
  
  return {
    company: {
      name: extractName(companyUrl) || 'Your Company',
      url: companyUrl,
      metrics: companyMetrics,
      posts: generatePosts(8, companyMetrics.likes / 28),
      dailyData: generateDailyData(days, companyMetrics.likes / days),
    },
    competitor: {
      name: extractName(competitorUrl) || 'Competitor',
      url: competitorUrl,
      metrics: competitorMetrics,
      posts: generatePosts(8, competitorMetrics.likes / 28),
      dailyData: generateDailyData(days, competitorMetrics.likes / days),
    },
    timeframe: timeframe === '7days' ? 'Last 7 Days' : 'Last 30 Days',
    generatedAt: new Date().toISOString(),
  };
};

const extractName = (url: string): string => {
  try {
    const cleanUrl = url.replace(/^(https?:\/\/)?(www\.)?/, '');
    const parts = cleanUrl.split('/');
    if (parts.length > 1 && parts[1]) {
      return parts[1].replace(/[^a-zA-Z0-9]/g, ' ').trim() || parts[0].split('.')[0];
    }
    return parts[0].split('.')[0];
  } catch {
    return url.slice(0, 20);
  }
};

export const mockReports = [
  {
    id: '1',
    companyUrl: 'facebook.com/mycompany',
    competitorUrl: 'facebook.com/competitor',
    timeframe: 'Last 30 Days',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: '2',
    companyUrl: 'instagram.com/mycompany',
    competitorUrl: 'instagram.com/competitor',
    timeframe: 'Last 7 Days',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];
