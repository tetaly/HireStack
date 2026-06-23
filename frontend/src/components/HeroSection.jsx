import { Search, MapPin, SearchCode } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-32">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[image:var(--hero-gradient)] opacity-5"></div>
        <div className="absolute -top-[30%] -right-[10%] h-[70%] w-[50%] rounded-full bg-primary/10 blur-[120px] animate-float"></div>
        <div className="absolute -bottom-[20%] -left-[10%] h-[60%] w-[40%] rounded-full bg-blue-500/10 blur-[100px] animate-float-slow"></div>
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwgMCwgMCwgMC4wNSkiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4 lg:px-8 text-center animate-in fade-in slide-up">
        <div className="mx-auto mb-6 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary shadow-sm backdrop-blur-sm">
          <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
          Plus de 12 000 opportunités disponibles
        </div>
        
        <h1 className="mx-auto max-w-4xl font-heading text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          Trouvez l'emploi qui <br className="hidden sm:block" />
          <span className="text-gradient">vous correspond</span>
        </h1>
        
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed sm:text-xl">
          HireStack connecte les meilleurs talents aux entreprises les plus innovantes. 
          Simplifiez votre recherche d'emploi dès aujourd'hui.
        </p>

        {/* Search Bar */}
        <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-3 rounded-2xl bg-card p-3 shadow-card-lg border border-border/60 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-3 rounded-xl bg-background px-4 py-3 border border-transparent focus-within:border-primary/30 focus-within:ring-4 focus-within:ring-primary/10 transition-all duration-200">
            <Search className="h-5 w-5 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Métier, mots-clés ou entreprise"
              className="w-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
          
          <div className="hidden h-10 w-px bg-border sm:block"></div>
          
          <div className="flex flex-1 items-center gap-3 rounded-xl bg-background px-4 py-3 border border-transparent focus-within:border-primary/30 focus-within:ring-4 focus-within:ring-primary/10 transition-all duration-200">
            <MapPin className="h-5 w-5 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Ville ou code postal"
              className="w-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
          
          <Button variant="hero" size="lg" className="w-full sm:w-auto h-12 px-8 rounded-xl shrink-0">
            <SearchCode className="mr-2 h-5 w-5" />
            Rechercher
          </Button>
        </div>

        {/* Popular Tags */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
          <span className="font-medium">Recherches populaires :</span>
          {["Développeur React", "Product Manager", "Data Analyst", "Design UI/UX"].map(
            (tag) => (
              <button
                key={tag}
                className="rounded-full border border-border bg-card px-4 py-1.5 transition-all duration-200 hover:border-primary hover:text-primary hover:shadow-sm"
              >
                {tag}
              </button>
            ),
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
