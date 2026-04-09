import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Briefcase, LayoutDashboard, FileText, Users, Settings, LogOut, PlusCircle, Search, User, Bell, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

interface DashboardLayoutProps {
  children: ReactNode;
  role: "admin" | "recruiter" | "seeker";
  title: string;
}

const navItems: Record<string, SidebarItem[]> = {
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

const roleLabels = { admin: "Administrateur", recruiter: "Recruteur", seeker: "Chercheur d'emploi" };
const roleColors = { admin: "bg-destructive", recruiter: "bg-accent", seeker: "bg-primary" };

const DashboardLayout = ({ children, role, title }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const items = navItems[role];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-card">
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Briefcase className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <div className="font-heading text-sm font-bold text-foreground">RecrutPro</div>
            <div className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium text-primary-foreground ${roleColors[role]}`}>
              {roleLabels[role]}
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {items.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-border p-3 space-y-1">
          <button
            onClick={() => navigate("/")}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            Accueil
          </button>
          <button
            onClick={() => navigate("/login")}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-64 flex-1">
        <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-md px-8 py-4">
          <h1 className="font-heading text-xl font-bold text-foreground">{title}</h1>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
