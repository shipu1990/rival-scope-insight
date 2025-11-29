import { LucideIcon, TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  iconColor?: string;
}

export const StatCard = ({ title, value, change, icon: Icon, iconColor = 'text-primary' }: StatCardProps) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div className="stat-card group animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          
          {change !== undefined && (
            <div className={cn(
              "mt-2 flex items-center gap-1 text-sm font-medium",
              isPositive && "text-chart-success",
              isNegative && "text-destructive",
              !isPositive && !isNegative && "text-muted-foreground"
            )}>
              {isPositive && <TrendingUp className="h-4 w-4" />}
              {isNegative && <TrendingDown className="h-4 w-4" />}
              <span>{isPositive ? '+' : ''}{change}%</span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          )}
        </div>
        
        <div className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/80 transition-colors group-hover:bg-primary/20",
          iconColor
        )}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};
