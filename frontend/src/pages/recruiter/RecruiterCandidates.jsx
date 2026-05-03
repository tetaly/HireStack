import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Mail, Download, Star } from "lucide-react";

const candidates = [
  {
    name: "Marie Dupont",
    title: "Développeuse Full Stack",
    job: "Développeur Full Stack",
    experience: "5 ans",
    match: 92,
    status: "Nouveau",
  },
  {
    name: "Lucas Bernard",
    title: "UX/UI Designer Senior",
    job: "Product Designer",
    experience: "7 ans",
    match: 88,
    status: "Entretien",
  },
  {
    name: "Emma Moreau",
    title: "Data Scientist",
    job: "Data Analyst",
    experience: "3 ans",
    match: 85,
    status: "Nouveau",
  },
  {
    name: "Hugo Petit",
    title: "Développeur Backend",
    job: "Développeur Full Stack",
    experience: "4 ans",
    match: 78,
    status: "Vu",
  },
  {
    name: "Sophie Leroy",
    title: "Chef de Projet Digital",
    job: "Chef de Projet",
    experience: "6 ans",
    match: 75,
    status: "Refusé",
  },
];

const statusColors = {
  Nouveau: "bg-primary/10 text-primary",
  Vu: "bg-muted text-muted-foreground",
  Entretien: "bg-accent/10 text-accent",
  Refusé: "bg-destructive/10 text-destructive",
};

const RecruiterCandidates = () => {
  return (
    <DashboardLayout role="recruiter" title="Candidats">
      <div className="mb-6 flex items-center gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Rechercher un candidat..." className="pl-10" />
        </div>
      </div>

      <div className="space-y-4">
        {candidates.map((c) => (
          <div
            key={c.name}
            className="flex items-center justify-between rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/20"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-heading text-lg font-bold text-primary">
                {c.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-heading text-sm font-semibold text-foreground">
                  {c.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {c.title} · {c.experience}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Postulé pour: {c.job}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
                  <Star className="h-3.5 w-3.5 text-accent" /> {c.match}%
                </div>
                <span
                  className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[c.status]}`}
                >
                  {c.status}
                </span>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Mail className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Download className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default RecruiterCandidates;
