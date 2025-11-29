import { SocialMetrics } from '@/types/analytics';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface MonthlyMetricsTableProps {
  metrics: SocialMetrics;
  pageName: string;
}

export const MonthlyMetricsTable = ({ metrics, pageName }: MonthlyMetricsTableProps) => {
  const metricsData = [
    { metric: 'Total Posts', value: metrics.totalPosts },
    { metric: 'Total Likes', value: metrics.likes },
    { metric: 'Total Comments', value: metrics.comments },
    { metric: 'Total Shares', value: metrics.shares },
    { metric: 'Total Reach', value: metrics.reach },
    { metric: 'Engagement Rate', value: `${metrics.engagementRate}%` },
    { metric: 'Followers Gained', value: `+${metrics.followersGained}` },
    { metric: 'Followers Lost', value: `-${metrics.followersLost}` },
    { metric: 'Net Followers', value: metrics.netFollowers },
  ];

  return (
    <div className="chart-container">
      <h3 className="mb-4 text-lg font-semibold text-foreground">
        {pageName} - Performance Metrics
      </h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Metric</TableHead>
            <TableHead className="text-right">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {metricsData.map((row) => (
            <TableRow key={row.metric}>
              <TableCell className="font-medium">{row.metric}</TableCell>
              <TableCell className="text-right font-semibold text-foreground">
                {typeof row.value === 'number' ? row.value.toLocaleString() : row.value}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
