import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import StatsSection from "@/components/StatsSection";
import FooterSection from "@/components/FooterSection";
import JobCard from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

// Placeholder data for the landing page
const featuredJobs = [
  {
    id: 1,
    title: "Développeur Full Stack Senior (React/Node)",
    company: "TechVision",
    location: "Paris, France",
    type: "CDI",
    salary: "65k - 80k €",
    tags: ["React", "Node.js", "TypeScript"],
    posted: "Il y a 2h",
    featured: true,
  },
  {
    id: 2,
    title: "Product Designer UI/UX",
    company: "DesignLab",
    location: "Lyon, France",
    type: "CDI",
    salary: "45k - 60k €",
    tags: ["Figma", "UI/UX", "Design System"],
    posted: "Il y a 5h",
    featured: false,
  },
  {
    id: 3,
    title: "Lead Data Scientist",
    company: "DataCore",
    location: "Télétravail",
    type: "CDI",
    salary: "70k - 90k €",
    tags: ["Python", "Machine Learning", "SQL"],
    posted: "Il y a 1j",
    featured: true,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      
      <StatsSection />

      {/* Featured Jobs Section */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12 flex flex-col items-center text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-accent/10 px-3 py-1 mb-4">
              <Sparkles className="h-4 w-4 text-accent mr-2" />
              <span className="text-sm font-semibold text-accent uppercase tracking-wider">Sélection</span>
            </div>
            <h2 className="mb-4 font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Offres à la une
            </h2>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Découvrez les meilleures opportunités du moment sélectionnées par notre équipe.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredJobs.map((job) => (
              <Link key={job.id} to={`/jobs/${job.id}`} className="block h-full">
                <JobCard {...job} />
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg" className="rounded-full px-8 border-primary/20 hover:border-primary hover:bg-primary/5">
              <Link to="/jobs">
                Voir toutes les offres <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <CategoriesSection />

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background gradient & pattern */}
        <div className="absolute inset-0 bg-primary z-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNSkiLz48L3N2Zz4=')]"></div>
          <div className="absolute -top-1/2 -right-1/4 w-[1000px] h-[1000px] rounded-full bg-white/5 blur-[100px]"></div>
          <div className="absolute -bottom-1/2 -left-1/4 w-[800px] h-[800px] rounded-full bg-blue-600/30 blur-[80px]"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-4xl rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-8 md:p-16 text-center shadow-2xl">
            <h2 className="mb-6 font-heading text-3xl font-bold text-white md:text-5xl tracking-tight">
              Prêt à booster votre carrière ?
            </h2>
            <p className="mb-10 text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Rejoignez des milliers de talents qui ont trouvé leur emploi idéal sur HireStack.
              L'inscription prend moins de 2 minutes.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto rounded-full px-8 font-semibold text-primary hover:bg-white hover:scale-105 transition-all duration-300">
                <Link to="/register">
                  Créer un compte gratuit
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto rounded-full px-8 bg-transparent text-white border-white/30 hover:bg-white/10 hover:text-white transition-all duration-300">
                <Link to="/jobs">
                  Explorer les offres
                </Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-primary-foreground/60">
              Aucune carte bancaire requise · 100% gratuit pour les candidats
            </p>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default Index;
