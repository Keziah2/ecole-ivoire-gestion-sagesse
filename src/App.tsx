
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import Users from "./pages/Users";
import Schools from "./pages/Schools";
import Pedagogy from "./pages/Pedagogy";
import Staff from "./pages/Staff";
import Finance from "./pages/Finance";
import Parents from "./pages/Parents";
import Communication from "./pages/Communication";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/users" element={<Users />} />
              <Route path="/schools" element={<Schools />} />
              <Route path="/pedagogy" element={<Pedagogy />} />
              <Route path="/staff" element={<Staff />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/parents" element={<Parents />} />
              <Route path="/communication" element={<Communication />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
