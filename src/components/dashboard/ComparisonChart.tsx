import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ComparisonChartProps {
  data: {
    metric: string;
    company: number;
    competitor: number;
  }[];
  companyName: string;
  competitorName: string;
}

export const ComparisonChart = ({ data, companyName, competitorName }: ComparisonChartProps) => {
  return (
    <div className="chart-container animate-fade-in">
      <h3 className="mb-6 text-lg font-semibold text-foreground">Metrics Comparison</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="metric" 
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
            <Bar 
              dataKey="company" 
              name={companyName}
              fill="hsl(var(--chart-company))" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="competitor" 
              name={competitorName}
              fill="hsl(var(--chart-competitor))" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
