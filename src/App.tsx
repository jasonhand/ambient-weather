
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import DataView from "./pages/DataView";
import NotFound from "./pages/NotFound";
import { useLocation } from "react-router-dom";
import { datadog } from "./utils/datadog";

const queryClient = new QueryClient();

const DataViewWrapper = () => {
  const location = useLocation();
  const data = location.state?.data || null;
  
  // Track page view
  datadog.addAction('page_view', { page: 'data_view' });
  
  return <DataView data={data} />;
};

const App = () => {
  // Track app initialization
  datadog.addAction('app_initialized', { version: '1.0.0' });
  
  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/data" element={<DataViewWrapper />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
