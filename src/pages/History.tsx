import { MainLayout } from '@/components/layout/MainLayout';
import { Clock, BarChart3, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const activityLog = [
  { id: 1, action: 'Generated comparison report', details: 'mycompany vs competitor', time: '2 hours ago' },
  { id: 2, action: 'Downloaded PDF report', details: 'Last 30 days analysis', time: '5 hours ago' },
  { id: 3, action: 'Generated comparison report', details: 'instagram analysis', time: '1 day ago' },
  { id: 4, action: 'Account created', details: 'Welcome to SocialPulse', time: '3 days ago' },
];

const History = () => {
  const navigate = useNavigate();

  return (
    <MainLayout title="Activity History" subtitle="Track your recent actions and comparisons">
      <div className="space-y-6">
        {/* Activity Timeline */}
        <div className="chart-container">
          <h3 className="mb-6 text-lg font-semibold text-foreground">Recent Activity</h3>
          
          <div className="space-y-4">
            {activityLog.map((item, index) => (
              <div
                key={item.id}
                className="relative flex gap-4 pb-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Timeline line */}
                {index < activityLog.length - 1 && (
                  <div className="absolute left-5 top-10 h-full w-px bg-border" />
                )}
                
                {/* Icon */}
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                
                {/* Content */}
                <div className="flex-1 rounded-lg border border-border/50 bg-secondary/30 p-4">
                  <p className="font-medium text-foreground">{item.action}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.details}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="chart-container">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => navigate('/')} className="gap-2">
              <BarChart3 className="h-4 w-4" />
              New Comparison
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => navigate('/reports')} className="gap-2">
              View All Reports
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default History;
