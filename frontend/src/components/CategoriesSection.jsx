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

const categories = [
  { icon: Code, name: "Tech & Dev", count: 1240, color: "text-blue-500" },
  { icon: Megaphone, name: "Marketing", count: 856, color: "text-orange-500" },
  { icon: PenTool, name: "Design", count: 643, color: "text-pink-500" },
  { icon: BarChart3, name: "Data & BI", count: 521, color: "text-emerald-500" },
  { icon: Users, name: "RH & People", count: 412, color: "text-purple-500" },
  { icon: Briefcase, name: "Commercial", count: 978, color: "text-indigo-500" },
  { icon: HeartPulse, name: "Santé", count: 334, color: "text-rose-500" },
  { icon: GraduationCap, name: "Formation", count: 267, color: "text-cyan-500" },
];

const CategoriesSection = () => {
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
          <button className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
            Voir toutes les catégories <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {categories.map(({ icon: Icon, name, count, color }) => (
            <div
              key={name}
              className="group cursor-pointer rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-card-hover relative overflow-hidden"
            >
              {/* Background gradient hover effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary transition-transform duration-300 group-hover:scale-110 group-hover:bg-white group-hover:shadow-sm ${color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                
                <h3 className="font-heading text-base font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {name}
                </h3>
                
                <div className="mt-auto pt-2 flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    {count} offres
                  </p>
                  <ArrowRight className="h-4 w-4 text-primary opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 md:hidden">
          <button className="inline-flex w-full justify-center items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground hover:bg-secondary transition-colors">
            Voir toutes les catégories
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
