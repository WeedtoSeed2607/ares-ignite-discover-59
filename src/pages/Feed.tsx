import AppLayout from "@/components/layout/AppLayout";
import Seo from "@/components/common/Seo";
import ChatList, { ChatPreview } from "@/components/chat/ChatList";
import ChatWindow from "@/components/chat/ChatWindow";
import { Message } from "@/components/chat/ChatMessage";
import { useState, useMemo } from "react";
import samplePhoto from "@/assets/sample-photo-1.jpg";

// Mock chat data based on creators from the original posts
const mockChats: ChatPreview[] = [
  {
    creatorName: "NovaBytes",
    lastMessage: "Check out this new service worker tutorial!",
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    unreadCount: 2,
    avatar: samplePhoto,
    isOnline: true,
  },
  {
    creatorName: "RedLens",
    lastMessage: "Just uploaded a new neon photography piece 📸",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    unreadCount: 0,
    avatar: samplePhoto,
    isOnline: false,
  },
  {
    creatorName: "KitchenLab",
    lastMessage: "🔥 Perfect steak timing tip coming up!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    unreadCount: 1,
    avatar: samplePhoto,
    isOnline: true,
  },
];

// Mock messages for each creator
const mockMessages: Record<string, Message[]> = {
  NovaBytes: [
    {
      id: "1",
      senderId: "novabytes",
      senderName: "NovaBytes",
      senderAvatar: samplePhoto,
      content: "Hey everyone! Welcome to my creator chat 👋",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      type: "text",
      isFromCurrentUser: false,
    },
    {
      id: "2",
      senderId: "novabytes",
      senderName: "NovaBytes",
      senderAvatar: samplePhoto,
      content: "/media/sample-video.mp4",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      type: "video",
      mediaUrl: samplePhoto,
      isFromCurrentUser: false,
    },
    {
      id: "3",
      senderId: "novabytes",
      senderName: "NovaBytes",
      senderAvatar: samplePhoto,
      content: "Check out this new service worker tutorial!",
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      type: "text",
      isFromCurrentUser: false,
    },
  ],
  RedLens: [
    {
      id: "4",
      senderId: "redlens",
      senderName: "RedLens",
      senderAvatar: samplePhoto,
      content: "Welcome to my photography group! 📸",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
      type: "text",
      isFromCurrentUser: false,
    },
    {
      id: "5",
      senderId: "redlens",
      senderName: "RedLens",
      senderAvatar: samplePhoto,
      content: samplePhoto,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      type: "image",
      isFromCurrentUser: false,
    },
    {
      id: "6",
      senderId: "redlens",
      senderName: "RedLens",
      senderAvatar: samplePhoto,
      content: "Just uploaded a new neon photography piece 📸",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      type: "text",
      isFromCurrentUser: false,
    },
  ],
  KitchenLab: [
    {
      id: "7",
      senderId: "kitchenlab",
      senderName: "KitchenLab",
      senderAvatar: samplePhoto,
      content: "Welcome to Kitchen Lab! Ready to cook? 👨‍🍳",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
      type: "text",
      isFromCurrentUser: false,
    },
    {
      id: "8",
      senderId: "kitchenlab",
      senderName: "KitchenLab",
      senderAvatar: samplePhoto,
      content: "/media/sample-audio.mp3",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      type: "audio",
      isFromCurrentUser: false,
    },
    {
      id: "9",
      senderId: "kitchenlab",
      senderName: "KitchenLab",
      senderAvatar: samplePhoto,
      content: "🔥 Perfect steak timing tip coming up!",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      type: "text",
      isFromCurrentUser: false,
    },
  ],
};

const Feed = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState(mockMessages);

  // Filter chats based on subscriptions
  const subs: string[] = JSON.parse(localStorage.getItem("ares_subs") || "[]");
  const filteredChats = useMemo(() => {
    return subs.length === 0 ? mockChats : mockChats.filter(chat => subs.includes(chat.creatorName));
  }, [subs]);

  const handleChatSelect = (creatorName: string) => {
    setSelectedChat(creatorName);
  };

  const handleSendMessage = (content: string) => {
    if (!selectedChat) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: "current-user",
      senderName: "You",
      senderAvatar: samplePhoto,
      content,
      timestamp: new Date(),
      type: "text",
      isFromCurrentUser: true,
    };

    setMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMessage]
    }));
  };

  const selectedChatData = filteredChats.find(chat => chat.creatorName === selectedChat);

  return (
    <AppLayout>
      <Seo 
        title="Chat | Ares" 
        description="Chat with your subscribed creators in a WhatsApp-style interface." 
        canonical={window.location.href} 
      />
      
      <div className="flex h-[calc(100vh-4rem)] md:h-screen">
        {/* Chat List - Hidden on mobile when chat is selected */}
        <div className={`w-full md:w-1/3 lg:w-1/4 border-r border-border ${selectedChat ? 'hidden md:block' : 'block'}`}>
          <ChatList 
            chats={filteredChats}
            onChatSelect={handleChatSelect}
            selectedChat={selectedChat || undefined}
          />
        </div>

        {/* Chat Window - Show when chat is selected */}
        <div className={`flex-1 ${selectedChat ? 'block' : 'hidden md:block'}`}>
          {selectedChat && selectedChatData ? (
            <ChatWindow
              creatorName={selectedChat}
              creatorAvatar={selectedChatData.avatar}
              messages={messages[selectedChat] || []}
              onSendMessage={handleSendMessage}
              onBack={() => setSelectedChat(null)}
              isOnline={selectedChatData.isOnline}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-muted/20">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Select a chat to start messaging</h3>
                <p className="text-muted-foreground">
                  {filteredChats.length === 0 
                    ? "Subscribe to creators in Discovery to chat with them here."
                    : "Choose a creator from the list to start a conversation."
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Feed;
