import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import JobCard from "@/components/JobCard";
import CategoriesSection from "@/components/CategoriesSection";
import StatsSection from "@/components/StatsSection";
import FooterSection from "@/components/FooterSection";
import { Button } from "@/components/ui/button";
import { jobsApi } from "@/lib/api";

const Index = () => {
  const navigate = useNavigate();
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    jobsApi
      .list()
      .then((data) => {
        if (active) {
          setFeaturedJobs(data.jobs.slice(0, 6));
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
            <Button
              variant="hero-outline"
              className="hidden md:inline-flex"
              onClick={() => navigate("/jobs")}
            >
              Voir toutes les offres
            </Button>
          </div>

          {loading ? (
            <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
              Chargement des offres...
            </div>
          ) : featuredJobs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
              Aucune offre publiee pour le moment.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {featuredJobs.map((job) => (
                <Link key={job.id} to={`/jobs/${job.id}`} className="h-full">
                  <JobCard {...job} />
                </Link>
              ))}
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Button variant="hero-outline" onClick={() => navigate("/jobs")}>
              Voir toutes les offres
            </Button>
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
