import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import JobCard from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  MapPin,
  Users,
  Calendar,
  Globe,
  Briefcase,
} from "lucide-react";
import { companies, getJobsByCompany } from "@/data/companies";

const CompanyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const company = companies.find((c) => c.id === id);

  if (!company) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-24 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
              <Briefcase className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="mb-3 font-heading text-2xl font-bold text-foreground">
              Entreprise introuvable
            </h1>
            <p className="mb-8 text-muted-foreground">
              Cette entreprise n'existe plus ou a été retirée de la plateforme.
            </p>
            <Button
              variant="hero"
              className="w-full sm:w-auto"
              onClick={() => navigate("/companies")}
            >
              Voir toutes les entreprises
            </Button>
          </div>
        </div>
        <FooterSection />
      </div>
    );
  }

  const jobs = getJobsByCompany(company.name);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="bg-white border-b border-border py-4">
        <div className="container mx-auto px-4 lg:px-8">
          <Link
            to="/companies"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Retour aux entreprises
          </Link>
        </div>
      </div>

      {/* Header */}
      <section className="container mx-auto px-4 lg:px-8 py-8">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className={`h-48 md:h-64 bg-gradient-to-br ${company.cover} relative`}>
            <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
          </div>
          <div className="px-6 pb-8 md:px-12 md:pb-10">
            <div className="-mt-16 mb-6 flex h-32 w-32 items-center justify-center rounded-2xl border-4 border-card bg-white shadow-lg overflow-hidden relative">
              <div className={`absolute inset-0 bg-gradient-to-br ${company.cover} opacity-10`}></div>
              <span className="font-heading text-5xl font-bold text-foreground relative z-10">
                {company.name.charAt(0)}
              </span>
            </div>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
                  {company.name}
                </h1>
                <p className="mt-2 text-lg font-medium text-primary">{company.industry}</p>
                <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                      <MapPin className="h-4 w-4 text-foreground" />
                    </div>
                    {company.location}
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                      <Users className="h-4 w-4 text-foreground" />
                    </div>
                    {company.size} employés
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                      <Calendar className="h-4 w-4 text-foreground" />
                    </div>
                    Fondée en {company.founded}
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                      <Globe className="h-4 w-4 text-foreground" />
                    </div>
                    {company.website}
                  </span>
                </div>
              </div>
              <Button variant="hero" size="lg" className="w-full md:w-auto mt-4 md:mt-0">
                Suivre l'entreprise
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
              <h2 className="mb-4 font-heading text-2xl font-bold text-foreground">
                À propos de nous
              </h2>
              <div className="prose prose-blue max-w-none text-muted-foreground leading-relaxed">
                <p>{company.description}</p>
              </div>
            </div>
            
            {/* Jobs */}
            <div>
              <div className="mb-6 flex items-end justify-between">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground">
                    Offres ouvertes
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {jobs.length} poste{jobs.length > 1 ? "s" : ""} ouvert{jobs.length > 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {jobs.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border p-12 text-center bg-card shadow-sm">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary mb-4">
                    <Briefcase className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Aucune offre</h3>
                  <p className="text-muted-foreground">
                    Aucune offre ouverte pour le moment chez {company.name}. Revenez plus tard !
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                  {jobs.map((job) => (
                    <Link key={job.id} to={`/jobs/${job.id}`} className="block h-full">
                      <JobCard {...job} />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sticky top-24">
              <h2 className="mb-6 font-heading text-lg font-bold text-foreground">
                Informations clés
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl bg-secondary/50 p-4 border border-border/50">
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium text-foreground">Secteur</span>
                  </div>
                  <span className="font-medium text-primary">{company.industry}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-secondary/50 p-4 border border-border/50">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium text-foreground">Taille</span>
                  </div>
                  <span className="font-medium text-foreground">{company.size}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-secondary/50 p-4 border border-border/50">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium text-foreground">Siège</span>
                  </div>
                  <span className="font-medium text-foreground">{company.location}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-secondary/50 p-4 border border-border/50">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium text-foreground">Création</span>
                  </div>
                  <span className="font-medium text-foreground">{company.founded}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default CompanyDetail;
