import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Mail, Download, Star, Filter, MessageSquare, CheckCircle, XCircle } from "lucide-react";

const candidates = [
  {
    name: "Marie Dupont",
    title: "Développeuse Full Stack",
    job: "Développeur Full Stack",
    experience: "5 ans exp.",
    match: 92,
    status: "Nouveau",
  },
  {
    name: "Lucas Bernard",
    title: "UX/UI Designer Senior",
    job: "Product Designer",
    experience: "7 ans exp.",
    match: 88,
    status: "Entretien",
  },
  {
    name: "Emma Moreau",
    title: "Data Scientist",
    job: "Data Analyst",
    experience: "3 ans exp.",
    match: 85,
    status: "Nouveau",
  },
  {
    name: "Hugo Petit",
    title: "Développeur Backend",
    job: "Développeur Full Stack",
    experience: "4 ans exp.",
    match: 78,
    status: "Vu",
  },
  {
    name: "Sophie Leroy",
    title: "Chef de Projet Digital",
    job: "Chef de Projet",
    experience: "6 ans exp.",
    match: 75,
    status: "Refusé",
  },
];

const statusVariants = {
  Nouveau: "info",
  Vu: "secondary",
  Entretien: "warning",
  Refusé: "destructive",
};

const RecruiterCandidates = () => {
  return (
    <DashboardLayout role="recruiter" title="Candidats">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Rechercher par nom, poste..." 
            className="pl-10 h-10 rounded-xl bg-card border-border shadow-sm focus-visible:ring-primary/20" 
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-full bg-card shadow-sm border-border">
            <Filter className="mr-2 h-3.5 w-3.5" /> Filtrer
          </Button>
          <Button variant="outline" size="sm" className="rounded-full bg-card shadow-sm border-border">
            Offre: Toutes
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {candidates.map((c) => (
          <div
            key={c.name}
            className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 sm:p-6 transition-all hover:border-primary/30 hover:shadow-card-hover"
          >
            <div className="flex items-start sm:items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-heading text-xl font-bold text-primary group-hover:scale-105 transition-transform">
                {c.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {c.name}
                </h3>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground font-medium">
                  <span className="text-foreground">{c.title}</span>
                  <span className="hidden sm:inline-block h-1 w-1 rounded-full bg-border"></span>
                  <span>{c.experience}</span>
                </div>
                <div className="mt-2 text-xs font-medium text-muted-foreground bg-secondary inline-flex px-2 py-1 rounded-md">
                  Candidat pour : <span className="text-foreground ml-1">{c.job}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 border-t border-border sm:border-0 pt-4 sm:pt-0">
              <div className="flex items-center justify-between sm:flex-col sm:items-end w-full sm:w-auto gap-2">
                <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-sm font-semibold text-amber-600">
                  <Star className="h-4 w-4 fill-amber-600" /> {c.match}%
                </div>
                <Badge variant={statusVariants[c.status]}>
                  {c.status === "Nouveau" && <span className="mr-1 h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></span>}
                  {c.status}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg" title="Contacter">
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg" title="Télécharger CV">
                  <Download className="h-4 w-4" />
                </Button>
                
                <div className="h-6 w-px bg-border mx-1 hidden sm:block"></div>
                
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-600/10 rounded-lg" title="Accepter">
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg" title="Refuser">
                  <XCircle className="h-4 w-4" />
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
