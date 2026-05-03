import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.jsx";
import NotFound from "./pages/NotFound.jsx";
import Login from "./pages/Login.jsx";
import Jobs from "./pages/Jobs.jsx";
import JobDetail from "./pages/JobDetail.jsx";
import Companies from "./pages/Companies.jsx";
import CompanyDetail from "./pages/CompanyDetail.jsx";
import Register from "./pages/Register.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminListings from "./pages/admin/AdminListings.jsx";
import AdminSettings from "./pages/admin/AdminSettings.jsx";
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard.jsx";
import RecruiterListings from "./pages/recruiter/RecruiterListings.jsx";
import RecruiterPostJob from "./pages/recruiter/RecruiterPostJob.jsx";
import RecruiterCandidates from "./pages/recruiter/RecruiterCandidates.jsx";
import SeekerSearch from "./pages/seeker/SeekerSearch.jsx";
import SeekerApplications from "./pages/seeker/SeekerApplications.jsx";
import SeekerProfile from "./pages/seeker/SeekerProfile.jsx";
import SeekerAlerts from "./pages/seeker/SeekerAlerts.jsx";

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
          <Route
            path="/recruiter/candidates"
            element={<RecruiterCandidates />}
          />

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
