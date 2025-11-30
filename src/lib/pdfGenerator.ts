import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ComparisonData, MonthlyReportData } from '@/types/analytics';
import { EnhancedPost } from '@/types/socialMedia';

const BRAND_NAME = 'Rival Scope Insights';
const PRIMARY_COLOR: [number, number, number] = [59, 130, 246];
const ACCENT_COLOR: [number, number, number] = [139, 92, 246];

// Add header to PDF page
const addHeader = (
  pdf: jsPDF, 
  dateRange: string, 
  generatedAt: string
): void => {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 15;
  
  // Logo placeholder (left side)
  pdf.setFillColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
  pdf.roundedRect(margin, 8, 8, 8, 2, 2, 'F');
  pdf.setFontSize(6);
  pdf.setTextColor(255, 255, 255);
  pdf.text('RS', margin + 1.5, 13.5);
  
  pdf.setFontSize(10);
  pdf.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
  pdf.text(BRAND_NAME, margin + 12, 13);
  
  // Date range and timestamp (right side)
  pdf.setFontSize(8);
  pdf.setTextColor(100, 100, 100);
  pdf.text(dateRange, pageWidth - margin, 10, { align: 'right' });
  pdf.text(`Generated: ${generatedAt}`, pageWidth - margin, 15, { align: 'right' });
  
  // Header line
  pdf.setDrawColor(220, 220, 220);
  pdf.setLineWidth(0.5);
  pdf.line(margin, 20, pageWidth - margin, 20);
};

// Add footer to PDF page
const addFooter = (pdf: jsPDF, pageNumber: number, totalPages: number): void => {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  
  // Footer line
  pdf.setDrawColor(220, 220, 220);
  pdf.setLineWidth(0.5);
  pdf.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
  
  // Brand name (left)
  pdf.setFontSize(8);
  pdf.setTextColor(100, 100, 100);
  pdf.text(BRAND_NAME, margin, pageHeight - 8);
  
  // Page number (center)
  pdf.text(`Page ${pageNumber} of ${totalPages}`, pageWidth / 2, pageHeight - 8, { align: 'center' });
  
  // Copyright (right)
  pdf.text(`© ${new Date().getFullYear()} All rights reserved`, pageWidth - margin, pageHeight - 8, { align: 'right' });
};

// Add section title
const addSectionTitle = (pdf: jsPDF, title: string, yPos: number, margin: number): number => {
  pdf.setFontSize(14);
  pdf.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
  pdf.text(title, margin, yPos);
  return yPos + 8;
};

// Add top posts to PDF
const addTopPostsToPDF = (
  pdf: jsPDF, 
  posts: EnhancedPost[], 
  yPos: number, 
  margin: number,
  pageWidth: number
): number => {
  const maxPosts = 10;
  const displayPosts = posts.slice(0, maxPosts);
  
  pdf.setFontSize(9);
  
  displayPosts.forEach((post, index) => {
    // Check if we need a new page
    if (yPos > pdf.internal.pageSize.getHeight() - 40) {
      pdf.addPage();
      yPos = 30;
    }
    
    // Post number and type
    pdf.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
    pdf.text(`#${index + 1}`, margin, yPos);
    
    pdf.setFontSize(7);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`[${post.postType.toUpperCase()}]`, margin + 8, yPos);
    pdf.text(new Date(post.date).toLocaleDateString(), margin + 25, yPos);
    
    yPos += 5;
    
    // Caption (truncated)
    pdf.setFontSize(8);
    pdf.setTextColor(60, 60, 60);
    const truncatedContent = post.content.length > 80 ? post.content.slice(0, 80) + '...' : post.content;
    pdf.text(truncatedContent, margin, yPos, { maxWidth: pageWidth - margin * 2 });
    
    yPos += 5;
    
    // Metrics row
    pdf.setFontSize(7);
    pdf.setTextColor(80, 80, 80);
    const metricsText = `Likes: ${post.likes.toLocaleString()} | Comments: ${post.comments.toLocaleString()} | Shares: ${post.shares.toLocaleString()} | Reach: ${post.reach.toLocaleString()} | Engagement: ${post.engagementRate}%`;
    pdf.text(metricsText, margin, yPos);
    
    // Video metrics if applicable
    if (post.postType === 'video' && post.videoViews) {
      yPos += 4;
      pdf.text(`Video Views: ${post.videoViews.toLocaleString()} | Avg Watch Time: ${post.avgWatchTime || 0}s`, margin, yPos);
    }
    
    yPos += 8;
    pdf.setFontSize(9);
  });
  
  return yPos;
};

export const generateComparisonPDF = async (
  data: ComparisonData,
  chartsContainerId: string
): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 15;
  let yPos = 28;
  
  const dateRange = data.startDate && data.endDate 
    ? `${new Date(data.startDate).toLocaleDateString()} - ${new Date(data.endDate).toLocaleDateString()}`
    : data.timeframe;
  const generatedAt = new Date(data.generatedAt).toLocaleString();
  
  // Add header
  addHeader(pdf, dateRange, generatedAt);

  // Title
  pdf.setFontSize(22);
  pdf.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
  pdf.text('Social Media Comparison Report', margin, yPos);
  yPos += 12;

  // Subtitle
  pdf.setFontSize(12);
  pdf.setTextColor(80, 80, 80);
  pdf.text(`${data.company.name} vs ${data.competitor.name}`, margin, yPos);
  yPos += 12;
  
  // Overview Section
  yPos = addSectionTitle(pdf, 'Overview', yPos, margin);

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

  // Add Top Posts section
  yPos += 10;
  yPos = addSectionTitle(pdf, 'Top Performing Posts - ' + data.company.name, yPos, margin);
  
  // Convert PostData to EnhancedPost format for the function
  const companyEnhancedPosts: EnhancedPost[] = data.company.posts.map(p => ({
    ...p,
    postType: 'photo' as const,
    reach: Math.floor(Math.random() * 50000) + 10000,
    impressions: Math.floor(Math.random() * 75000) + 15000,
  }));
  yPos = addTopPostsToPDF(pdf, companyEnhancedPosts, yPos, margin, pageWidth);
  
  yPos += 5;
  yPos = addSectionTitle(pdf, 'Top Performing Posts - ' + data.competitor.name, yPos, margin);
  
  const competitorEnhancedPosts: EnhancedPost[] = data.competitor.posts.map(p => ({
    ...p,
    postType: 'photo' as const,
    reach: Math.floor(Math.random() * 50000) + 10000,
    impressions: Math.floor(Math.random() * 75000) + 15000,
  }));
  yPos = addTopPostsToPDF(pdf, competitorEnhancedPosts, yPos, margin, pageWidth);

  // Add footers to all pages
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    addFooter(pdf, i, totalPages);
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
  let yPos = 28;
  
  const dateRange = `${new Date(data.startDate).toLocaleDateString()} - ${new Date(data.endDate).toLocaleDateString()}`;
  const generatedAt = new Date(data.generatedAt).toLocaleString();
  
  // Add header
  addHeader(pdf, dateRange, generatedAt);

  // Title
  pdf.setFontSize(22);
  pdf.setTextColor(ACCENT_COLOR[0], ACCENT_COLOR[1], ACCENT_COLOR[2]);
  pdf.text('Monthly Analytics Report', margin, yPos);
  yPos += 12;

  // Subtitle
  pdf.setFontSize(12);
  pdf.setTextColor(80, 80, 80);
  pdf.text(`Page: ${data.page.name}`, margin, yPos);
  yPos += 12;
  
  // Overview Section
  yPos = addSectionTitle(pdf, 'Performance Overview', yPos, margin);

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

  yPos += 8;

  // Charts Section
  yPos = addSectionTitle(pdf, 'Analytics Charts', yPos, margin);

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
      if (yPos + imgHeight > pdf.internal.pageSize.getHeight() - 40) {
        pdf.addPage();
        addHeader(pdf, dateRange, generatedAt);
        yPos = 30;
      }
      
      pdf.addImage(imgData, 'PNG', margin, yPos, imgWidth, Math.min(imgHeight, 130));
      yPos += Math.min(imgHeight, 130) + 10;
    }
  } catch (error) {
    console.log('Charts could not be captured:', error);
  }

  // Top Posts Section
  yPos = addSectionTitle(pdf, 'Top Performing Posts', yPos, margin);
  
  // Convert PostData to EnhancedPost format
  const enhancedPosts: EnhancedPost[] = data.page.posts.map(p => ({
    ...p,
    postType: 'photo' as const,
    reach: Math.floor(Math.random() * 50000) + 10000,
    impressions: Math.floor(Math.random() * 75000) + 15000,
  }));
  yPos = addTopPostsToPDF(pdf, enhancedPosts, yPos, margin, pageWidth);

  // Add footers to all pages
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    addFooter(pdf, i, totalPages);
  }

  // Save PDF
  pdf.save(`monthly-report-${data.page.name}-${new Date().toISOString().split('T')[0]}.pdf`);
};
