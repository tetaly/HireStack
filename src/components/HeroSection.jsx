import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-primary py-20 md:py-28">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-accent" />
        <div className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-primary-foreground/20" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
            Trouvez le job qui vous
            <span className="text-accent"> correspond</span>
          </h1>
          <p className="mb-10 text-lg text-primary-foreground/80 md:text-xl">
            Des milliers d'offres d'emploi de qualité, des entreprises qui
            recrutent activement. Votre prochaine opportunité est ici.
          </p>

          {/* Search bar */}
          <div className="mx-auto flex max-w-2xl flex-col gap-3 rounded-2xl bg-card p-3 shadow-xl md:flex-row">
            <div className="flex flex-1 items-center gap-2 rounded-xl bg-secondary px-4 py-3">
              <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
              <input
                type="text"
                placeholder="Titre, mot-clé ou entreprise"
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
            <div className="flex flex-1 items-center gap-2 rounded-xl bg-secondary px-4 py-3">
              <MapPin className="h-5 w-5 shrink-0 text-muted-foreground" />
              <input
                type="text"
                placeholder="Ville ou télétravail"
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
            <Button variant="hero" size="lg" className="rounded-xl px-8">
              Rechercher
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm text-primary-foreground/60">
            <span>Populaires :</span>
            {["Développeur", "Marketing", "Design", "Data", "Commercial"].map(
              (tag) => (
                <span
                  key={tag}
                  className="cursor-pointer rounded-full bg-primary-foreground/10 px-3 py-1 text-primary-foreground/80 transition-colors hover:bg-primary-foreground/20"
                >
                  {tag}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
