import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DailyMetric } from '@/types/analytics';

interface SinglePageChartProps {
  data: DailyMetric[];
  pageName: string;
}

export const SinglePageChart = ({ data, pageName }: SinglePageChartProps) => {
  return (
    <div className="chart-container">
      <h3 className="mb-4 text-lg font-semibold text-foreground">
        {pageName} - Activity Timeline
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="date" 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--foreground))',
            }}
          />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="engagement" 
            stroke="hsl(var(--primary))" 
            fillOpacity={1} 
            fill="url(#colorEngagement)" 
            name="Engagement"
          />
          <Area 
            type="monotone" 
            dataKey="posts" 
            stroke="hsl(var(--accent))" 
            fillOpacity={0.5} 
            fill="url(#colorReach)" 
            name="Posts"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
