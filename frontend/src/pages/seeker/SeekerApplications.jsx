import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Building2, Calendar, MessageSquare, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const applications = [
  {
    title: "Développeur Full Stack",
    company: "TechVision",
    date: "10 Jan 2026",
    status: "En cours",
    step: 2,
    totalSteps: 4,
  },
  {
    title: "Product Designer",
    company: "DesignLab",
    date: "8 Jan 2026",
    status: "Entretien prévu",
    step: 3,
    totalSteps: 4,
  },
  {
    title: "Data Analyst",
    company: "DataCore",
    date: "5 Jan 2026",
    status: "En attente",
    step: 1,
    totalSteps: 4,
  },
  {
    title: "Chef de Projet",
    company: "AgencyX",
    date: "2 Jan 2026",
    status: "Refusé",
    step: 0,
    totalSteps: 4,
  },
  {
    title: "Développeur Frontend",
    company: "WebStudio",
    date: "28 Déc 2025",
    status: "Accepté",
    step: 4,
    totalSteps: 4,
  },
];

const statusVariants = {
  "En cours": "info",
  "Entretien prévu": "warning",
  "En attente": "secondary",
  Refusé: "destructive",
  Accepté: "success",
};

const SeekerApplications = () => {
  return (
    <DashboardLayout role="seeker" title="Mes candidatures">
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Candidatures envoyées", value: 5, color: "text-foreground" },
          { label: "En cours d'examen", value: 2, color: "text-primary" },
          { label: "Entretiens prévus", value: 1, color: "text-amber-600" },
          { label: "Offres reçues", value: 1, color: "text-emerald-600" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-transform hover:-translate-y-1"
          >
            <div className={`font-heading text-3xl font-extrabold ${s.color}`}>
              {s.value}
            </div>
            <div className="mt-1 text-sm font-medium text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="font-heading text-lg font-bold text-foreground mb-4">Historique</h2>
        
        {applications.map((a) => (
          <div
            key={a.title + a.company}
            className="group flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-card-hover"
          >
            <div className="flex flex-1 items-start sm:items-center gap-4 sm:gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-blue-500/10 font-heading text-xl font-bold text-primary group-hover:scale-105 transition-transform border border-primary/10">
                {a.company.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-heading text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                    {a.title}
                  </h3>
                  <Badge variant={statusVariants[a.status]} className="ml-0 sm:ml-2">
                    {a.status}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground font-medium">
                  <span className="flex items-center gap-1.5 text-foreground">
                    <Building2 className="h-4 w-4 text-primary/70" /> {a.company}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" /> Postulé le {a.date}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 w-full sm:w-auto border-t border-border sm:border-0 pt-4 sm:pt-0">
              {/* Status Timeline */}
              {a.status !== "Refusé" && (
                <div className="flex items-center gap-1 w-full sm:w-32 justify-center">
                  {[...Array(a.totalSteps)].map((_, i) => (
                    <div key={i} className="flex-1 relative">
                      <div className={`h-1.5 rounded-full ${i < a.step ? 'bg-primary' : 'bg-secondary'}`}></div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <Button variant="outline" size="sm" className="hidden sm:flex rounded-lg bg-card shadow-sm border-border">
                  <MessageSquare className="mr-2 h-4 w-4" /> Messages
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg group-hover:text-primary group-hover:translate-x-1 transition-all">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default SeekerApplications;
