import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import samplePhoto from "@/assets/sample-photo-1.jpg";

export interface ChatPreview {
  creatorName: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  avatar: string;
  isOnline: boolean;
}

interface ChatListProps {
  chats: ChatPreview[];
  onChatSelect: (creatorName: string) => void;
  selectedChat?: string;
}

const ChatList = ({ chats, onChatSelect, selectedChat }: ChatListProps) => {
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-lg">Chats</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.creatorName}
            onClick={() => onChatSelect(chat.creatorName)}
            className={`flex items-center gap-3 p-4 hover:bg-accent/50 cursor-pointer transition-colors border-b border-border/50 ${
              selectedChat === chat.creatorName ? 'bg-accent' : ''
            }`}
          >
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={chat.avatar} alt={chat.creatorName} />
                <AvatarFallback>{chat.creatorName.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              {chat.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-sm truncate">{chat.creatorName}</h3>
                <span className="text-xs text-muted-foreground flex-shrink-0">
                  {formatDistanceToNow(chat.timestamp, { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
            </div>
            
            {chat.unreadCount > 0 && (
              <Badge variant="default" className="ml-2 h-5 min-w-[20px] flex items-center justify-center text-xs">
                {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
              </Badge>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;