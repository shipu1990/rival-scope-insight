import { PostData } from '@/types/analytics';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopPostsProps {
  companyPosts: PostData[];
  competitorPosts: PostData[];
  companyName: string;
  competitorName: string;
}

export const TopPosts = ({ companyPosts, competitorPosts, companyName, competitorName }: TopPostsProps) => {
  const PostCard = ({ post, isCompany }: { post: PostData; isCompany: boolean }) => (
    <div className={cn(
      "rounded-lg border p-4 transition-all hover:border-primary/30",
      isCompany ? "border-primary/20 bg-primary/5" : "border-chart-competitor/20 bg-chart-competitor/5"
    )}>
      <p className="line-clamp-2 text-sm text-foreground">{post.content}</p>
      <div className="mt-3 flex items-center gap-4 text-muted-foreground">
        <div className="flex items-center gap-1">
          <Heart className="h-4 w-4" />
          <span className="text-xs">{post.likes.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle className="h-4 w-4" />
          <span className="text-xs">{post.comments.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <Share2 className="h-4 w-4" />
          <span className="text-xs">{post.shares.toLocaleString()}</span>
        </div>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {new Date(post.date).toLocaleDateString()}
      </p>
    </div>
  );

  return (
    <div className="chart-container animate-fade-in">
      <h3 className="mb-6 text-lg font-semibold text-foreground">Top Performing Posts</h3>
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h4 className="mb-4 text-sm font-semibold text-primary">{companyName}</h4>
          <div className="space-y-3">
            {companyPosts.slice(0, 3).map((post) => (
              <PostCard key={post.id} post={post} isCompany />
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold text-chart-competitor">{competitorName}</h4>
          <div className="space-y-3">
            {competitorPosts.slice(0, 3).map((post) => (
              <PostCard key={post.id} post={post} isCompany={false} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
