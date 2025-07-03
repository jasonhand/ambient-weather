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
import { datadogRum } from '@datadog/browser-rum';
import { reactPlugin } from '@datadog/browser-rum-react';

// Initialize Datadog RUM with React plugin
datadogRum.init({
    applicationId: 'c03b4df7-6481-42ec-a4ef-44099b68ba26',
    clientToken: 'pube9baef23d6715258f73ebf2af8e8302a',
    site: 'datadoghq.com',
    service:'ambient-weather',
    env: 'prod',
    
    // Specify a version number to identify the deployed version of your application in Datadog
    // version: '1.0.0',
    sessionSampleRate:  100,
    sessionReplaySampleRate: 100,
    defaultPrivacyLevel: 'mask-user-input',
    plugins: [reactPlugin({ router: true })],
});

const queryClient = new QueryClient();

const DataViewWrapper = () => {
  const location = useLocation();
  const data = location.state?.data || null;
  
  // Track page view (now handled automatically by React plugin, but keeping for custom tracking)
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
