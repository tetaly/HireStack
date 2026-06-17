import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import JobCard from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { jobsApi } from "@/lib/api";

const types = ["Tous", "CDI", "CDD", "Stage", "Freelance"];
const PAGE_SIZE = 12;

const Jobs = () => {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [activeType, setActiveType] = useState("Tous");
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
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="border-b border-border bg-secondary/40 py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            Toutes les offres
          </h1>
          <p className="mt-2 text-muted-foreground">
            {pagination.total} opportunités disponibles
          </p>

          <div className="mt-6 grid gap-3 rounded-xl border border-border bg-card p-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
            <div className="flex min-w-0 items-center gap-2 rounded-lg border border-border bg-background px-3 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Métier, entreprise, mot-clé"
                className="h-10 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex min-w-0 items-center gap-2 rounded-lg border border-border bg-background px-3 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
              <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ville ou télétravail"
                className="h-10 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
            <Button variant="hero" className="h-10 px-6">
              Rechercher
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  activeType === t
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:text-foreground border border-border"
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
          {loading ? (
            <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
              Chargement des offres...
            </div>
          ) : jobs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
              Aucune offre ne correspond à votre recherche.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => (
                <Link key={job.id} to={`/jobs/${job.id}`} className="h-full">
                  <JobCard {...job} />
                </Link>
              ))}
            </div>
          )}

          {!loading && pagination.totalPages > 1 && (
            <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
              <p className="text-sm text-muted-foreground">
                Page {pagination.page} sur {pagination.totalPages}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === 1}
                  onClick={() => goToPage(pagination.page - 1)}
                >
                  Précédent
                </Button>

                {pages.map((pageNumber, index) => {
                  const previous = pages[index - 1];
                  const showGap = previous && pageNumber - previous > 1;

                  return (
                    <div key={pageNumber} className="flex items-center gap-2">
                      {showGap && (
                        <span className="px-1 text-sm text-muted-foreground">
                          ...
                        </span>
                      )}
                      <Button
                        variant={pageNumber === pagination.page ? "hero" : "outline"}
                        size="sm"
                        className="h-9 w-9 px-0"
                        onClick={() => goToPage(pageNumber)}
                      >
                        {pageNumber}
                      </Button>
                    </div>
                  );
                })}

                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => goToPage(pagination.page + 1)}
                >
                  Suivant
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
