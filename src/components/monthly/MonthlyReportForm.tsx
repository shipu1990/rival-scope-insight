import { useState } from 'react';
import { Building2, Calendar, FileText, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TimeframeOption } from '@/types/analytics';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface MonthlyReportFormProps {
  onGenerate: (pageUrl: string, timeframe: TimeframeOption, startDate?: Date, endDate?: Date) => void;
  isLoading?: boolean;
}

const monthlyTimeframeOptions: { value: TimeframeOption; label: string }[] = [
  { value: 'previous_month', label: 'Last Month' },
  { value: 'previous_2_months', label: 'Last 2 Months' },
  { value: 'previous_quarter', label: 'Last Quarter' },
  { value: 'custom', label: 'Custom Range' },
];

export const MonthlyReportForm = ({ onGenerate, isLoading }: MonthlyReportFormProps) => {
  const [pageUrl, setPageUrl] = useState('');
  const [timeframe, setTimeframe] = useState<TimeframeOption>('previous_month');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pageUrl) {
      onGenerate(pageUrl, timeframe, startDate, endDate);
    }
  };

  return (
    <div className="chart-container animate-fade-in">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
          <FileText className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Generate Monthly Report</h2>
          <p className="text-sm text-muted-foreground">Analyze a single page's performance over time</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Page URL */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
            <Building2 className="h-4 w-4 text-primary" />
            Social Media Page URL
          </label>
          <input
            type="text"
            value={pageUrl}
            onChange={(e) => setPageUrl(e.target.value)}
            placeholder="e.g., facebook.com/yourcompany"
            className="input-field"
            required
          />
        </div>

        {/* Timeframe Selection */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
            <Calendar className="h-4 w-4 text-accent" />
            Report Period
          </label>
          <div className="flex flex-wrap gap-2">
            {monthlyTimeframeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setTimeframe(option.value)}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-all ${
                  timeframe === option.value
                    ? 'border-accent bg-accent/20 text-accent'
                    : 'border-border bg-secondary/50 text-muted-foreground hover:border-accent/50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Date Range */}
        {timeframe === 'custom' && (
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Start Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Select start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">End Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Select end date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!pageUrl || isLoading || (timeframe === 'custom' && (!startDate || !endDate))}
          className="btn-primary w-full md:w-auto"
        >
          {isLoading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              Generating...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </>
          )}
        </Button>
      </form>
    </div>
  );
};
