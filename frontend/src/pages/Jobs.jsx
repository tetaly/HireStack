import { Fragment, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import JobCard from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Filter, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { jobsApi } from "@/lib/api";

const types = ["Tous", "CDI", "CDD", "Stage", "Freelance"];
const PAGE_SIZE = 12;

const Jobs = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [location, setLocation] = useState(() => searchParams.get("location") ?? "");
  const [activeType, setActiveType] = useState(() => searchParams.get("type") ?? "Tous");
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPagination((current) => ({ ...current, page: 1 }));
  }, [query, location, activeType]);

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
    setLocation(searchParams.get("location") ?? "");
    setActiveType(searchParams.get("type") ?? "Tous");
  }, [searchParams]);

  useEffect(() => {
    let active = true;

    setLoading(true);
    jobsApi
      .list({
        q: query,
        location,
        type: activeType === "Tous" ? "" : activeType,
        page: pagination.page,
        limit: PAGE_SIZE,
      })
      .then((data) => {
        if (active) {
          setJobs(data.jobs);
          setPagination(data.pagination);
        }
      })
      .catch(() => {
        if (active) {
          setJobs([]);
          setPagination({
            page: 1,
            limit: PAGE_SIZE,
            total: 0,
            totalPages: 1,
          });
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
  }, [query, location, activeType, pagination.page]);

  const pages = Array.from({ length: pagination.totalPages }, (_, index) => index + 1)
    .filter((pageNumber) => {
      if (pagination.totalPages <= 7) {
        return true;
      }

      return (
        pageNumber === 1 ||
        pageNumber === pagination.totalPages ||
        Math.abs(pageNumber - pagination.page) <= 1
      );
    });

  const goToPage = (page) => {
    setPagination((current) => ({
      ...current,
      page: Math.min(Math.max(page, 1), current.totalPages),
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <section className="bg-slate-50 border-b border-border py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-8">
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
              Rechercher un emploi
            </h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
              Découvrez plus de <span className="font-semibold text-primary">{pagination.total}</span> opportunités qui correspondent à vos ambitions.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col lg:flex-row gap-4 p-2 bg-card rounded-2xl shadow-card-lg border border-border/50">
              <div className="flex flex-1 items-center gap-3 rounded-xl bg-background px-4 py-3 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Métier, entreprise, mot-clé"
                  className="w-full bg-transparent text-foreground placeholder:text-muted-foreground outline-none"
                />
              </div>
              <div className="hidden lg:block w-px bg-border my-2" />
              <div className="flex flex-1 items-center gap-3 rounded-xl bg-background px-4 py-3 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <MapPin className="h-5 w-5 text-muted-foreground shrink-0" />
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ville ou télétravail"
                  className="w-full bg-transparent text-foreground placeholder:text-muted-foreground outline-none"
                />
              </div>
              <Button variant="hero" size="lg" className="h-12 px-8 rounded-xl shrink-0 w-full lg:w-auto">
                Rechercher
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-2">
              <span className="text-sm font-medium flex items-center gap-2 text-muted-foreground whitespace-nowrap">
                <Filter className="h-4 w-4" /> Filtres :
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {types.map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveType(t)}
                    className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                      activeType === t
                        ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20"
                        : "bg-white text-muted-foreground hover:bg-secondary border border-border"
                    }`}
                  >
                    {activeType === t && <Check className="h-3.5 w-3.5" />}
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16 flex-1">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Résultats de la recherche <span className="text-muted-foreground font-normal ml-2">({pagination.total})</span>
            </h2>
          </div>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-[280px] rounded-xl border border-border bg-card/50 p-6 animate-pulse">
                  <div className="flex gap-4 mb-4">
                    <div className="h-12 w-12 rounded-xl bg-border" />
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 bg-border rounded w-3/4" />
                      <div className="h-3 bg-border rounded w-1/2" />
                    </div>
                  </div>
                  <div className="space-y-3 mt-8">
                    <div className="h-3 bg-border rounded w-5/6" />
                    <div className="h-3 bg-border rounded w-4/6" />
                    <div className="h-3 bg-border rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/60 bg-card p-16 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Aucune offre trouvée</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Nous n'avons trouvé aucune offre correspondant à vos critères de recherche.
              </p>
              <Button variant="outline" onClick={() => { setQuery(""); setLocation(""); setActiveType("Tous"); }}>
                Effacer les filtres
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => (
                <Link key={job.id} to={`/jobs/${job.id}`} className="h-full block">
                  <JobCard {...job} />
                </Link>
              ))}
            </div>
          )}

          {!loading && pagination.totalPages > 1 && (
            <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
              <p className="text-sm font-medium text-muted-foreground">
                Affichage de la page <span className="text-foreground">{pagination.page}</span> sur <span className="text-foreground">{pagination.totalPages}</span>
              </p>

              <div className="flex items-center gap-1.5 bg-card p-1.5 rounded-lg border border-border shadow-sm">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-md"
                  disabled={pagination.page === 1}
                  onClick={() => goToPage(pagination.page - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {pages.map((pageNumber, index) => {
                  const previous = pages[index - 1];
                  const showGap = previous && pageNumber - previous > 1;

                  return (
                    <Fragment key={`page-${pageNumber}`}>
                      {showGap && (
                        <span className="px-2 text-sm text-muted-foreground">
                          ...
                        </span>
                      )}
                      <Button
                        variant={pageNumber === pagination.page ? "solid" : "ghost"}
                        size="sm"
                        className={`h-8 w-8 p-0 rounded-md font-medium ${pageNumber === pagination.page ? "" : "text-muted-foreground hover:text-foreground"}`}
                        onClick={() => goToPage(pageNumber)}
                      >
                        {pageNumber}
                      </Button>
                    </Fragment>
                  );
                })}

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-md"
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => goToPage(pagination.page + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default Jobs;
