import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Repeat2 } from "lucide-react";
import { ReactNode, useState } from "react";

export type Post = {
  id: string;
  author: string;
  type: "text" | "image" | "video" | "audio";
  content: string;
  caption?: string;
  poster?: string;
  engagement: number;
};

const PostCard = ({ post }: { post: Post }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 50) + 5);
  const [commentCount] = useState(Math.floor(Math.random() * 20) + 1);
  const [repostCount] = useState(Math.floor(Math.random() * 15) + 1);
  
  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };
  
  let media: ReactNode = null;
  if (post.type === "text") {
    media = <p className="text-base leading-7 font-google-body">{post.content}</p>;
  } else if (post.type === "image") {
    media = <img src={post.content} alt={`${post.author} photo post`} className="w-full rounded-md hover-glow" loading="lazy" />;
  } else if (post.type === "video") {
    media = (
      <video className="w-full rounded-md hover-glow" controls poster={post.poster} preload="metadata">
        <source src={post.content} type="video/mp4" />
      </video>
    );
  } else if (post.type === "audio") {
    media = (
      <audio className="w-full hover-glow" controls preload="metadata">
        <source src={post.content} type="audio/mpeg" />
      </audio>
    );
  }

  return (
    <Card className="glass-card hover-glow">
      <CardContent className="p-6 space-y-4">
        {/* Author and engagement header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-google-display font-bold text-primary">{post.author}</h2>
          <div className="text-xs text-muted-foreground font-google-body">Engagement: {post.engagement}</div>
        </div>
        
        {/* Media content */}
        {media}
        
        {/* Caption */}
        {post.caption && <p className="text-sm text-foreground font-google-body">{post.caption}</p>}
        
        {/* Social interaction buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-border/20">
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center gap-2 transition-all duration-300 hover:scale-105 ${
                liked ? 'text-red-500' : 'text-muted-foreground'
              }`}
            >
              <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
              <span className="font-google-body">{likeCount}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="font-google-body">{commentCount}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105"
            >
              <Repeat2 className="h-4 w-4" />
              <span className="font-google-body">{repostCount}</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
