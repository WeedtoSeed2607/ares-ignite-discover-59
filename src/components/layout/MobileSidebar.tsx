import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Home, Compass, MessageSquare, Users, Twitter, Instagram, Github, ChevronDown, ChevronRight, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface MobileSidebarProps {
  onClose: () => void;
}

const MobileSidebar = ({ onClose }: MobileSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [communitiesExpanded, setCommunitiesExpanded] = useState(
    location.pathname.startsWith('/communities')
  );

  const isCommunitiesActive = location.pathname.startsWith('/communities');

  const navLinkBase = "flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted text-sm font-medium border-b border-border/50";

  const handleNavClick = () => {
    onClose();
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
    onClose();
  };

  return (
    <div className="h-full bg-background flex flex-col">
      <div className="h-16 flex items-center justify-center px-4 border-b border-border">
        <h1 className="font-sk-cuber text-xl font-bold text-foreground hover-glow">ARES.</h1>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <NavLink 
          to="/" 
          end 
          className={({isActive}) => `${navLinkBase} ${isActive ? 'bg-muted text-primary' : ''}`}
          onClick={handleNavClick}
        >
          <Home className="h-5 w-5" />
          <span>Home</span>
        </NavLink>
        
        <NavLink 
          to="/discovery" 
          className={({isActive}) => `${navLinkBase} ${isActive ? 'bg-muted text-primary' : ''}`}
          onClick={handleNavClick}
        >
          <Compass className="h-5 w-5" />
          <span>Discovery</span>
        </NavLink>

        <NavLink 
          to="/feed" 
          className={({isActive}) => `${navLinkBase} ${isActive ? 'bg-muted text-primary' : ''}`}
          onClick={handleNavClick}
        >
          <MessageSquare className="h-5 w-5" />
          <span>Chat</span>
        </NavLink>

        <div>
          <button 
            onClick={() => setCommunitiesExpanded(!communitiesExpanded)}
            className={`${navLinkBase} w-full justify-between ${isCommunitiesActive ? 'bg-muted text-primary' : ''}`}
          >
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5" />
              <span>Micro-communities</span>
            </div>
            {communitiesExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          
          {communitiesExpanded && (
            <div className="bg-muted/30">
              <NavLink 
                to="/communities/creator-mini" 
                className={({isActive}) => `${navLinkBase} pl-12 ${isActive ? 'bg-muted text-primary' : ''} text-sm`}
                onClick={handleNavClick}
              >
                <span>Creator Mini Tab</span>
              </NavLink>
              <NavLink 
                to="/communities/feed" 
                className={({isActive}) => `${navLinkBase} pl-12 ${isActive ? 'bg-muted text-primary' : ''} text-sm`}
                onClick={handleNavClick}
              >
                <span>Feed</span>
              </NavLink>
            </div>
          )}
        </div>
      </nav>

      <div className="p-4 border-t border-border space-y-4">
        {user && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 px-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-muted">
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{user.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        )}
        
        <a 
          href="https://docs.google.com/forms/d/e/1FAIpQLSfwumh-I9aRQpc1zX4dCjoAd1a42i7MbIE4xN91gLGheNBMiA/viewform?usp=header"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors block text-center"
        >
          Completed Testing? Click here.
        </a>
        
        <div className="flex items-center justify-center gap-6 text-muted-foreground">
          <a href="#" aria-label="Twitter" className="hover:text-foreground transition-colors">
            <Twitter className="h-5 w-5" />
          </a>
          <a href="#" aria-label="Instagram" className="hover:text-foreground transition-colors">
            <Instagram className="h-5 w-5" />
          </a>
          <a href="#" aria-label="GitHub" className="hover:text-foreground transition-colors">
            <Github className="h-5 w-5" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;