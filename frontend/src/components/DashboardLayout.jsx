import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  Briefcase,
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  LogOut,
  PlusCircle,
  Search,
  User,
  Bell,
  ChevronLeft,
  Menu,
  X,
  ChevronRight
} from "lucide-react";
import { authApi, authStorage } from "@/lib/api";

const navItems = {
  admin: [
    { icon: LayoutDashboard, label: "Tableau de bord", path: "/admin" },
    { icon: Users, label: "Utilisateurs", path: "/admin/users" },
    { icon: FileText, label: "Offres", path: "/admin/listings" },
    { icon: Settings, label: "Paramètres", path: "/admin/settings" },
  ],
  recruiter: [
    { icon: LayoutDashboard, label: "Tableau de bord", path: "/recruiter" },
    { icon: FileText, label: "Mes offres", path: "/recruiter/listings" },
    { icon: PlusCircle, label: "Publier", path: "/recruiter/post" },
    { icon: Users, label: "Candidats", path: "/recruiter/candidates" },
  ],
  seeker: [
    { icon: Search, label: "Rechercher", path: "/seeker" },
    { icon: FileText, label: "Candidatures", path: "/seeker/applications" },
    { icon: User, label: "Mon profil", path: "/seeker/profile" },
    { icon: Bell, label: "Alertes", path: "/seeker/alerts" },
  ],
};

const roleLabels = {
  admin: "Administrateur",
  recruiter: "Recruteur",
  seeker: "Chercheur",
};
const roleColors = {
  admin: "bg-destructive/10 text-destructive",
  recruiter: "bg-accent/10 text-accent",
  seeker: "bg-primary/10 text-primary",
};

const DashboardLayout = ({ children, role, title }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const items = navItems[role];
  const user = authStorage.getUser();
  const userName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Utilisateur";

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Clear session regardless of api failure
    } finally {
      authStorage.clearSession();
      navigate("/login", { replace: true });
    }
  };

  const SidebarContent = () => (
    <>
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm">
          <Briefcase className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <div className="font-heading text-sm font-bold tracking-tight text-foreground">
            HireStack
          </div>
          <div className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold leading-none tracking-wide uppercase ${roleColors[role]}`}>
            {roleLabels[role]}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-1">
          <div className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Menu Principal
          </div>
          {items.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className={`group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground transition-colors"}`} />
                  {item.label}
                </div>
                {isActive && <ChevronRight className="h-4 w-4 text-primary" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="shrink-0 border-t border-border p-4">
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading font-semibold text-primary">
            {userName.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium text-foreground">
              {userName}
            </div>
            <div className="truncate text-xs text-muted-foreground">
              {user?.email}
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <button
            onClick={() => navigate("/")}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            Retour au site
          </button>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden animate-in fade-in"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-card transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-border bg-background/80 px-6 backdrop-blur-xl">
          <button
            type="button"
            className="rounded-md p-1 -ml-2 text-muted-foreground hover:bg-secondary lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex flex-1 items-center justify-between">
            <h1 className="font-heading text-lg font-semibold text-foreground">
              {title}
            </h1>
            
            {/* Desktop header utilities could go here (notifications, etc) */}
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 lg:p-8 animate-in fade-in slide-up">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
