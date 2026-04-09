import DashboardLayout from "@/components/DashboardLayout";
import { FileText, Users, Eye, TrendingUp } from "lucide-react";

const stats = [
  { label: "Offres actives", value: "8", icon: FileText },
  { label: "Candidatures reçues", value: "142", icon: Users },
  { label: "Vues totales", value: "3 890", icon: Eye },
  { label: "Taux de conversion", value: "3.6%", icon: TrendingUp },
];

const recentApps = [
  { name: "Marie Dupont", job: "Développeur Full Stack", date: "Il y a 1h", status: "Nouveau" },
  { name: "Lucas Bernard", job: "Product Designer", date: "Il y a 3h", status: "Vu" },
  { name: "Emma Moreau", job: "Développeur Full Stack", date: "Il y a 5h", status: "Nouveau" },
  { name: "Hugo Petit", job: "Data Analyst", date: "Il y a 1j", status: "Entretien" },
  { name: "Sophie Leroy", job: "Chef de Projet", date: "Il y a 2j", status: "Refusé" },
];

const statusColors: Record<string, string> = {
  Nouveau: "bg-primary/10 text-primary",
  Vu: "bg-muted text-muted-foreground",
  Entretien: "bg-accent/10 text-accent",
  Refusé: "bg-destructive/10 text-destructive",
};

const RecruiterDashboard = () => {
  return (
    <DashboardLayout role="recruiter" title="Tableau de bord">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2 font-heading text-2xl font-bold text-foreground">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <h2 className="font-heading text-lg font-semibold text-foreground">Dernières candidatures</h2>
        </div>
        <div className="divide-y divide-border">
          {recentApps.map((a, i) => (
            <div key={i} className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-heading text-sm font-bold text-primary">
                  {a.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{a.name}</div>
                  <div className="text-xs text-muted-foreground">{a.job}</div>
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[a.status]}`}>{a.status}</span>
                <div className="mt-1 text-xs text-muted-foreground">{a.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RecruiterDashboard;
