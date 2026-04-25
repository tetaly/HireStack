import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Users, Briefcase } from "lucide-react";
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
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="border-b border-border bg-secondary/40 py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">Entreprises</h1>
          <p className="mt-2 text-muted-foreground">
            {companies.length} entreprises qui recrutent
          </p>

          <div className="mt-6 flex items-center gap-2 rounded-xl border border-border bg-card p-3">
            <Search className="ml-2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher une entreprise, secteur ou ville"
              className="border-0 focus-visible:ring-0"
            />
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
              Aucune entreprise ne correspond à votre recherche.
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((c) => {
                const jobsCount = getJobsByCompany(c.name).length;
                return (
                  <Link
                    key={c.id}
                    to={`/companies/${c.id}`}
                    className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-[var(--card-shadow)]"
                  >
                    <div className={`h-20 bg-gradient-to-br ${c.cover}`} />
                    <div className="p-5">
                      <div className="-mt-10 mb-3 flex h-14 w-14 items-center justify-center rounded-xl border-4 border-card bg-card font-heading text-xl font-bold text-primary shadow-sm">
                        {c.name.charAt(0)}
                      </div>
                      <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary">
                        {c.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{c.industry}</p>

                      <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {c.location}</span>
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {c.size}</span>
                      </div>

                      <div className="mt-4 border-t border-border pt-3 text-xs">
                        <span className="inline-flex items-center gap-1 font-medium text-primary">
                          <Briefcase className="h-3 w-3" /> {jobsCount} offre{jobsCount > 1 ? "s" : ""} ouverte{jobsCount > 1 ? "s" : ""}
                        </span>
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
