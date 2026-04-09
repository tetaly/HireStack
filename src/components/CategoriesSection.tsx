import { Code, Megaphone, PenTool, BarChart3, Users, Briefcase, HeartPulse, GraduationCap } from "lucide-react";

const categories = [
  { icon: Code, name: "Tech & Dev", count: 1240 },
  { icon: Megaphone, name: "Marketing", count: 856 },
  { icon: PenTool, name: "Design", count: 643 },
  { icon: BarChart3, name: "Data & BI", count: 521 },
  { icon: Users, name: "RH & People", count: 412 },
  { icon: Briefcase, name: "Commercial", count: 978 },
  { icon: HeartPulse, name: "Santé", count: 334 },
  { icon: GraduationCap, name: "Formation", count: 267 },
];

const CategoriesSection = () => {
  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">
            Explorez par catégorie
          </h2>
          <p className="text-muted-foreground">
            Trouvez des opportunités dans votre domaine d'expertise
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {categories.map(({ icon: Icon, name, count }) => (
            <div
              key={name}
              className="group cursor-pointer rounded-xl border border-border bg-card p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[var(--card-shadow)]"
            >
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-sm font-semibold text-card-foreground">
                {name}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">{count} offres</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
