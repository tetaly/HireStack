import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import JobCard from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MapPin, Users, Calendar, Globe, Briefcase } from "lucide-react";
import { companies, getJobsByCompany } from "@/data/companies";

const CompanyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const company = companies.find((c) => c.id === id);

  if (!company) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="font-heading text-2xl font-bold text-foreground">Entreprise introuvable</h1>
          <Button variant="hero" className="mt-4" onClick={() => navigate("/companies")}>
            Voir toutes les entreprises
          </Button>
        </div>
        <FooterSection />
      </div>
    );
  }

  const jobs = getJobsByCompany(company.name);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        <Link to="/companies" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
          <ChevronLeft className="h-4 w-4" /> Retour aux entreprises
        </Link>
      </div>

      {/* Header */}
      <section className="container mx-auto px-4">
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className={`h-40 bg-gradient-to-br ${company.cover} md:h-52`} />
          <div className="px-6 pb-6 md:px-10 md:pb-10">
            <div className="-mt-12 mb-4 flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-card bg-card font-heading text-4xl font-bold text-primary shadow-md">
              {company.name.charAt(0)}
            </div>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">{company.name}</h1>
                <p className="mt-1 text-muted-foreground">{company.industry}</p>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {company.location}</span>
                  <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {company.size} employés</span>
                  <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Fondée en {company.founded}</span>
                  <span className="flex items-center gap-1"><Globe className="h-4 w-4" /> {company.website}</span>
                </div>
              </div>
              <Button variant="hero">Suivre l'entreprise</Button>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="container mx-auto px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-8">
            <h2 className="font-heading text-xl font-bold text-foreground">À propos</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{company.description}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-8">
            <h2 className="font-heading text-xl font-bold text-foreground">Infos clés</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Secteur</dt><dd className="font-medium text-foreground">{company.industry}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Taille</dt><dd className="font-medium text-foreground">{company.size}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Lieu</dt><dd className="font-medium text-foreground">{company.location}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Fondée</dt><dd className="font-medium text-foreground">{company.founded}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Offres</dt><dd className="font-medium text-primary">{jobs.length} ouverte{jobs.length > 1 ? "s" : ""}</dd></div>
            </dl>
          </div>
        </div>
      </section>

      {/* Jobs */}
      <section className="container mx-auto px-4 pb-16">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Offres chez {company.name}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {jobs.length} poste{jobs.length > 1 ? "s" : ""} ouvert{jobs.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {jobs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
            <Briefcase className="mx-auto mb-3 h-8 w-8 opacity-50" />
            Aucune offre ouverte pour le moment chez {company.name}.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <Link key={job.id} to={`/jobs/${job.id}`}>
                <JobCard {...job} />
              </Link>
            ))}
          </div>
        )}
      </section>

      <FooterSection />
    </div>
  );
};

export default CompanyDetail;
