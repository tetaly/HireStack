import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import JobCard from "@/components/JobCard";
import CategoriesSection from "@/components/CategoriesSection";
import StatsSection from "@/components/StatsSection";
import FooterSection from "@/components/FooterSection";
import { Button } from "@/components/ui/button";

const featuredJobs = [
  {
    title: "Développeur Full Stack",
    company: "TechVision",
    location: "Paris",
    type: "CDI",
    salary: "55-70k €",
    tags: ["React", "Node.js", "TypeScript"],
    posted: "il y a 2h",
    featured: true,
  },
  {
    title: "Product Designer Senior",
    company: "DesignLab",
    location: "Lyon · Hybride",
    type: "CDI",
    salary: "50-62k €",
    tags: ["Figma", "UX Research", "Design System"],
    posted: "il y a 5h",
    featured: true,
  },
  {
    title: "Data Analyst",
    company: "DataCore",
    location: "Télétravail",
    type: "CDI",
    salary: "45-55k €",
    tags: ["SQL", "Python", "Tableau"],
    posted: "il y a 8h",
    featured: false,
  },
  {
    title: "Responsable Marketing",
    company: "GrowthUp",
    location: "Bordeaux",
    type: "CDI",
    salary: "48-58k €",
    tags: ["SEO", "Growth", "Analytics"],
    posted: "il y a 1j",
    featured: false,
  },
  {
    title: "Ingénieur DevOps",
    company: "CloudNine",
    location: "Nantes · Hybride",
    type: "CDI",
    salary: "52-65k €",
    tags: ["AWS", "Docker", "Kubernetes"],
    posted: "il y a 1j",
    featured: false,
  },
  {
    title: "Chef de Projet Digital",
    company: "AgencyX",
    location: "Paris",
    type: "CDD",
    salary: "42-50k €",
    tags: ["Agile", "Scrum", "Jira"],
    posted: "il y a 2j",
    featured: false,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />

      {/* Featured Jobs */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                Offres récentes
              </h2>
              <p className="mt-2 text-muted-foreground">
                Les dernières opportunités publiées par nos entreprises
                partenaires
              </p>
            </div>
            <Button variant="hero-outline" className="hidden md:inline-flex">
              Voir toutes les offres
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featuredJobs.map((job) => (
              <JobCard key={job.title + job.company} {...job} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Button variant="hero-outline">Voir toutes les offres</Button>
          </div>
        </div>
      </section>

      <CategoriesSection />
      <StatsSection />

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl bg-secondary p-10 text-center md:p-16">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Prêt à trouver votre prochain talent ?
            </h2>
            <p className="mx-auto mb-8 max-w-lg text-muted-foreground">
              Publiez vos offres et accédez à une communauté de candidats
              qualifiés et motivés.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button variant="hero" size="lg">
                Publier une offre
              </Button>
              <Button variant="hero-outline" size="lg">
                En savoir plus
              </Button>
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default Index;
