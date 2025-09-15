import { NavLink, useLocation } from "react-router-dom";
import { Home, Compass, MessageSquare, Users, Twitter, Instagram, Github, ChevronDown, ChevronRight } from "lucide-react";
import aresLogo from "@/assets/ares-logo.png";
import { useState } from "react";

const navLinkBase = "flex items-center gap-3 px-4 py-2 rounded-md transition-colors hover:bg-sidebar-accent text-sm font-medium";

const Sidebar = () => {
  const location = useLocation();
  const [communitiesExpanded, setCommunitiesExpanded] = useState(
    location.pathname.startsWith('/communities')
  );

  const isCommunitiesActive = location.pathname.startsWith('/communities');

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="h-16 flex items-center justify-center px-4 border-b border-sidebar-border">
        <h1 className="font-sk-cuber text-2xl font-bold text-white hover-glow">ARES.</h1>
      </div>

      <nav className="p-4 space-y-1">
        <NavLink to="/" end className={({isActive}) => `${navLinkBase} ${isActive ? 'bg-sidebar-accent' : ''}`}>
          <Home className="h-4 w-4" />
          <span>Home</span>
        </NavLink>
        
        <NavLink to="/discovery" className={({isActive}) => `${navLinkBase} ${isActive ? 'bg-sidebar-accent' : ''}`}>
          <Compass className="h-4 w-4" />
          <span>Discovery</span>
        </NavLink>
        <NavLink to="/feed" className={({isActive}) => `${navLinkBase} ${isActive ? 'bg-sidebar-accent' : ''}`}>
          <MessageSquare className="h-4 w-4" />
          <span>Chat</span>
        </NavLink>
        <div>
          <button 
            onClick={() => setCommunitiesExpanded(!communitiesExpanded)}
            className={`${navLinkBase} w-full justify-between ${isCommunitiesActive ? 'bg-sidebar-accent' : ''}`}
          >
            <div className="flex items-center gap-3">
              <Users className="h-4 w-4" />
              <span>Micro-communities</span>
            </div>
            {communitiesExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          
          {communitiesExpanded && (
            <div className="ml-7 mt-1 space-y-1">
              <NavLink 
                to="/communities/creator-mini" 
                className={({isActive}) => `${navLinkBase} ${isActive ? 'bg-sidebar-accent' : ''} text-xs`}
              >
                <span>Creator Mini Tab</span>
              </NavLink>
              <NavLink 
                to="/communities/feed" 
                className={({isActive}) => `${navLinkBase} ${isActive ? 'bg-sidebar-accent' : ''} text-xs`}
              >
                <span>Feed</span>
              </NavLink>
            </div>
          )}
        </div>
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <a 
          href="https://docs.google.com/forms/d/e/1FAIpQLSfwumh-I9aRQpc1zX4dCjoAd1a42i7MbIE4xN91gLGheNBMiA/viewform?usp=header"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors block text-center"
        >
          Completed Testing? Click here.
        </a>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
        <div className="flex items-center justify-between text-sidebar-foreground/80">
          <a href="#" aria-label="Twitter" className="hover:text-foreground transition-colors"><Twitter className="h-5 w-5" /></a>
          <a href="#" aria-label="Instagram" className="hover:text-foreground transition-colors"><Instagram className="h-5 w-5" /></a>
          <a href="#" aria-label="GitHub" className="hover:text-foreground transition-colors"><Github className="h-5 w-5" /></a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
