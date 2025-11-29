import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ComparisonData, MonthlyReportData } from '@/types/analytics';

export const generateComparisonPDF = async (
  data: ComparisonData,
  chartsContainerId: string
): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 15;
  let yPos = 20;

  // Title
  pdf.setFontSize(24);
  pdf.setTextColor(59, 130, 246);
  pdf.text('Social Media Comparison Report', margin, yPos);
  yPos += 15;

  // Subtitle
  pdf.setFontSize(12);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`${data.company.name} vs ${data.competitor.name}`, margin, yPos);
  yPos += 8;
  pdf.text(`Period: ${data.timeframe}`, margin, yPos);
  yPos += 8;
  pdf.text(`Generated: ${new Date(data.generatedAt).toLocaleString()}`, margin, yPos);
  yPos += 15;

  // Metrics Summary
  pdf.setFontSize(16);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Metrics Summary', margin, yPos);
  yPos += 10;

  // Table Header
  pdf.setFontSize(10);
  pdf.setFillColor(243, 244, 246);
  pdf.rect(margin, yPos - 5, pageWidth - margin * 2, 8, 'F');
  pdf.text('Metric', margin + 3, yPos);
  pdf.text(data.company.name, margin + 55, yPos);
  pdf.text(data.competitor.name, margin + 105, yPos);
  pdf.text('Difference', margin + 155, yPos);
  yPos += 8;

  // Table Rows
  const metrics = [
    { name: 'Total Posts', company: data.company.metrics.totalPosts, competitor: data.competitor.metrics.totalPosts },
    { name: 'Likes', company: data.company.metrics.likes, competitor: data.competitor.metrics.likes },
    { name: 'Comments', company: data.company.metrics.comments, competitor: data.competitor.metrics.comments },
    { name: 'Shares', company: data.company.metrics.shares, competitor: data.competitor.metrics.shares },
    { name: 'Reach', company: data.company.metrics.reach, competitor: data.competitor.metrics.reach },
    { name: 'Engagement Rate', company: `${data.company.metrics.engagementRate}%`, competitor: `${data.competitor.metrics.engagementRate}%` },
    { name: 'Net Followers', company: data.company.metrics.netFollowers, competitor: data.competitor.metrics.netFollowers },
  ];

  metrics.forEach((metric) => {
    const companyVal = typeof metric.company === 'string' ? parseFloat(metric.company) : metric.company;
    const competitorVal = typeof metric.competitor === 'string' ? parseFloat(metric.competitor) : metric.competitor;
    const diff = companyVal - competitorVal;
    const diffStr = diff > 0 ? `+${diff.toLocaleString()}` : diff.toLocaleString();

    pdf.text(metric.name, margin + 3, yPos);
    pdf.text(metric.company.toLocaleString(), margin + 55, yPos);
    pdf.text(metric.competitor.toLocaleString(), margin + 105, yPos);
    
    pdf.setTextColor(diff >= 0 ? 34 : 239, diff >= 0 ? 197 : 68, diff >= 0 ? 94 : 68);
    pdf.text(diffStr, margin + 155, yPos);
    pdf.setTextColor(0, 0, 0);
    
    yPos += 7;
  });

  yPos += 10;

  // Try to capture charts
  try {
    const chartsContainer = document.getElementById(chartsContainerId);
    if (chartsContainer) {
      const canvas = await html2canvas(chartsContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#1a1a2e',
      });
      
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Check if we need a new page
      if (yPos + imgHeight > pdf.internal.pageSize.getHeight() - margin) {
        pdf.addPage();
        yPos = margin;
      }
      
      pdf.addImage(imgData, 'PNG', margin, yPos, imgWidth, Math.min(imgHeight, 150));
    }
  } catch (error) {
    console.log('Charts could not be captured:', error);
  }

  // Save PDF
  pdf.save(`comparison-report-${data.company.name}-vs-${data.competitor.name}-${new Date().toISOString().split('T')[0]}.pdf`);
};

export const generateMonthlyPDF = async (
  data: MonthlyReportData,
  chartsContainerId: string
): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 15;
  let yPos = 20;

  // Title
  pdf.setFontSize(24);
  pdf.setTextColor(139, 92, 246);
  pdf.text('Monthly Analytics Report', margin, yPos);
  yPos += 15;

  // Subtitle
  pdf.setFontSize(12);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Page: ${data.page.name}`, margin, yPos);
  yPos += 8;
  pdf.text(`Period: ${data.timeframe}`, margin, yPos);
  yPos += 8;
  pdf.text(`Generated: ${new Date(data.generatedAt).toLocaleString()}`, margin, yPos);
  yPos += 15;

  // Metrics Summary
  pdf.setFontSize(16);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Performance Metrics', margin, yPos);
  yPos += 10;

  // Metrics Grid
  const metricsGrid = [
    ['Total Posts', data.page.metrics.totalPosts.toLocaleString()],
    ['Total Likes', data.page.metrics.likes.toLocaleString()],
    ['Total Comments', data.page.metrics.comments.toLocaleString()],
    ['Total Shares', data.page.metrics.shares.toLocaleString()],
    ['Total Reach', data.page.metrics.reach.toLocaleString()],
    ['Engagement Rate', `${data.page.metrics.engagementRate}%`],
    ['Followers Gained', `+${data.page.metrics.followersGained.toLocaleString()}`],
    ['Followers Lost', `-${data.page.metrics.followersLost.toLocaleString()}`],
    ['Net Followers', data.page.metrics.netFollowers.toLocaleString()],
  ];

  pdf.setFontSize(10);
  metricsGrid.forEach(([label, value], index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    const x = margin + col * 60;
    const y = yPos + row * 12;
    
    pdf.setTextColor(100, 100, 100);
    pdf.text(label, x, y);
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(12);
    pdf.text(value, x, y + 5);
    pdf.setFontSize(10);
  });

  yPos += 45;

  // Top Posts
  pdf.setFontSize(16);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Top Performing Posts', margin, yPos);
  yPos += 10;

  pdf.setFontSize(9);
  data.page.posts.slice(0, 5).forEach((post, index) => {
    pdf.setTextColor(100, 100, 100);
    pdf.text(`${index + 1}. ${post.content.slice(0, 50)}...`, margin, yPos);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Likes: ${post.likes.toLocaleString()} | Comments: ${post.comments} | Shares: ${post.shares}`, margin + 5, yPos + 5);
    yPos += 12;
  });

  yPos += 10;

  // Try to capture charts
  try {
    const chartsContainer = document.getElementById(chartsContainerId);
    if (chartsContainer) {
      const canvas = await html2canvas(chartsContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#1a1a2e',
      });
      
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Check if we need a new page
      if (yPos + imgHeight > pdf.internal.pageSize.getHeight() - margin) {
        pdf.addPage();
        yPos = margin;
      }
      
      pdf.addImage(imgData, 'PNG', margin, yPos, imgWidth, Math.min(imgHeight, 150));
    }
  } catch (error) {
    console.log('Charts could not be captured:', error);
  }

  // Save PDF
  pdf.save(`monthly-report-${data.page.name}-${new Date().toISOString().split('T')[0]}.pdf`);
};
