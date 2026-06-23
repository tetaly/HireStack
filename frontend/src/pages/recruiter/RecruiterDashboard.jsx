import DashboardLayout from "@/components/DashboardLayout";
import { FileText, Users, Eye, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const stats = [
  { 
    label: "Offres actives", 
    value: "8", 
    icon: FileText,
    trend: "+2",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  { 
    label: "Candidatures", 
    value: "142", 
    icon: Users,
    trend: "+12",
    color: "text-emerald-600",
    bg: "bg-emerald-600/10",
  },
  { 
    label: "Vues totales", 
    value: "3 890", 
    icon: Eye,
    trend: "+15%",
    color: "text-purple-600",
    bg: "bg-purple-600/10",
  },
  { 
    label: "Taux de conversion", 
    value: "3.6%", 
    icon: TrendingUp,
    trend: "+0.4%",
    color: "text-amber-600",
    bg: "bg-amber-600/10",
  },
];

const recentApps = [
  {
    name: "Marie Dupont",
    job: "Développeur Full Stack",
    date: "Il y a 1h",
    status: "Nouveau",
  },
  {
    name: "Lucas Bernard",
    job: "Product Designer",
    date: "Il y a 3h",
    status: "Vu",
  },
  {
    name: "Emma Moreau",
    job: "Développeur Full Stack",
    date: "Il y a 5h",
    status: "Nouveau",
  },
  {
    name: "Hugo Petit",
    job: "Data Analyst",
    date: "Il y a 1j",
    status: "Entretien",
  },
  {
    name: "Sophie Leroy",
    job: "Chef de Projet",
    date: "Il y a 2j",
    status: "Refusé",
  },
];

const statusVariants = {
  Nouveau: "info",
  Vu: "secondary",
  Entretien: "warning",
  Refusé: "destructive",
};

const RecruiterDashboard = () => {
  return (
    <DashboardLayout role="recruiter" title="Tableau de bord">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-card-hover hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {s.label}
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <h3 className="font-heading text-3xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {s.value}
                  </h3>
                  <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    {s.trend}
                  </span>
                </div>
              </div>
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${s.bg}`}>
                <s.icon className={`h-7 w-7 ${s.color}`} />
              </div>
            </div>
            <div className={`absolute -bottom-6 -right-6 h-24 w-24 rounded-full ${s.bg} blur-2xl transition-opacity group-hover:opacity-100 opacity-50`}></div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="border-b border-border bg-slate-50/50 p-6 flex items-center justify-between">
          <div>
            <h2 className="font-heading text-lg font-bold text-foreground">
              Dernières candidatures
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Vos 5 candidatures les plus récentes nécessitant une action.
            </p>
          </div>
          <button className="text-sm font-medium text-primary hover:underline underline-offset-4">
            Voir tout
          </button>
        </div>
        <div className="divide-y divide-border">
          {recentApps.map((a, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-6 transition-colors hover:bg-slate-50/50 group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 font-heading text-lg font-bold text-primary group-hover:scale-110 transition-transform">
                  {a.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {a.name}
                  </div>
                  <div className="text-sm text-muted-foreground">{a.job}</div>
                </div>
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                <Badge variant={statusVariants[a.status]}>
                  {a.status === "Nouveau" && <span className="mr-1 h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></span>}
                  {a.status}
                </Badge>
                <div className="text-xs font-medium text-muted-foreground">
                  {a.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RecruiterDashboard;
