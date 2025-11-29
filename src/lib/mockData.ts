import { ComparisonData, DailyMetric, MonthlyReportData, PostData, SocialMetrics, TimeframeOption, Report } from '@/types/analytics';
import { format, subDays, subMonths, startOfMonth, endOfMonth, differenceInDays } from 'date-fns';

const generateDailyData = (startDate: Date, endDate: Date, baseEngagement: number): DailyMetric[] => {
  const data: DailyMetric[] = [];
  const days = differenceInDays(endDate, startDate) + 1;
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    data.push({
      date: format(date, 'MMM d'),
      posts: Math.floor(Math.random() * 5) + 1,
      engagement: Math.floor(baseEngagement * (0.7 + Math.random() * 0.6)),
      reach: Math.floor((baseEngagement * 10) * (0.8 + Math.random() * 0.4)),
    });
  }
  
  return data;
};

const generatePosts = (count: number, avgEngagement: number, startDate: Date, endDate: Date): PostData[] => {
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
  
  const daysDiff = differenceInDays(endDate, startDate);
  
  for (let i = 0; i < count; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + Math.floor(Math.random() * daysDiff));
    
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

const generateMetrics = (isCompany: boolean, days: number): SocialMetrics => {
  const baseMultiplier = isCompany ? 1 : 0.85 + Math.random() * 0.3;
  const dayMultiplier = days / 30;
  
  const likes = Math.floor(45000 * baseMultiplier * dayMultiplier);
  const comments = Math.floor(3200 * baseMultiplier * dayMultiplier);
  const shares = Math.floor(1800 * baseMultiplier * dayMultiplier);
  const reach = Math.floor(250000 * baseMultiplier * dayMultiplier);
  
  return {
    totalPosts: Math.floor(28 * baseMultiplier * dayMultiplier),
    likes,
    comments,
    shares,
    reach,
    engagementRate: parseFloat(((likes + comments + shares) / reach * 100).toFixed(2)),
    followersGained: Math.floor(1200 * baseMultiplier * dayMultiplier),
    followersLost: Math.floor(150 * baseMultiplier * dayMultiplier),
    netFollowers: Math.floor(1050 * baseMultiplier * dayMultiplier),
  };
};

export const getDateRangeFromTimeframe = (timeframe: TimeframeOption, customStart?: Date, customEnd?: Date): { startDate: Date; endDate: Date } => {
  const today = new Date();
  
  switch (timeframe) {
    case '7days':
      return { startDate: subDays(today, 7), endDate: today };
    case '30days':
      return { startDate: subDays(today, 30), endDate: today };
    case '60days':
      return { startDate: subDays(today, 60), endDate: today };
    case 'previous_month':
      return { 
        startDate: startOfMonth(subMonths(today, 1)), 
        endDate: endOfMonth(subMonths(today, 1)) 
      };
    case 'previous_2_months':
      return { 
        startDate: startOfMonth(subMonths(today, 2)), 
        endDate: endOfMonth(subMonths(today, 1)) 
      };
    case 'previous_quarter':
      return { 
        startDate: startOfMonth(subMonths(today, 3)), 
        endDate: endOfMonth(subMonths(today, 1)) 
      };
    case 'custom':
      return { 
        startDate: customStart || subDays(today, 30), 
        endDate: customEnd || today 
      };
    default:
      return { startDate: subDays(today, 30), endDate: today };
  }
};

export const generateMockComparison = (
  companyUrl: string,
  competitorUrl: string,
  timeframe: TimeframeOption,
  customStartDate?: Date,
  customEndDate?: Date
): ComparisonData => {
  const { startDate, endDate } = getDateRangeFromTimeframe(timeframe, customStartDate, customEndDate);
  const days = differenceInDays(endDate, startDate) + 1;
  
  const companyMetrics = generateMetrics(true, days);
  const competitorMetrics = generateMetrics(false, days);
  
  const timeframeLabels: Record<TimeframeOption, string> = {
    '7days': 'Last 7 Days',
    '30days': 'Last 30 Days',
    '60days': 'Last 60 Days',
    'previous_month': 'Previous Month',
    'previous_2_months': 'Previous 2 Months',
    'previous_quarter': 'Previous Quarter',
    'custom': `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`,
  };
  
  return {
    company: {
      name: extractName(companyUrl) || 'Your Company',
      url: companyUrl,
      metrics: companyMetrics,
      posts: generatePosts(8, companyMetrics.likes / Math.max(companyMetrics.totalPosts, 1), startDate, endDate),
      dailyData: generateDailyData(startDate, endDate, companyMetrics.likes / days),
    },
    competitor: {
      name: extractName(competitorUrl) || 'Competitor',
      url: competitorUrl,
      metrics: competitorMetrics,
      posts: generatePosts(8, competitorMetrics.likes / Math.max(competitorMetrics.totalPosts, 1), startDate, endDate),
      dailyData: generateDailyData(startDate, endDate, competitorMetrics.likes / days),
    },
    timeframe: timeframeLabels[timeframe],
    generatedAt: new Date().toISOString(),
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  };
};

export const generateMonthlyReport = (
  pageUrl: string,
  timeframe: TimeframeOption,
  customStartDate?: Date,
  customEndDate?: Date
): MonthlyReportData => {
  const { startDate, endDate } = getDateRangeFromTimeframe(timeframe, customStartDate, customEndDate);
  const days = differenceInDays(endDate, startDate) + 1;
  
  const metrics = generateMetrics(true, days);
  
  return {
    page: {
      name: extractName(pageUrl) || 'Your Page',
      url: pageUrl,
      metrics,
      posts: generatePosts(8, metrics.likes / Math.max(metrics.totalPosts, 1), startDate, endDate),
      dailyData: generateDailyData(startDate, endDate, metrics.likes / days),
    },
    timeframe: `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`,
    generatedAt: new Date().toISOString(),
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
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

export const mockReports: Report[] = [
  {
    id: '1',
    mode: 'compare',
    companyUrl: 'facebook.com/mycompany',
    competitorUrl: 'facebook.com/competitor',
    timeframe: 'Last 30 Days',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    startDate: subDays(new Date(), 32).toISOString(),
    endDate: subDays(new Date(), 2).toISOString(),
  },
  {
    id: '2',
    mode: 'monthly',
    companyUrl: 'instagram.com/mycompany',
    timeframe: 'Previous Month',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    startDate: startOfMonth(subMonths(new Date(), 1)).toISOString(),
    endDate: endOfMonth(subMonths(new Date(), 1)).toISOString(),
  },
];
