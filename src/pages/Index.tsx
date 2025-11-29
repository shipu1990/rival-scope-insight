import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { CompareForm } from '@/components/compare/CompareForm';
import { StatCard } from '@/components/dashboard/StatCard';
import { ComparisonChart } from '@/components/dashboard/ComparisonChart';
import { EngagementTrend } from '@/components/dashboard/EngagementTrend';
import { MetricsTable } from '@/components/dashboard/MetricsTable';
import { TopPosts } from '@/components/dashboard/TopPosts';
import { generateMockComparison } from '@/lib/mockData';
import { ComparisonData, TimeframeOption } from '@/types/analytics';
import { BarChart3, Heart, MessageCircle, Share2, Users, Eye, TrendingUp, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Index = () => {
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCompare = async (companyUrl: string, competitorUrl: string, timeframe: TimeframeOption) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const data = generateMockComparison(companyUrl, competitorUrl, timeframe);
    setComparisonData(data);
    setIsLoading(false);
    
    toast.success('Comparison generated successfully!');
  };

  const handleDownloadPDF = () => {
    toast.info('PDF generation will be available after connecting to Lovable Cloud');
  };

  const chartData = comparisonData ? [
    { metric: 'Posts', company: comparisonData.company.metrics.totalPosts, competitor: comparisonData.competitor.metrics.totalPosts },
    { metric: 'Likes', company: comparisonData.company.metrics.likes, competitor: comparisonData.competitor.metrics.likes },
    { metric: 'Comments', company: comparisonData.company.metrics.comments, competitor: comparisonData.competitor.metrics.comments },
    { metric: 'Shares', company: comparisonData.company.metrics.shares, competitor: comparisonData.competitor.metrics.shares },
  ] : [];

  return (
    <MainLayout 
      title="Analytics Dashboard" 
      subtitle="Compare your social media performance against competitors"
    >
      <div className="space-y-6">
        {/* Compare Form */}
        <CompareForm onCompare={handleCompare} isLoading={isLoading} />

        {/* Results Section */}
        {comparisonData && (
          <>
            {/* Header with Download */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {comparisonData.company.name} vs {comparisonData.competitor.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {comparisonData.timeframe} • Generated {new Date(comparisonData.generatedAt).toLocaleString()}
                </p>
              </div>
              <Button onClick={handleDownloadPDF} className="gap-2">
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Your Posts"
                value={comparisonData.company.metrics.totalPosts}
                change={12}
                icon={FileText}
                iconColor="text-primary"
              />
              <StatCard
                title="Your Engagement"
                value={`${comparisonData.company.metrics.engagementRate}%`}
                change={8}
                icon={Heart}
                iconColor="text-chart-competitor"
              />
              <StatCard
                title="Your Reach"
                value={comparisonData.company.metrics.reach}
                change={15}
                icon={Eye}
                iconColor="text-accent"
              />
              <StatCard
                title="Net Followers"
                value={comparisonData.company.metrics.netFollowers}
                change={5}
                icon={Users}
                iconColor="text-chart-success"
              />
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-2">
              <ComparisonChart
                data={chartData}
                companyName={comparisonData.company.name}
                competitorName={comparisonData.competitor.name}
              />
              <EngagementTrend
                companyData={comparisonData.company.dailyData}
                competitorData={comparisonData.competitor.dailyData}
                companyName={comparisonData.company.name}
                competitorName={comparisonData.competitor.name}
              />
            </div>

            {/* Detailed Metrics Table */}
            <MetricsTable
              companyMetrics={comparisonData.company.metrics}
              competitorMetrics={comparisonData.competitor.metrics}
              companyName={comparisonData.company.name}
              competitorName={comparisonData.competitor.name}
            />

            {/* Top Posts */}
            <TopPosts
              companyPosts={comparisonData.company.posts}
              competitorPosts={comparisonData.competitor.posts}
              companyName={comparisonData.company.name}
              competitorName={comparisonData.competitor.name}
            />
          </>
        )}

        {/* Empty State */}
        {!comparisonData && !isLoading && (
          <div className="chart-container flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No comparison yet</h3>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Enter your social media page URL and a competitor's page URL above to generate a detailed analytics comparison.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Index;
