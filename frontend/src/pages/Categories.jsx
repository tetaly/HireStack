import { useEffect, useState } from "react";
import { ArrowRight, Briefcase, Search, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { enrichCategory } from "@/components/CategoriesSection";
import { jobsApi } from "@/lib/api";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    jobsApi
      .categories()
      .then((data) => {
        if (active) {
          setCategories(data.categories.map(enrichCategory));
        }
      })
      .catch(() => {
        if (active) {
          setCategories([]);
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
  }, []);

  const totalJobs = categories.reduce((sum, category) => sum + category.count, 0);
  const topCategory = categories[0] ?? null;
  const normalizedQuery = query.trim().toLowerCase();
  const filteredCategories = categories.filter((category) =>
    category.label.toLowerCase().includes(normalizedQuery) ||
    category.name.toLowerCase().includes(normalizedQuery),
  );
  const maxCount = Math.max(...categories.map((category) => category.count), 1);
  const TopCategoryIcon = topCategory?.icon ?? Briefcase;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        <section className="border-b border-border bg-slate-50 py-10 lg:py-12">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
              <div className="max-w-3xl">
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Briefcase className="h-5 w-5" />
                </div>
                <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
                  Catégories d'emploi
                </h1>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
                  Parcourez les domaines qui recrutent réellement, calculés depuis les offres actives de la plateforme.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Offres actives
                  </p>
                  <p className="mt-2 text-2xl font-bold text-foreground">
                    {loading ? "--" : totalJobs}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Catégories
                  </p>
                  <p className="mt-2 text-2xl font-bold text-foreground">
                    {loading ? "--" : categories.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 lg:py-12">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="relative max-w-xl">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Rechercher une catégorie..."
                  className="h-12 rounded-xl bg-card pl-11 shadow-sm"
                />
              </div>

              <Button asChild variant="outline" className="h-12 rounded-xl">
                <Link to="/jobs">
                  <Search className="mr-2 h-4 w-4" />
                  Voir toutes les offres
                </Link>
              </Button>
            </div>

            {!loading && topCategory && (
              <Link
                to={`/jobs?q=${encodeURIComponent(topCategory.name)}`}
                className="mb-6 flex flex-col gap-4 rounded-xl border border-primary/20 bg-primary/5 p-5 transition-colors hover:border-primary/40 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-card shadow-sm ${topCategory.color}`}>
                    <TopCategoryIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                      <TrendingUp className="h-4 w-4" />
                      Catégorie la plus active
                    </div>
                    <p className="mt-1 font-heading text-xl font-bold text-foreground">
                      {topCategory.label}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-5 sm:justify-end">
                  <span className="text-sm font-medium text-muted-foreground">
                    {topCategory.count} offres
                  </span>
                  <ArrowRight className="h-5 w-5 text-primary" />
                </div>
              </Link>
            )}

            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <h2 className="font-heading text-xl font-bold text-foreground">
                  Toutes les catégories
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {loading
                    ? "Chargement..."
                    : `${filteredCategories.length} résultat${filteredCategories.length > 1 ? "s" : ""}`}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="h-[140px] rounded-xl border border-border bg-card p-5">
                    <div className="mb-4 h-10 w-10 rounded-lg bg-secondary animate-pulse" />
                    <div className="mb-3 h-4 w-24 rounded bg-secondary animate-pulse" />
                    <div className="h-2 w-full rounded bg-secondary animate-pulse" />
                  </div>
                ))}
              </div>
            ) : categories.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                  <Search className="h-7 w-7" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  Aucune catégorie disponible
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Les catégories apparaîtront ici dès que des offres actives seront publiées.
                </p>
                <Button asChild variant="outline" className="mt-6 rounded-xl">
                  <Link to="/jobs">Retour aux offres</Link>
                </Button>
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                  <Search className="h-7 w-7" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  Aucun résultat
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Essayez avec un autre nom de catégorie.
                </p>
                <Button variant="outline" className="mt-6 rounded-xl" onClick={() => setQuery("")}>
                  Effacer la recherche
                </Button>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCategories.map(({ icon: Icon, name, label, count, color }) => (
                  <Link
                    key={name}
                    to={`/jobs?q=${encodeURIComponent(name)}`}
                    className="group rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/30 hover:shadow-card-hover"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary ${color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-heading text-base font-semibold text-foreground transition-colors group-hover:text-primary">
                            {label}
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {count} offres actives
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-primary opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100" />
                    </div>

                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-300"
                        style={{ width: `${Math.max(8, (count / maxCount) * 100)}%` }}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  );
};

export default Categories;
