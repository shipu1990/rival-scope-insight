import { EnhancedPost } from '@/types/socialMedia';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Eye, 
  Users, 
  Play, 
  Clock,
  Image,
  Video,
  Images,
  Link,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface EnhancedTopPostsProps {
  posts: EnhancedPost[];
  title?: string;
  maxPosts?: number;
}

const postTypeConfig: Record<EnhancedPost['postType'], { icon: React.ElementType; label: string; color: string }> = {
  photo: { icon: Image, label: 'Photo', color: 'bg-green-500/20 text-green-500' },
  video: { icon: Video, label: 'Video', color: 'bg-red-500/20 text-red-500' },
  carousel: { icon: Images, label: 'Carousel', color: 'bg-purple-500/20 text-purple-500' },
  link: { icon: Link, label: 'Link', color: 'bg-blue-500/20 text-blue-500' },
  text: { icon: FileText, label: 'Text', color: 'bg-gray-500/20 text-gray-400' },
};

export const EnhancedTopPosts = ({ posts, title = "Top Performing Posts", maxPosts = 15 }: EnhancedTopPostsProps) => {
  const displayPosts = posts.slice(0, maxPosts);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const formatWatchTime = (seconds?: number): string => {
    if (!seconds) return '—';
    if (seconds >= 60) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  return (
    <div className="chart-container animate-fade-in">
      <h3 className="mb-6 text-lg font-semibold text-foreground">{title}</h3>
      <div className="space-y-4">
        {displayPosts.map((post, index) => {
          const typeConfig = postTypeConfig[post.postType];
          const TypeIcon = typeConfig.icon;

          return (
            <div
              key={post.id}
              className="group rounded-lg border border-border/50 bg-secondary/20 p-4 transition-all hover:border-primary/30 hover:bg-secondary/40"
            >
              <div className="flex gap-4">
                {/* Rank Badge */}
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
                  {index + 1}
                </div>

                {/* Thumbnail */}
                {post.thumbnailUrl ? (
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                    <img
                      src={post.thumbnailUrl}
                      alt="Post thumbnail"
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    {post.postType === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <Play className="h-6 w-6 text-white" fill="white" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-lg bg-secondary">
                    <TypeIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className={cn("text-xs", typeConfig.color)}>
                      <TypeIcon className="mr-1 h-3 w-3" />
                      {typeConfig.label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(post.date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="mb-3 line-clamp-2 text-sm text-foreground">
                    {post.content}
                  </p>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4 lg:grid-cols-6">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Heart className="h-3.5 w-3.5 text-red-400" />
                      <span className="text-xs font-medium">{formatNumber(post.likes)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <MessageCircle className="h-3.5 w-3.5 text-blue-400" />
                      <span className="text-xs font-medium">{formatNumber(post.comments)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Share2 className="h-3.5 w-3.5 text-green-400" />
                      <span className="text-xs font-medium">{formatNumber(post.shares)}</span>
                    </div>
                    {post.saves !== undefined && (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Bookmark className="h-3.5 w-3.5 text-yellow-400" />
                        <span className="text-xs font-medium">{formatNumber(post.saves)}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Eye className="h-3.5 w-3.5 text-purple-400" />
                      <span className="text-xs font-medium">{formatNumber(post.reach)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Users className="h-3.5 w-3.5 text-cyan-400" />
                      <span className="text-xs font-medium">{post.engagementRate}%</span>
                    </div>
                  </div>

                  {/* Video-specific metrics */}
                  {post.postType === 'video' && (post.videoViews || post.avgWatchTime) && (
                    <div className="mt-2 flex items-center gap-4 border-t border-border/30 pt-2">
                      {post.videoViews && (
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Play className="h-3.5 w-3.5 text-red-400" />
                          <span className="text-xs">{formatNumber(post.videoViews)} views</span>
                        </div>
                      )}
                      {post.avgWatchTime && (
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Clock className="h-3.5 w-3.5 text-orange-400" />
                          <span className="text-xs">Avg. {formatWatchTime(post.avgWatchTime)}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
