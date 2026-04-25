import { useState } from "react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import JobCard from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Filter } from "lucide-react";
import { Link } from "react-router-dom";

export const allJobs = [
  { id: "1", title: "Développeur Full Stack", company: "TechVision", location: "Paris", type: "CDI", salary: "55-70k €", tags: ["React", "Node.js", "TypeScript"], posted: "il y a 2h", featured: true, category: "Tech" },
  { id: "2", title: "Product Designer Senior", company: "DesignLab", location: "Lyon · Hybride", type: "CDI", salary: "50-62k €", tags: ["Figma", "UX Research", "Design System"], posted: "il y a 5h", featured: true, category: "Design" },
  { id: "3", title: "Data Analyst", company: "DataCore", location: "Télétravail", type: "CDI", salary: "45-55k €", tags: ["SQL", "Python", "Tableau"], posted: "il y a 8h", featured: false, category: "Data" },
  { id: "4", title: "Responsable Marketing", company: "GrowthUp", location: "Bordeaux", type: "CDI", salary: "48-58k €", tags: ["SEO", "Growth", "Analytics"], posted: "il y a 1j", featured: false, category: "Marketing" },
  { id: "5", title: "Ingénieur DevOps", company: "CloudNine", location: "Nantes · Hybride", type: "CDI", salary: "52-65k €", tags: ["AWS", "Docker", "Kubernetes"], posted: "il y a 1j", featured: false, category: "Tech" },
  { id: "6", title: "Chef de Projet Digital", company: "AgencyX", location: "Paris", type: "CDD", salary: "42-50k €", tags: ["Agile", "Scrum", "Jira"], posted: "il y a 2j", featured: false, category: "Gestion" },
  { id: "7", title: "Backend Developer Go", company: "ScaleIO", location: "Télétravail", type: "CDI", salary: "60-75k €", tags: ["Go", "PostgreSQL", "gRPC"], posted: "il y a 2j", featured: false, category: "Tech" },
  { id: "8", title: "UX Researcher", company: "PixelHub", location: "Marseille", type: "CDI", salary: "45-55k €", tags: ["Recherche", "Interviews", "Tests"], posted: "il y a 3j", featured: false, category: "Design" },
  { id: "9", title: "Comptable", company: "FinPro", location: "Toulouse", type: "CDI", salary: "38-45k €", tags: ["Sage", "Fiscalité"], posted: "il y a 4j", featured: false, category: "Finance" },
];

const types = ["Tous", "CDI", "CDD", "Stage", "Freelance"];

const Jobs = () => {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [activeType, setActiveType] = useState("Tous");

  const filtered = allJobs.filter((j) => {
    const matchQ = j.title.toLowerCase().includes(query.toLowerCase()) || j.company.toLowerCase().includes(query.toLowerCase());
    const matchL = j.location.toLowerCase().includes(location.toLowerCase());
    const matchT = activeType === "Tous" || j.type === activeType;
    return matchQ && matchL && matchT;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="border-b border-border bg-secondary/40 py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">Toutes les offres</h1>
          <p className="mt-2 text-muted-foreground">{allJobs.length} opportunités disponibles</p>

          <div className="mt-6 flex flex-col gap-3 rounded-xl border border-border bg-card p-3 md:flex-row">
            <div className="flex flex-1 items-center gap-2 rounded-lg border border-border px-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Métier, entreprise, mot-clé" className="border-0 focus-visible:ring-0" />
            </div>
            <div className="flex flex-1 items-center gap-2 rounded-lg border border-border px-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Ville ou télétravail" className="border-0 focus-visible:ring-0" />
            </div>
            <Button variant="hero">Rechercher</Button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  activeType === t ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground border border-border"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
              Aucune offre ne correspond à votre recherche.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((job) => (
                <Link key={job.id} to={`/jobs/${job.id}`}>
                  <JobCard {...job} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default Jobs;
