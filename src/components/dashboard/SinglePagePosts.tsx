import { PostData } from '@/types/analytics';
import { Heart, MessageCircle, Share2, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

interface SinglePagePostsProps {
  posts: PostData[];
  pageName: string;
}

export const SinglePagePosts = ({ posts, pageName }: SinglePagePostsProps) => {
  return (
    <div className="chart-container">
      <h3 className="mb-4 text-lg font-semibold text-foreground">
        {pageName} - Top Performing Posts
      </h3>
      <div className="space-y-4">
        {posts.slice(0, 5).map((post, index) => (
          <div
            key={post.id}
            className="rounded-lg border border-border/50 bg-secondary/30 p-4 transition-all hover:border-primary/30"
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                {index + 1}
              </span>
              <span className="text-xs text-muted-foreground">
                {format(new Date(post.date), 'MMM d, yyyy')}
              </span>
            </div>
            <p className="mb-3 text-sm text-foreground">{post.content}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-chart-competitor">
                <Heart className="h-4 w-4" />
                {post.likes.toLocaleString()}
              </span>
              <span className="flex items-center gap-1 text-primary">
                <MessageCircle className="h-4 w-4" />
                {post.comments.toLocaleString()}
              </span>
              <span className="flex items-center gap-1 text-accent">
                <Share2 className="h-4 w-4" />
                {post.shares.toLocaleString()}
              </span>
              <span className="flex items-center gap-1 text-chart-success">
                <TrendingUp className="h-4 w-4" />
                {post.engagementRate}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
