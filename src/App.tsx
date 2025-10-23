import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import DiscoveryTier from "./pages/DiscoveryTier";
import Feed from "./pages/Feed";
import MicroCommunities from "./pages/Communities";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/discovery" element={<ProtectedRoute><DiscoveryTier /></ProtectedRoute>} />
            <Route path="/discovery/new" element={<ProtectedRoute><DiscoveryTier /></ProtectedRoute>} />
            <Route path="/discovery/rookie" element={<ProtectedRoute><DiscoveryTier /></ProtectedRoute>} />
            <Route path="/discovery/sophomore" element={<ProtectedRoute><DiscoveryTier /></ProtectedRoute>} />
            <Route path="/discovery/launched" element={<ProtectedRoute><DiscoveryTier /></ProtectedRoute>} />
            <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
            <Route path="/communities" element={<ProtectedRoute><MicroCommunities /></ProtectedRoute>} />
            <Route path="/communities/creator-mini" element={<ProtectedRoute><MicroCommunities /></ProtectedRoute>} />
            <Route path="/communities/feed" element={<ProtectedRoute><MicroCommunities /></ProtectedRoute>} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
