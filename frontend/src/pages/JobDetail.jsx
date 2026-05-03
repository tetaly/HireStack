import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Clock,
  Building2,
  Briefcase,
  Euro,
  ChevronLeft,
  Share2,
  Bookmark,
  CheckCircle2,
} from "lucide-react";
import { allJobs } from "./Jobs";
import { toast } from "sonner";

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = allJobs.find((j) => j.id === id);

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Offre introuvable
          </h1>
          <Button
            variant="hero"
            className="mt-4"
            onClick={() => navigate("/jobs")}
          >
            Voir toutes les offres
          </Button>
        </div>
        <FooterSection />
      </div>
    );
  }

  const related = allJobs
    .filter((j) => j.id !== job.id && j.category === job.category)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
        >
          <ChevronLeft className="h-4 w-4" /> Retour aux offres
        </Link>
      </div>

      <section className="container mx-auto px-4 pb-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-border bg-card p-8">
              <div className="flex items-start gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 font-heading text-2xl font-bold text-primary">
                  {job.company.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
                      {job.title}
                    </h1>
                    {job.featured && (
                      <Badge className="bg-accent text-accent-foreground border-0">
                        Mis en avant
                      </Badge>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-muted-foreground">
                    <Building2 className="h-4 w-4" /> {job.company}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" /> {job.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <Euro className="h-4 w-4" /> {job.salary}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" /> Publié {job.posted}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-8">
              <h2 className="font-heading text-xl font-bold text-foreground">
                Description du poste
              </h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Rejoignez {job.company} en tant que {job.title}. Vous
                travaillerez au sein d'une équipe passionnée sur des projets
                ambitieux à fort impact. Nous recherchons une personne motivée,
                autonome et souhaitant évoluer dans un environnement stimulant.
              </p>

              <h3 className="mt-6 font-heading text-base font-semibold text-foreground">
                Vos missions
              </h3>
              <ul className="mt-3 space-y-2 text-muted-foreground">
                {[
                  "Concevoir et développer de nouvelles fonctionnalités",
                  "Collaborer avec les équipes produit et design",
                  "Garantir la qualité du code et participer aux revues",
                  "Contribuer à l'amélioration continue de l'architecture",
                ].map((m) => (
                  <li key={m} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{" "}
                    {m}
                  </li>
                ))}
              </ul>

              <h3 className="mt-6 font-heading text-base font-semibold text-foreground">
                Profil recherché
              </h3>
              <ul className="mt-3 space-y-2 text-muted-foreground">
                {[
                  "3+ ans d'expérience sur un poste similaire",
                  "Maîtrise des technologies listées",
                  "Excellente communication et esprit d'équipe",
                  "Goût pour la résolution de problèmes complexes",
                ].map((m) => (
                  <li key={m} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{" "}
                    {m}
                  </li>
                ))}
              </ul>

              <h3 className="mt-6 font-heading text-base font-semibold text-foreground">
                Compétences
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {job.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-md bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="sticky top-6 rounded-2xl border border-border bg-card p-6">
              <Button
                variant="hero"
                size="lg"
                className="w-full"
                onClick={() => toast.success("Candidature envoyée !")}
              >
                Postuler maintenant
              </Button>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast("Offre sauvegardée")}
                >
                  <Bookmark className="mr-1 h-4 w-4" /> Sauver
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast("Lien copié");
                  }}
                >
                  <Share2 className="mr-1 h-4 w-4" /> Partager
                </Button>
              </div>

              <div className="mt-6 space-y-3 border-t border-border pt-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium text-foreground">
                    {job.type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Salaire</span>
                  <span className="font-medium text-foreground">
                    {job.salary}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lieu</span>
                  <span className="font-medium text-foreground">
                    {job.location}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Catégorie</span>
                  <span className="font-medium text-foreground">
                    {job.category}
                  </span>
                </div>
              </div>
            </div>

            {related.length > 0 && (
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-heading text-base font-semibold text-foreground">
                  Offres similaires
                </h3>
                <div className="mt-4 space-y-3">
                  {related.map((r) => (
                    <Link
                      key={r.id}
                      to={`/jobs/${r.id}`}
                      className="block rounded-lg border border-border p-3 transition-colors hover:border-primary/30"
                    >
                      <div className="font-medium text-sm text-foreground">
                        {r.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {r.company} · {r.location}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default JobDetail;
