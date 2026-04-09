import DashboardLayout from "@/components/DashboardLayout";
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";

const applications = [
  { title: "Développeur Full Stack", company: "TechVision", date: "10 Jan", status: "En cours", icon: Clock },
  { title: "Product Designer", company: "DesignLab", date: "8 Jan", status: "Entretien prévu", icon: CheckCircle },
  { title: "Data Analyst", company: "DataCore", date: "5 Jan", status: "En attente", icon: Clock },
  { title: "Chef de Projet", company: "AgencyX", date: "2 Jan", status: "Refusé", icon: XCircle },
  { title: "Développeur Frontend", company: "WebStudio", date: "28 Déc", status: "Accepté", icon: CheckCircle },
];

const statusColors: Record<string, string> = {
  "En cours": "bg-primary/10 text-primary",
  "Entretien prévu": "bg-accent/10 text-accent",
  "En attente": "bg-muted text-muted-foreground",
  "Refusé": "bg-destructive/10 text-destructive",
  "Accepté": "bg-accent/10 text-accent",
};

const SeekerApplications = () => {
  return (
    <DashboardLayout role="seeker" title="Mes candidatures">
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Total", value: 5 },
          { label: "En cours", value: 2 },
          { label: "Entretiens", value: 1 },
          { label: "Acceptées", value: 1 },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4 text-center">
            <div className="font-heading text-2xl font-bold text-foreground">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {applications.map((a) => (
          <div key={a.title + a.company} className="flex items-center justify-between rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 font-heading text-sm font-bold text-primary">
                {a.company.charAt(0)}
              </div>
              <div>
                <h3 className="font-heading text-sm font-semibold text-foreground">{a.title}</h3>
                <p className="text-xs text-muted-foreground">{a.company} · Postulé le {a.date}</p>
              </div>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[a.status]}`}>
              {a.status}
            </span>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default SeekerApplications;
