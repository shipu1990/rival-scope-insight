import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DailyMetric } from '@/types/analytics';

interface EngagementTrendProps {
  companyData: DailyMetric[];
  competitorData: DailyMetric[];
  companyName: string;
  competitorName: string;
}

export const EngagementTrend = ({ 
  companyData, 
  competitorData, 
  companyName, 
  competitorName 
}: EngagementTrendProps) => {
  const mergedData = companyData.map((item, index) => ({
    date: item.date,
    company: item.engagement,
    competitor: competitorData[index]?.engagement || 0,
  }));

  return (
    <div className="chart-container animate-fade-in">
      <h3 className="mb-6 text-lg font-semibold text-foreground">Engagement Over Time</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={mergedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))',
              }}
              formatter={(value: number) => value.toLocaleString()}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="company"
              name={companyName}
              stroke="hsl(var(--chart-company))"
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--chart-company))', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="competitor"
              name={competitorName}
              stroke="hsl(var(--chart-competitor))"
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--chart-competitor))', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
