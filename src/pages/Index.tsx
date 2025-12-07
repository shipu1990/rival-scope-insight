import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { CompareForm } from '@/components/compare/CompareForm';
import { MonthlyReportForm } from '@/components/monthly/MonthlyReportForm';
import { StatCard } from '@/components/dashboard/StatCard';
import { ComparisonChart } from '@/components/dashboard/ComparisonChart';
import { EngagementTrend } from '@/components/dashboard/EngagementTrend';
import { MetricsTable } from '@/components/dashboard/MetricsTable';
import { TopPosts } from '@/components/dashboard/TopPosts';
import { MonthlyMetricsTable } from '@/components/dashboard/MonthlyMetricsTable';
import { SinglePageChart } from '@/components/dashboard/SinglePageChart';
import { SinglePagePosts } from '@/components/dashboard/SinglePagePosts';
import { EnhancedTopPosts } from '@/components/dashboard/EnhancedTopPosts';
import { generateMockComparison, generateMonthlyReport } from '@/lib/mockData';
import { generateComparisonPDF, generateMonthlyPDF } from '@/lib/pdfGenerator';
import { fetchFacebookComparison, fetchFacebookMonthlyReport, isValidFacebookUrl } from '@/lib/facebookApi';
import { ComparisonData, MonthlyReportData, TimeframeOption } from '@/types/analytics';
import { EnhancedPost } from '@/types/socialMedia';
import { Heart, Eye, Users, FileText, Download, GitCompare, CalendarRange } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const Index = () => {
  const [activeMode, setActiveMode] = useState<'compare' | 'monthly'>('compare');
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [useMockData, setUseMockData] = useState(false);

  const handleCompare = async (companyUrl: string, competitorUrl: string, timeframe: TimeframeOption, startDate?: Date, endDate?: Date) => {
    setIsLoading(true);
    
    try {
      // Try to fetch real data from Facebook API
      const data = await fetchFacebookComparison(companyUrl, competitorUrl, timeframe, startDate, endDate);
      setComparisonData(data);
      setUseMockData(false);
      toast.success('Real Facebook data fetched successfully!');
    } catch (error) {
      console.error('Failed to fetch Facebook data, using mock data:', error);
      // Fall back to mock data
      const data = generateMockComparison(companyUrl, competitorUrl, timeframe, startDate, endDate);
      setComparisonData(data);
      setUseMockData(true);
      toast.warning('Using sample data. Configure Facebook API for real data.');
    }
    
    setIsLoading(false);
  };

  const handleMonthlyReport = async (pageUrl: string, timeframe: TimeframeOption, startDate?: Date, endDate?: Date) => {
    setIsLoading(true);
    
    try {
      // Try to fetch real data from Facebook API
      const data = await fetchFacebookMonthlyReport(pageUrl, timeframe, startDate, endDate);
      setMonthlyData(data);
      setUseMockData(false);
      toast.success('Real Facebook data fetched successfully!');
    } catch (error) {
      console.error('Failed to fetch Facebook data, using mock data:', error);
      // Fall back to mock data
      const data = generateMonthlyReport(pageUrl, timeframe, startDate, endDate);
      setMonthlyData(data);
      setUseMockData(true);
      toast.warning('Using sample data. Configure Facebook API for real data.');
    }
    
    setIsLoading(false);
  };

  const handleDownloadComparisonPDF = async () => {
    if (!comparisonData) return;
    setIsPdfLoading(true);
    try {
      await generateComparisonPDF(comparisonData, 'comparison-charts');
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      toast.error('Failed to generate PDF');
    }
    setIsPdfLoading(false);
  };

  const handleDownloadMonthlyPDF = async () => {
    if (!monthlyData) return;
    setIsPdfLoading(true);
    try {
      await generateMonthlyPDF(monthlyData, 'monthly-charts');
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      toast.error('Failed to generate PDF');
    }
    setIsPdfLoading(false);
  };

  const chartData = comparisonData ? [
    { metric: 'Posts', company: comparisonData.company.metrics.totalPosts, competitor: comparisonData.competitor.metrics.totalPosts },
    { metric: 'Likes', company: comparisonData.company.metrics.likes, competitor: comparisonData.competitor.metrics.likes },
    { metric: 'Comments', company: comparisonData.company.metrics.comments, competitor: comparisonData.competitor.metrics.comments },
    { metric: 'Shares', company: comparisonData.company.metrics.shares, competitor: comparisonData.competitor.metrics.shares },
  ] : [];

  // Transform posts to enhanced format for display
  const transformToEnhancedPosts = (posts: any[]): EnhancedPost[] => {
    return posts.map((post) => ({
      id: post.id,
      date: post.date,
      content: post.content,
      postType: (post.type === 'video' ? 'video' : post.type === 'photo' ? 'photo' : 'text') as 'photo' | 'video' | 'carousel' | 'link' | 'text',
      thumbnailUrl: post.thumbnail,
      likes: post.likes,
      comments: post.comments,
      shares: post.shares,
      saves: 0,
      reach: post.likes * 10,
      impressions: post.likes * 15,
      engagementRate: post.engagementRate,
      videoViews: post.type === 'video' ? post.likes * 5 : undefined,
      avgWatchTime: post.type === 'video' ? 45 : undefined,
    }));
  };

  const enhancedCompanyPosts = comparisonData ? transformToEnhancedPosts(comparisonData.company.posts) : [];
  const enhancedMonthlyPosts = monthlyData ? transformToEnhancedPosts(monthlyData.page.posts) : [];

  return (
    <MainLayout 
      title="Analytics Dashboard" 
      subtitle="Compare social media performance or generate monthly reports"
    >
      <div className="space-y-6">
        <Tabs value={activeMode} onValueChange={(v) => setActiveMode(v as 'compare' | 'monthly')} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="compare" className="gap-2">
              <GitCompare className="h-4 w-4" />
              Compare Pages
            </TabsTrigger>
            <TabsTrigger value="monthly" className="gap-2">
              <CalendarRange className="h-4 w-4" />
              Monthly Report
            </TabsTrigger>
          </TabsList>

          <TabsContent value="compare" className="space-y-6">
            <CompareForm onCompare={handleCompare} isLoading={isLoading} />

            {comparisonData && (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      {comparisonData.company.name} vs {comparisonData.competitor.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {comparisonData.timeframe} • Generated {new Date(comparisonData.generatedAt).toLocaleString()}
                    </p>
                  </div>
                  <Button onClick={handleDownloadComparisonPDF} disabled={isPdfLoading} className="gap-2">
                    {isPdfLoading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    Download PDF
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <StatCard title="Your Posts" value={comparisonData.company.metrics.totalPosts} change={12} icon={FileText} iconColor="text-primary" />
                  <StatCard title="Your Engagement" value={`${comparisonData.company.metrics.engagementRate}%`} change={8} icon={Heart} iconColor="text-chart-competitor" />
                  <StatCard title="Your Reach" value={comparisonData.company.metrics.reach} change={15} icon={Eye} iconColor="text-accent" />
                  <StatCard title="Net Followers" value={comparisonData.company.metrics.netFollowers} change={5} icon={Users} iconColor="text-chart-success" />
                </div>

                <div id="comparison-charts" className="grid gap-6 lg:grid-cols-2">
                  <ComparisonChart data={chartData} companyName={comparisonData.company.name} competitorName={comparisonData.competitor.name} />
                  <EngagementTrend companyData={comparisonData.company.dailyData} competitorData={comparisonData.competitor.dailyData} companyName={comparisonData.company.name} competitorName={comparisonData.competitor.name} />
                </div>

                <MetricsTable companyMetrics={comparisonData.company.metrics} competitorMetrics={comparisonData.competitor.metrics} companyName={comparisonData.company.name} competitorName={comparisonData.competitor.name} />
                <TopPosts companyPosts={comparisonData.company.posts} competitorPosts={comparisonData.competitor.posts} companyName={comparisonData.company.name} competitorName={comparisonData.competitor.name} />
                
                {/* Enhanced Top Posts with thumbnails and detailed metrics */}
                <EnhancedTopPosts 
                  posts={enhancedCompanyPosts} 
                  title={`Top 15 Posts - ${comparisonData.company.name}`}
                  maxPosts={15}
                />
              </>
            )}

            {!comparisonData && !isLoading && (
              <div className="chart-container flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                  <GitCompare className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">No comparison yet</h3>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  Enter your social media page URL and a competitor's page URL above to generate a detailed analytics comparison.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="monthly" className="space-y-6">
            <MonthlyReportForm onGenerate={handleMonthlyReport} isLoading={isLoading} />

            {monthlyData && (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      {monthlyData.page.name} - Monthly Report
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {monthlyData.timeframe} • Generated {new Date(monthlyData.generatedAt).toLocaleString()}
                    </p>
                  </div>
                  <Button onClick={handleDownloadMonthlyPDF} disabled={isPdfLoading} className="gap-2">
                    {isPdfLoading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    Download PDF
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <StatCard title="Total Posts" value={monthlyData.page.metrics.totalPosts} change={12} icon={FileText} iconColor="text-primary" />
                  <StatCard title="Engagement Rate" value={`${monthlyData.page.metrics.engagementRate}%`} change={8} icon={Heart} iconColor="text-chart-competitor" />
                  <StatCard title="Total Reach" value={monthlyData.page.metrics.reach} change={15} icon={Eye} iconColor="text-accent" />
                  <StatCard title="Net Followers" value={monthlyData.page.metrics.netFollowers} change={5} icon={Users} iconColor="text-chart-success" />
                </div>

                <div id="monthly-charts" className="grid gap-6 lg:grid-cols-2">
                  <SinglePageChart data={monthlyData.page.dailyData} pageName={monthlyData.page.name} />
                  <MonthlyMetricsTable metrics={monthlyData.page.metrics} pageName={monthlyData.page.name} />
                </div>

                <SinglePagePosts posts={monthlyData.page.posts} pageName={monthlyData.page.name} />
                
                {/* Enhanced Top Posts with thumbnails and detailed metrics */}
                <EnhancedTopPosts 
                  posts={enhancedMonthlyPosts} 
                  title={`Top 15 Posts - ${monthlyData.page.name}`}
                  maxPosts={15}
                />
              </>
            )}

            {!monthlyData && !isLoading && (
              <div className="chart-container flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
                  <CalendarRange className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">No report yet</h3>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  Enter a social media page URL and select a time period to generate a comprehensive monthly analytics report.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Index;
