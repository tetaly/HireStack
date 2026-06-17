import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  MapPin,
  Clock,
  Building2,
  Bookmark,
  ArrowRight,
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
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Titre, mot-clé..."
            className="pl-10"
          />
        </div>
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Ville..."
            className="pl-10"
          />
        </div>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Contrat" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="cdi">CDI</SelectItem>
            <SelectItem value="cdd">CDD</SelectItem>
            <SelectItem value="freelance">Freelance</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="hero">Rechercher</Button>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        {jobs.length} résultats
      </p>

      <div className="space-y-3">
        {loading && (
          <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
            Chargement des offres...
          </div>
        )}
        {!loading && jobs.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            Aucune offre ne correspond a votre recherche.
          </div>
        )}
        {jobs.map((job) => (
          <Link
            key={job.id}
            to={`/jobs/${job.id}`}
            className="group flex items-center justify-between rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/20 hover:shadow-[var(--card-shadow)]"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 font-heading text-base font-bold text-primary">
                {job.company.charAt(0)}
              </div>
              <div>
                <h3 className="font-heading text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  {job.title}
                </h3>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" /> {job.company}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {job.type}
                  </span>
                  <span className="font-medium text-foreground">
                    {job.salary}
                  </span>
                </div>
                <div className="mt-2 flex gap-1.5">
                  {job.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {job.posted}
              </span>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Bookmark
                  className="h-4 w-4"
                />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default SeekerSearch;
