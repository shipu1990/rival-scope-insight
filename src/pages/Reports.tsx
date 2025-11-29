import { MainLayout } from '@/components/layout/MainLayout';
import { FileText, Download, Trash2, Calendar, Building2, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockReports } from '@/lib/mockData';
import { toast } from 'sonner';

const Reports = () => {
  const handleDownload = (id: string) => {
    toast.info('PDF download will be available after connecting to Lovable Cloud');
  };

  const handleDelete = (id: string) => {
    toast.info('Report deletion will be available after connecting to Lovable Cloud');
  };

  return (
    <MainLayout title="Reports" subtitle="View and download your generated reports">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="stat-card">
            <p className="text-sm text-muted-foreground">Total Reports</p>
            <p className="mt-2 text-3xl font-bold text-foreground">{mockReports.length}</p>
          </div>
          <div className="stat-card">
            <p className="text-sm text-muted-foreground">This Month</p>
            <p className="mt-2 text-3xl font-bold text-foreground">{mockReports.length}</p>
          </div>
          <div className="stat-card">
            <p className="text-sm text-muted-foreground">Storage Used</p>
            <p className="mt-2 text-3xl font-bold text-foreground">2.4 MB</p>
          </div>
        </div>

        {/* Reports List */}
        <div className="chart-container">
          <h3 className="mb-6 text-lg font-semibold text-foreground">Saved Reports</h3>
          
          {mockReports.length > 0 ? (
            <div className="space-y-4">
              {mockReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-4 transition-all hover:border-primary/30"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">{report.companyUrl}</span>
                        <span className="text-muted-foreground">vs</span>
                        <Target className="h-4 w-4 text-chart-competitor" />
                        <span className="text-sm font-medium text-foreground">{report.competitorUrl}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {report.timeframe}
                        </span>
                        <span>
                          Generated: {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(report.id)}
                      className="text-primary hover:text-primary"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(report.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">No reports generated yet</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Reports;
