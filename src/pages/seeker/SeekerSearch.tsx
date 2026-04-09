import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Clock, Building2, Bookmark, ArrowRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const jobs = [
  { title: "Développeur Full Stack", company: "TechVision", location: "Paris", type: "CDI", salary: "55-70k €", tags: ["React", "Node.js"], posted: "Il y a 2h", saved: false },
  { title: "Product Designer Senior", company: "DesignLab", location: "Lyon · Hybride", type: "CDI", salary: "50-62k €", tags: ["Figma", "UX"], posted: "Il y a 5h", saved: true },
  { title: "Data Analyst", company: "DataCore", location: "Télétravail", type: "CDI", salary: "45-55k €", tags: ["SQL", "Python"], posted: "Il y a 8h", saved: false },
  { title: "Responsable Marketing", company: "GrowthUp", location: "Bordeaux", type: "CDI", salary: "48-58k €", tags: ["SEO", "Growth"], posted: "Il y a 1j", saved: false },
  { title: "Ingénieur DevOps", company: "CloudNine", location: "Nantes · Hybride", type: "CDI", salary: "52-65k €", tags: ["AWS", "Docker"], posted: "Il y a 1j", saved: true },
  { title: "Chef de Projet Digital", company: "AgencyX", location: "Paris", type: "CDD", salary: "42-50k €", tags: ["Agile", "Scrum"], posted: "Il y a 2j", saved: false },
];

const SeekerSearch = () => {
  return (
    <DashboardLayout role="seeker" title="Rechercher un emploi">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Titre, mot-clé..." className="pl-10" />
        </div>
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Ville..." className="pl-10" />
        </div>
        <Select>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Contrat" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="cdi">CDI</SelectItem>
            <SelectItem value="cdd">CDD</SelectItem>
            <SelectItem value="freelance">Freelance</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="hero">Rechercher</Button>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">{jobs.length} résultats</p>

      <div className="space-y-3">
        {jobs.map((job) => (
          <div key={job.title} className="group flex items-center justify-between rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/20 hover:shadow-[var(--card-shadow)]">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 font-heading text-base font-bold text-primary">
                {job.company.charAt(0)}
              </div>
              <div>
                <h3 className="font-heading text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{job.title}</h3>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {job.company}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {job.type}</span>
                  <span className="font-medium text-foreground">{job.salary}</span>
                </div>
                <div className="mt-2 flex gap-1.5">
                  {job.tags.map((t) => (
                    <span key={t} className="rounded bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{job.posted}</span>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Bookmark className={`h-4 w-4 ${job.saved ? "fill-primary text-primary" : ""}`} />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default SeekerSearch;
