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
import Categories from "./pages/Categories.jsx";
import Companies from "./pages/Companies.jsx";
import CompanyDetail from "./pages/CompanyDetail.jsx";
import CareerAdvice from "./pages/CareerAdvice.jsx";
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
import SeekerOnboarding from "./pages/seeker/SeekerOnboarding.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PublicOnlyRoute from "./components/PublicOnlyRoute.jsx";

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
          <Route path="/categories" element={<Categories />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/companies/:id" element={<CompanyDetail />} />
          <Route path="/career-advice" element={<CareerAdvice />} />
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <Register />
              </PublicOnlyRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/listings"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminListings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminSettings />
              </ProtectedRoute>
            }
          />

          {/* Recruiter */}
          <Route
            path="/recruiter"
            element={
              <ProtectedRoute roles={["recruiter"]}>
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/listings"
            element={
              <ProtectedRoute roles={["recruiter"]}>
                <RecruiterListings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/post"
            element={
              <ProtectedRoute roles={["recruiter"]}>
                <RecruiterPostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/candidates"
            element={
              <ProtectedRoute roles={["recruiter"]}>
                <RecruiterCandidates />
              </ProtectedRoute>
            }
          />

          {/* Seeker */}
          <Route
            path="/seeker/onboarding"
            element={
              <ProtectedRoute roles={["seeker"]}>
                <SeekerOnboarding />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seeker"
            element={
              <ProtectedRoute roles={["seeker"]}>
                <SeekerSearch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seeker/applications"
            element={
              <ProtectedRoute roles={["seeker"]}>
                <SeekerApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seeker/profile"
            element={
              <ProtectedRoute roles={["seeker"]}>
                <SeekerProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seeker/alerts"
            element={
              <ProtectedRoute roles={["seeker"]}>
                <SeekerAlerts />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
