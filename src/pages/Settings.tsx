import { MainLayout } from '@/components/layout/MainLayout';
import { User, Bell, Shield, Database, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Settings = () => {
  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  return (
    <MainLayout title="Settings" subtitle="Manage your account and preferences">
      <div className="max-w-2xl space-y-6">
        {/* Profile Section */}
        <div className="chart-container">
          <div className="mb-6 flex items-center gap-3">
            <User className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Profile</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Full Name</label>
              <input
                type="text"
                defaultValue="John Doe"
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Email</label>
              <input
                type="email"
                defaultValue="john@company.com"
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="chart-container">
          <div className="mb-6 flex items-center gap-3">
            <Bell className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-sm text-foreground">Email notifications for new reports</span>
              <input type="checkbox" defaultChecked className="h-5 w-5 rounded accent-primary" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-foreground">Weekly summary emails</span>
              <input type="checkbox" className="h-5 w-5 rounded accent-primary" />
            </label>
          </div>
        </div>

        {/* Scheduled Reports */}
        <div className="chart-container">
          <div className="mb-6 flex items-center gap-3">
            <Calendar className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Scheduled Reports</h3>
          </div>
          
          <p className="mb-4 text-sm text-muted-foreground">
            Set up automated weekly or monthly comparison reports.
          </p>
          
          <div className="rounded-lg border border-border/50 bg-secondary/30 p-4">
            <p className="text-sm text-muted-foreground">
              Scheduled reports require Lovable Cloud integration.
            </p>
            <Button className="mt-3" variant="outline" size="sm">
              Enable Scheduling
            </Button>
          </div>
        </div>

        {/* Data & Storage */}
        <div className="chart-container">
          <div className="mb-6 flex items-center gap-3">
            <Database className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Data & Storage</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Storage Used</span>
              <span className="text-sm font-medium text-muted-foreground">2.4 MB / 100 MB</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <div className="h-full w-[2.4%] rounded-full bg-primary" />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <Button onClick={handleSave} className="btn-primary">
          Save Changes
        </Button>
      </div>
    </MainLayout>
  );
};

export default Settings;
