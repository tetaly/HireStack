import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Filter,
  MapPin,
  Search,
  Users,
  X,
} from "lucide-react";
import { companies, getJobsByCompany } from "@/data/companies";

const PAGE_SIZE = 6;
const ALL = "Tous";

const Companies = () => {
  const [query, setQuery] = useState("");
  const [industry, setIndustry] = useState(ALL);
  const [size, setSize] = useState(ALL);
  const [page, setPage] = useState(1);

  const industries = useMemo(
    () => [ALL, ...Array.from(new Set(companies.map((company) => company.industry))).sort()],
    [],
  );
  const sizes = useMemo(
    () => [ALL, ...Array.from(new Set(companies.map((company) => company.size))).sort()],
    [],
  );

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return companies.filter((company) => {
      const matchesQuery =
        normalizedQuery === "" ||
        company.name.toLowerCase().includes(normalizedQuery) ||
        company.industry.toLowerCase().includes(normalizedQuery) ||
        company.location.toLowerCase().includes(normalizedQuery);
      const matchesIndustry = industry === ALL || company.industry === industry;
      const matchesSize = size === ALL || company.size === size;

      return matchesQuery && matchesIndustry && matchesSize;
    });
  }, [query, industry, size]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginatedCompanies = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const hasFilters = query !== "" || industry !== ALL || size !== ALL;

  useEffect(() => {
    setPage(1);
  }, [query, industry, size]);

  const resetFilters = () => {
    setQuery("");
    setIndustry(ALL);
    setSize(ALL);
  };

  const goToPage = (nextPage) => {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <section className="bg-slate-50 border-b border-border py-10 lg:py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Building2 className="h-5 w-5" />
              </div>
              <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
                Entreprises
              </h1>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
                Explorez les recruteurs présents sur HireStack et trouvez les environnements qui correspondent à vos ambitions.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Entreprises
                </p>
                <p className="mt-2 text-2xl font-bold text-foreground">{companies.length}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Secteurs
                </p>
                <p className="mt-2 text-2xl font-bold text-foreground">{industries.length - 1}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 lg:py-12 flex-1">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-8 rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="grid gap-3 lg:grid-cols-[1fr_220px_180px_auto] lg:items-center">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Rechercher une entreprise, un secteur ou une ville..."
                  className="h-11 rounded-lg bg-background pl-11"
                />
              </div>

              <div className="relative">
                <Filter className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <select
                  value={industry}
                  onChange={(event) => setIndustry(event.target.value)}
                  className="h-11 w-full appearance-none rounded-lg border border-input bg-background px-10 text-sm font-medium text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
                >
                  {industries.map((option) => (
                    <option key={option} value={option}>
                      {option === ALL ? "Tous les secteurs" : option}
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={size}
                onChange={(event) => setSize(event.target.value)}
                className="h-11 w-full appearance-none rounded-lg border border-input bg-background px-3 text-sm font-medium text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
              >
                {sizes.map((option) => (
                  <option key={option} value={option}>
                    {option === ALL ? "Toutes tailles" : `${option} employés`}
                  </option>
                ))}
              </select>

              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-lg"
                disabled={!hasFilters}
                onClick={resetFilters}
              >
                <X className="mr-2 h-4 w-4" />
                Réinitialiser
              </Button>
            </div>
          </div>

          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground">
                Liste des entreprises
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {filtered.length} résultat{filtered.length > 1 ? "s" : ""} · page {page} sur {totalPages}
              </p>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center shadow-sm max-w-2xl mx-auto">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary mb-4">
                <Building2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">Aucune entreprise trouvée</h3>
              <p className="text-muted-foreground mb-6">
                Aucune entreprise ne correspond à vos critères. Essayez avec d'autres mots-clés ou filtres.
              </p>
              <Button type="button" variant="outline" className="rounded-xl" onClick={resetFilters}>
                Réinitialiser la recherche
              </Button>
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {paginatedCompanies.map((c) => {
                const jobsCount = getJobsByCompany(c.name).length;
                return (
                  <Link
                    key={c.id}
                    to={`/companies/${c.id}`}
                    className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-card-hover"
                  >
                    <div className={`h-20 bg-gradient-to-br ${c.cover} relative`}>
                      <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
                    </div>
                    
                    <div className="flex flex-col flex-1 p-5 relative">
                      <div className="absolute -top-8 left-5 flex h-14 w-14 items-center justify-center rounded-xl border-4 border-card bg-white shadow-sm overflow-hidden">
                        <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${c.cover} opacity-10`}></div>
                        <span className="absolute font-heading text-xl font-bold text-foreground">
                          {c.name.charAt(0)}
                        </span>
                      </div>

                      <div className="mt-7 flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-heading text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                            {c.name}
                          </h3>
                          <p className="text-sm font-medium text-primary mt-1">
                            {c.industry}
                          </p>
                        </div>
                        <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">
                          <ExternalLink className="h-4 w-4 text-primary" />
                        </div>
                      </div>

                      <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {c.description}
                      </p>

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

                      <div className="mt-auto pt-6">
                        <div className="inline-flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-1.5 text-sm font-semibold text-primary transition-colors group-hover:bg-primary/10">
                          <Building2 className="h-4 w-4" /> 
                          {jobsCount} offre{jobsCount > 1 ? "s" : ""} ouverte{jobsCount > 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
              </div>

              {totalPages > 1 && (
                <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
                  <p className="text-sm font-medium text-muted-foreground">
                    Affichage de {(page - 1) * PAGE_SIZE + 1} à {Math.min(page * PAGE_SIZE, filtered.length)} sur {filtered.length}
                  </p>

                  <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1.5 shadow-sm">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-md"
                      disabled={page === 1}
                      onClick={() => goToPage(page - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                      <Button
                        key={pageNumber}
                        type="button"
                        variant={pageNumber === page ? "default" : "ghost"}
                        size="sm"
                        className={`h-8 w-8 rounded-md p-0 ${pageNumber === page ? "" : "text-muted-foreground"}`}
                        onClick={() => goToPage(pageNumber)}
                      >
                        {pageNumber}
                      </Button>
                    ))}

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-md"
                      disabled={page === totalPages}
                      onClick={() => goToPage(page + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default Companies;
