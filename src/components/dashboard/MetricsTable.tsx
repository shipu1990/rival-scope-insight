import { SocialMetrics } from '@/types/analytics';
import { cn } from '@/lib/utils';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface MetricsTableProps {
  companyMetrics: SocialMetrics;
  competitorMetrics: SocialMetrics;
  companyName: string;
  competitorName: string;
}

export const MetricsTable = ({
  companyMetrics,
  competitorMetrics,
  companyName,
  competitorName,
}: MetricsTableProps) => {
  const metrics = [
    { label: 'Total Posts', company: companyMetrics.totalPosts, competitor: competitorMetrics.totalPosts },
    { label: 'Total Likes', company: companyMetrics.likes, competitor: competitorMetrics.likes },
    { label: 'Comments', company: companyMetrics.comments, competitor: competitorMetrics.comments },
    { label: 'Shares', company: companyMetrics.shares, competitor: competitorMetrics.shares },
    { label: 'Reach', company: companyMetrics.reach, competitor: competitorMetrics.reach },
    { label: 'Engagement Rate', company: companyMetrics.engagementRate, competitor: competitorMetrics.engagementRate, isPercent: true },
    { label: 'Net Followers', company: companyMetrics.netFollowers, competitor: competitorMetrics.netFollowers },
  ];

  const getComparison = (company: number, competitor: number) => {
    const diff = ((company - competitor) / competitor) * 100;
    if (diff > 5) return { icon: TrendingUp, color: 'text-chart-success', label: 'Leading' };
    if (diff < -5) return { icon: TrendingDown, color: 'text-destructive', label: 'Behind' };
    return { icon: Minus, color: 'text-muted-foreground', label: 'Even' };
  };

  return (
    <div className="chart-container animate-fade-in overflow-hidden">
      <h3 className="mb-6 text-lg font-semibold text-foreground">Detailed Metrics Comparison</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-4 text-left text-sm font-semibold text-muted-foreground">Metric</th>
              <th className="pb-4 text-right text-sm font-semibold text-primary">{companyName}</th>
              <th className="pb-4 text-right text-sm font-semibold text-chart-competitor">{competitorName}</th>
              <th className="pb-4 text-center text-sm font-semibold text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric, index) => {
              const comparison = getComparison(metric.company, metric.competitor);
              const ComparisonIcon = comparison.icon;
              
              return (
                <tr 
                  key={metric.label}
                  className={cn(
                    "border-b border-border/50 transition-colors hover:bg-secondary/30",
                    index % 2 === 0 && "bg-secondary/10"
                  )}
                >
                  <td className="py-4 text-sm font-medium text-foreground">{metric.label}</td>
                  <td className="py-4 text-right text-sm font-semibold text-foreground">
                    {metric.isPercent ? `${metric.company}%` : metric.company.toLocaleString()}
                  </td>
                  <td className="py-4 text-right text-sm text-muted-foreground">
                    {metric.isPercent ? `${metric.competitor}%` : metric.competitor.toLocaleString()}
                  </td>
                  <td className="py-4">
                    <div className={cn("flex items-center justify-center gap-1", comparison.color)}>
                      <ComparisonIcon className="h-4 w-4" />
                      <span className="text-xs font-medium">{comparison.label}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
