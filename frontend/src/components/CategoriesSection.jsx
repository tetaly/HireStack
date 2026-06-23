import { useEffect, useState } from "react";
import {
  Code,
  Megaphone,
  PenTool,
  BarChart3,
  Users,
  Briefcase,
  HeartPulse,
  GraduationCap,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { jobsApi } from "@/lib/api";

export const categoryMeta = {
  Tech: { icon: Code, label: "Tech & Dev", color: "text-blue-500" },
  Marketing: { icon: Megaphone, label: "Marketing", color: "text-orange-500" },
  Design: { icon: PenTool, label: "Design", color: "text-pink-500" },
  Data: { icon: BarChart3, label: "Data & BI", color: "text-emerald-500" },
  RH: { icon: Users, label: "RH & People", color: "text-purple-500" },
  Commercial: { icon: Briefcase, label: "Commercial", color: "text-indigo-500" },
  Sante: { icon: HeartPulse, label: "Santé", color: "text-rose-500" },
  Formation: { icon: GraduationCap, label: "Formation", color: "text-cyan-500" },
};

export const enrichCategory = (category) => {
  const meta = categoryMeta[category.name] ?? {
    icon: Briefcase,
    label: category.name,
    color: "text-slate-500",
  };

  return {
    ...category,
    ...meta,
  };
};

const CategoriesSection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    jobsApi
      .categories()
      .then((data) => {
        if (active) {
          setCategories(data.categories.map(enrichCategory).slice(0, 8));
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

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="mb-4 font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Explorez par catégorie
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Trouvez des opportunités dans votre domaine d'expertise et découvrez les secteurs qui recrutent activement.
            </p>
          </div>
          <Link to="/categories" className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
            Voir toutes les catégories <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {loading && [...Array(8)].map((_, index) => (
            <div key={index} className="h-[170px] rounded-2xl border border-border bg-card p-6">
              <div className="mb-4 h-12 w-12 rounded-xl bg-secondary animate-pulse" />
              <div className="mb-3 h-4 w-24 rounded bg-secondary animate-pulse" />
              <div className="h-4 w-16 rounded bg-secondary animate-pulse" />
            </div>
          ))}

          {!loading && categories.map(({ icon: Icon, name, label, count, color }) => (
            <Link
              key={name}
              to={`/jobs?q=${encodeURIComponent(name)}`}
              className="group cursor-pointer rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-card-hover relative overflow-hidden"
            >
              {/* Background gradient hover effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary transition-transform duration-300 group-hover:scale-110 group-hover:bg-white group-hover:shadow-sm ${color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                
                <h3 className="font-heading text-base font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {label}
                </h3>
                
                <div className="mt-auto pt-2 flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    {count} offres
                  </p>
                  <ArrowRight className="h-4 w-4 text-primary opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {!loading && categories.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-muted-foreground">
            Aucune catégorie disponible pour le moment.
          </div>
        )}
        
        <div className="mt-8 md:hidden">
          <Link to="/categories" className="inline-flex w-full justify-center items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground hover:bg-secondary transition-colors">
            Voir toutes les catégories
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
