import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { Search, MapPin, Users, Briefcase, ExternalLink } from "lucide-react";
import { companies, getJobsByCompany } from "@/data/companies";

const Companies = () => {
  const [query, setQuery] = useState("");

  const filtered = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.industry.toLowerCase().includes(query.toLowerCase()) ||
      c.location.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <section className="bg-slate-50 border-b border-border py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
              Découvrez les entreprises
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Explorez plus de <span className="font-semibold text-primary">{companies.length} entreprises</span> qui recrutent activement et trouvez la culture qui vous correspond.
            </p>
          </div>

          <div className="mt-8 max-w-2xl">
            <div className="flex items-center gap-3 rounded-2xl bg-card px-4 py-3 shadow-card-lg border border-border/50 focus-within:border-primary/30 focus-within:ring-4 focus-within:ring-primary/10 transition-all duration-200">
              <Search className="h-5 w-5 text-muted-foreground shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher une entreprise, un secteur ou une ville..."
                className="w-full bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16 flex-1">
        <div className="container mx-auto px-4 lg:px-8">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/60 bg-card p-16 text-center shadow-sm max-w-2xl mx-auto">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary mb-4">
                <Building2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">Aucune entreprise trouvée</h3>
              <p className="text-muted-foreground mb-6">
                Aucune entreprise ne correspond à votre recherche "{query}". Essayez avec d'autres mots-clés.
              </p>
              <button 
                onClick={() => setQuery("")}
                className="text-primary font-medium hover:underline"
              >
                Réinitialiser la recherche
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((c) => {
                const jobsCount = getJobsByCompany(c.name).length;
                return (
                  <Link
                    key={c.id}
                    to={`/companies/${c.id}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-card-hover"
                  >
                    {/* Cover Image */}
                    <div className={`h-24 bg-gradient-to-br ${c.cover} relative`}>
                      <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
                    </div>
                    
                    <div className="flex flex-col flex-1 p-6 relative">
                      {/* Avatar */}
                      <div className="absolute -top-10 left-6 flex h-16 w-16 items-center justify-center rounded-xl border-4 border-card bg-white shadow-sm overflow-hidden">
                        <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${c.cover} opacity-10`}></div>
                        <span className="absolute font-heading text-2xl font-bold text-foreground">
                          {c.name.charAt(0)}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="mt-8 flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-heading text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                            {c.name}
                          </h3>
                          <p className="text-sm font-medium text-primary mt-1">
                            {c.industry}
                          </p>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                          <ExternalLink className="h-4 w-4 text-primary" />
                        </div>
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 shrink-0" /> 
                          <span className="truncate">{c.location}</span>
                        </span>
                        <span className="flex items-center gap-2">
                          <Users className="h-4 w-4 shrink-0" /> 
                          <span className="truncate">{c.size} employés</span>
                        </span>
                      </div>

                      {/* Footer */}
                      <div className="mt-auto pt-6">
                        <div className="inline-flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-1.5 text-sm font-semibold text-primary transition-colors group-hover:bg-primary/10">
                          <Briefcase className="h-4 w-4" /> 
                          {jobsCount} offre{jobsCount > 1 ? "s" : ""} ouverte{jobsCount > 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default Companies;
