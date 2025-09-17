import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DiscoveryTier from "./pages/DiscoveryTier";
import Feed from "./pages/Feed";
import MicroCommunities from "./pages/Communities";
import { createTask } from './api'; // Import the function

import React, { useState } from 'react';
import { createTask } from './api';

function App() {
  const [taskInput, setTaskInput] = useState('');
  const [message, setMessage] = useState('');



const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/discovery" element={<DiscoveryTier />} />
          <Route path="/discovery/new" element={<DiscoveryTier />} />
          <Route path="/discovery/rookie" element={<DiscoveryTier />} />
          <Route path="/discovery/sophomore" element={<DiscoveryTier />} />
          <Route path="/discovery/launched" element={<DiscoveryTier />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/communities" element={<MicroCommunities />} />
          <Route path="/communities/creator-mini" element={<MicroCommunities />} />
          <Route path="/communities/feed" element={<MicroCommunities />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

  return (
    <div className="App">
      <h1>My Task App</h1>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="Enter a new task"
        />
        <button type="submit">Add Task</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
