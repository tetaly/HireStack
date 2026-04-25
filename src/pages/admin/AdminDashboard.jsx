import DashboardLayout from "@/components/DashboardLayout";
import { Users, FileText, TrendingUp, AlertCircle } from "lucide-react";

const stats = [
  { label: "Utilisateurs", value: "12 480", change: "+12%", icon: Users },
  { label: "Offres actives", value: "3 256", change: "+8%", icon: FileText },
  { label: "Candidatures", value: "28 930", change: "+23%", icon: TrendingUp },
  { label: "Signalements", value: "14", change: "-5%", icon: AlertCircle },
];

const recentUsers = [
  {
    name: "Marie Dupont",
    email: "marie@email.com",
    role: "Chercheur",
    date: "Il y a 2h",
  },
  {
    name: "Pierre Martin",
    email: "pierre@techco.com",
    role: "Recruteur",
    date: "Il y a 5h",
  },
  {
    name: "Sophie Leroy",
    email: "sophie@email.com",
    role: "Chercheur",
    date: "Il y a 8h",
  },
  {
    name: "Lucas Bernard",
    email: "lucas@startup.io",
    role: "Recruteur",
    date: "Il y a 1j",
  },
  {
    name: "Emma Moreau",
    email: "emma@email.com",
    role: "Chercheur",
    date: "Il y a 1j",
  },
];

const AdminDashboard = () => {
  return (
    <DashboardLayout role="admin" title="Tableau de bord">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2 font-heading text-2xl font-bold text-foreground">
              {s.value}
            </div>
            <div className="mt-1 text-xs text-accent">{s.change} ce mois</div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Derniers inscrits
          </h2>
        </div>
        <div className="divide-y divide-border">
          {recentUsers.map((u) => (
            <div
              key={u.email}
              className="flex items-center justify-between px-6 py-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-heading text-sm font-bold text-primary">
                  {u.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {u.name}
                  </div>
                  <div className="text-xs text-muted-foreground">{u.email}</div>
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${u.role === "Recruteur" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"}`}
                >
                  {u.role}
                </span>
                <div className="mt-1 text-xs text-muted-foreground">
                  {u.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
