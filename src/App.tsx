import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/Login.tsx";
import Jobs from "./pages/Jobs.tsx";
import JobDetail from "./pages/JobDetail.tsx";
import Companies from "./pages/Companies.tsx";
import CompanyDetail from "./pages/CompanyDetail.tsx";
import Register from "./pages/Register.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminUsers from "./pages/admin/AdminUsers.tsx";
import AdminListings from "./pages/admin/AdminListings.tsx";
import AdminSettings from "./pages/admin/AdminSettings.tsx";
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard.tsx";
import RecruiterListings from "./pages/recruiter/RecruiterListings.tsx";
import RecruiterPostJob from "./pages/recruiter/RecruiterPostJob.tsx";
import RecruiterCandidates from "./pages/recruiter/RecruiterCandidates.tsx";
import SeekerSearch from "./pages/seeker/SeekerSearch.tsx";
import SeekerApplications from "./pages/seeker/SeekerApplications.tsx";
import SeekerProfile from "./pages/seeker/SeekerProfile.tsx";
import SeekerAlerts from "./pages/seeker/SeekerAlerts.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/companies/:id" element={<CompanyDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/listings" element={<AdminListings />} />
          <Route path="/admin/settings" element={<AdminSettings />} />

          {/* Recruiter */}
          <Route path="/recruiter" element={<RecruiterDashboard />} />
          <Route path="/recruiter/listings" element={<RecruiterListings />} />
          <Route path="/recruiter/post" element={<RecruiterPostJob />} />
          <Route path="/recruiter/candidates" element={<RecruiterCandidates />} />

          {/* Seeker */}
          <Route path="/seeker" element={<SeekerSearch />} />
          <Route path="/seeker/applications" element={<SeekerApplications />} />
          <Route path="/seeker/profile" element={<SeekerProfile />} />
          <Route path="/seeker/alerts" element={<SeekerAlerts />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
