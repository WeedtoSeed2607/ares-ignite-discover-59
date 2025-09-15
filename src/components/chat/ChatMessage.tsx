import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Play, Pause, Download } from "lucide-react";
import { useState, useRef } from "react";

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'video' | 'audio';
  mediaUrl?: string;
  isFromCurrentUser: boolean;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleAudioToggle = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const renderMessageContent = () => {
    switch (message.type) {
      case 'image':
        return (
          <div className="max-w-xs">
            <img 
              src={message.mediaUrl || message.content} 
              alt="Shared image" 
              className="rounded-lg w-full object-cover"
            />
          </div>
        );
      
      case 'video':
        return (
          <div className="max-w-xs">
            <video 
              ref={videoRef}
              src={message.mediaUrl || message.content}
              controls
              className="rounded-lg w-full"
              poster={message.mediaUrl}
            />
          </div>
        );
      
      case 'audio':
        return (
          <div className="flex items-center gap-3 bg-secondary/50 rounded-lg p-3 max-w-xs">
            <button
              onClick={handleAudioToggle}
              className="flex-shrink-0 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <div className="flex-1">
              <div className="text-sm font-medium">Audio message</div>
              <div className="text-xs text-muted-foreground">Click to play</div>
            </div>
            <audio
              ref={audioRef}
              src={message.mediaUrl || message.content}
              onEnded={() => setIsPlaying(false)}
            />
          </div>
        );
      
      default:
        return (
          <div className="max-w-xs break-words">
            {message.content}
          </div>
        );
    }
  };

  return (
    <div className={`flex gap-3 ${message.isFromCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {!message.isFromCurrentUser && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={message.senderAvatar} alt={message.senderName} />
          <AvatarFallback>{message.senderName.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      )}
      
      <div className={`flex flex-col ${message.isFromCurrentUser ? 'items-end' : 'items-start'}`}>
        {!message.isFromCurrentUser && (
          <span className="text-xs text-muted-foreground mb-1">{message.senderName}</span>
        )}
        
        <div
          className={`rounded-lg px-3 py-2 ${
            message.isFromCurrentUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground'
          }`}
        >
          {renderMessageContent()}
        </div>
        
        <span className="text-xs text-muted-foreground mt-1">
          {format(message.timestamp, 'HH:mm')}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;