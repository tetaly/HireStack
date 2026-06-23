import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MapPin,
  Clock,
  Building2,
  Bookmark,
  ArrowRight,
  Filter,
  Briefcase
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { jobsApi } from "@/lib/api";

const SeekerSearch = () => {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("all");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    setLoading(true);
    jobsApi
      .list({
        q: query,
        location,
        type: type === "all" ? "" : type,
      })
      .then((data) => {
        if (active) {
          setJobs(data.jobs);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [query, location, type]);

  return (
    <DashboardLayout role="seeker" title="Rechercher un emploi">
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm mb-8">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="flex flex-1 flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Métier, mots-clés, entreprise..."
                className="pl-11 h-12 rounded-xl bg-background border-border shadow-sm focus-visible:ring-primary/20"
              />
            </div>
            <div className="relative flex-1">
              <MapPin className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Ville ou télétravail..."
                className="pl-11 h-12 rounded-xl bg-background border-border shadow-sm focus-visible:ring-primary/20"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-12 w-full sm:w-[160px] rounded-xl bg-background border-border">
                <SelectValue placeholder="Type de contrat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les contrats</SelectItem>
                <SelectItem value="cdi">CDI</SelectItem>
                <SelectItem value="cdd">CDD</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
                <SelectItem value="stage">Stage</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="hero" className="h-12 w-full sm:w-auto px-8 rounded-xl shrink-0">
              Rechercher
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-heading text-lg font-bold text-foreground">
          Résultats de recherche
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-lg">
            {jobs.length} offre{jobs.length > 1 ? "s" : ""}
          </span>
          <Button variant="outline" size="sm" className="hidden sm:flex rounded-lg bg-card shadow-sm border-border">
            <Filter className="mr-2 h-4 w-4" /> Plus de filtres
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 rounded-2xl border border-border bg-card/50 p-6 animate-pulse"></div>
            ))}
          </div>
        )}
        {!loading && jobs.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border/60 bg-card p-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Aucune offre correspondante</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Essayez de modifier vos critères de recherche ou créez une alerte pour être notifié.
            </p>
            <Button variant="outline" onClick={() => { setQuery(""); setLocation(""); setType("all"); }}>
              Réinitialiser la recherche
            </Button>
          </div>
        )}
        {!loading && jobs.map((job) => (
          <Link
            key={job.id}
            to={`/jobs/${job.id}`}
            className="group block rounded-2xl border border-border bg-card p-5 sm:p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-card-hover relative overflow-hidden"
          >
            {job.featured && (
              <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary to-blue-400"></div>
            )}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-4 sm:gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-blue-500/10 font-heading text-xl font-bold text-primary group-hover:scale-105 transition-transform border border-primary/10">
                  {job.company.charAt(0)}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {job.title}
                    </h3>
                    {job.featured && (
                      <Badge variant="success" className="px-2 py-0">Mis en avant</Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground font-medium">
                    <span className="flex items-center gap-1.5 text-foreground">
                      <Building2 className="h-4 w-4 text-primary/70" /> {job.company}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4" /> {job.type}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {job.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-border bg-transparent px-3 py-1 text-xs font-medium text-muted-foreground group-hover:border-primary/20 group-hover:bg-primary/5 group-hover:text-primary transition-colors"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 sm:gap-3 w-full sm:w-auto border-t border-border sm:border-0 pt-4 sm:pt-0">
                <span className="font-semibold text-foreground bg-secondary px-3 py-1 rounded-lg">
                  {job.salary}
                </span>
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-xs font-medium text-muted-foreground mr-2 sm:mr-0 hidden sm:inline-block">
                    {job.posted}
                  </span>
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg group-hover:text-primary group-hover:translate-x-1 transition-all">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default SeekerSearch;
