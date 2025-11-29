import { useState } from 'react';
import { Building2, Target, Calendar, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TimeframeOption } from '@/types/analytics';

interface CompareFormProps {
  onCompare: (companyUrl: string, competitorUrl: string, timeframe: TimeframeOption) => void;
  isLoading?: boolean;
}

export const CompareForm = ({ onCompare, isLoading }: CompareFormProps) => {
  const [companyUrl, setCompanyUrl] = useState('');
  const [competitorUrl, setCompetitorUrl] = useState('');
  const [timeframe, setTimeframe] = useState<TimeframeOption>('30days');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (companyUrl && competitorUrl) {
      onCompare(companyUrl, competitorUrl, timeframe);
    }
  };

  return (
    <div className="chart-container animate-fade-in">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Compare Social Pages</h2>
          <p className="text-sm text-muted-foreground">Enter your page and a competitor's page to analyze</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Company URL */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
              <Building2 className="h-4 w-4 text-primary" />
              Your Page URL
            </label>
            <input
              type="text"
              value={companyUrl}
              onChange={(e) => setCompanyUrl(e.target.value)}
              placeholder="e.g., facebook.com/yourcompany"
              className="input-field"
              required
            />
          </div>

          {/* Competitor URL */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
              <Target className="h-4 w-4 text-chart-competitor" />
              Competitor Page URL
            </label>
            <input
              type="text"
              value={competitorUrl}
              onChange={(e) => setCompetitorUrl(e.target.value)}
              placeholder="e.g., facebook.com/competitor"
              className="input-field"
              required
            />
          </div>
        </div>

        {/* Timeframe Selection */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
            <Calendar className="h-4 w-4 text-accent" />
            Timeframe
          </label>
          <div className="flex flex-wrap gap-3">
            {[
              { value: '7days', label: 'Last 7 Days' },
              { value: '30days', label: 'Last 30 Days' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setTimeframe(option.value as TimeframeOption)}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                  timeframe === option.value
                    ? 'border-primary bg-primary/20 text-primary'
                    : 'border-border bg-secondary/50 text-muted-foreground hover:border-primary/50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!companyUrl || !competitorUrl || isLoading}
          className="btn-primary w-full md:w-auto"
        >
          {isLoading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Comparison
            </>
          )}
        </Button>
      </form>
    </div>
  );
};
