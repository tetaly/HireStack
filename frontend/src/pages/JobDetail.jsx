import { useEffect, useState } from "react";
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
  CalendarDays,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { jobsApi } from "@/lib/api";

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    setLoading(true);
    jobsApi
      .get(id)
      .then((data) => {
        if (active) {
          setJob(data.job);
          setRelated(data.related ?? []);
        }
      })
      .catch(() => {
        if (active) {
          setJob(null);
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
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-24 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-muted-foreground animate-pulse">
            <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <p className="font-medium">Chargement de l'offre...</p>
          </div>
        </div>
        <FooterSection />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-24 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
              <Briefcase className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="mb-3 font-heading text-2xl font-bold text-foreground">
              Offre introuvable
            </h1>
            <p className="mb-8 text-muted-foreground">
              Cette offre n'existe plus ou a été pourvue par un autre candidat.
            </p>
            <Button
              variant="hero"
              className="w-full sm:w-auto"
              onClick={() => navigate("/jobs")}
            >
              Voir toutes les offres
            </Button>
          </div>
        </div>
        <FooterSection />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Breadcrumb / Back Link */}
      <div className="bg-white border-b border-border py-4">
        <div className="container mx-auto px-4 lg:px-8">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Retour aux résultats
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <div className="grid gap-8 lg:gap-10 lg:grid-cols-3">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Header Card */}
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm relative overflow-hidden">
              {/* Accent top border */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-blue-400 to-accent"></div>
              
              <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-blue-500/10 ring-1 ring-border shadow-sm">
                  <span className="font-heading text-3xl font-bold text-primary">
                    {job.company.charAt(0)}
                  </span>
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                      {job.title}
                    </h1>
                    {job.featured && (
                      <Badge variant="success" className="gap-1.5 px-3 py-1 text-xs">
                        <Sparkles className="h-3 w-3" />
                        Mis en avant
                      </Badge>
                    )}
                  </div>
                  
                  <div className="mb-6 flex items-center gap-2 text-lg text-muted-foreground">
                    <Building2 className="h-5 w-5" /> 
                    <span className="font-medium text-foreground">{job.company}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                        <MapPin className="h-4 w-4 text-foreground" />
                      </div>
                      {job.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                        <Briefcase className="h-4 w-4 text-foreground" />
                      </div>
                      {job.type}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                        <Euro className="h-4 w-4 text-foreground" />
                      </div>
                      {job.salary}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
              <h2 className="mb-4 font-heading text-xl font-bold text-foreground flex items-center gap-2">
                À propos du poste
              </h2>
              <div className="prose prose-sm sm:prose-base prose-blue max-w-none text-muted-foreground leading-relaxed">
                <p>{job.description}</p>
              </div>

              <div className="my-8 h-px w-full bg-border" />

              <h3 className="mb-4 font-heading text-lg font-semibold text-foreground">
                Vos missions principales
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                  <span>Participer à la conception et au développement des nouvelles fonctionnalités.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                  <span>{job.description}</span>
                </li>
              </ul>

              <div className="my-8 h-px w-full bg-border" />

              <h3 className="mb-4 font-heading text-lg font-semibold text-foreground">
                Le profil recherché
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                  <span>{job.profileRequired || "Profil motivé, autonome et organisé avec une forte capacité d'adaptation."}</span>
                </li>
              </ul>

              <div className="my-8 h-px w-full bg-border" />

              <h3 className="mb-4 font-heading text-lg font-semibold text-foreground">
                Compétences requises
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-lg border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-sm font-medium text-primary"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <aside className="space-y-6">
            {/* Action Card (Sticky) */}
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-card-lg">
              <Button
                variant="hero"
                size="lg"
                className="w-full text-base"
                onClick={() => toast.success("Candidature envoyée avec succès !")}
              >
                Postuler maintenant
              </Button>
              
              <div className="mt-3 grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="font-medium"
                  onClick={() => toast.info("Offre sauvegardée dans vos favoris")}
                >
                  <Bookmark className="mr-2 h-4 w-4" /> Sauver
                </Button>
                <Button
                  variant="outline"
                  className="font-medium"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Lien copié dans le presse-papier");
                  }}
                >
                  <Share2 className="mr-2 h-4 w-4" /> Partager
                </Button>
              </div>

              <div className="mt-8 space-y-4 rounded-xl bg-secondary/50 p-5 border border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Type de contrat</span>
                  <span className="text-sm font-semibold text-foreground">{job.type}</span>
                </div>
                <div className="h-px bg-border/80" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Rémunération</span>
                  <span className="text-sm font-semibold text-foreground">{job.salary}</span>
                </div>
                <div className="h-px bg-border/80" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Lieu</span>
                  <span className="text-sm font-semibold text-foreground">{job.location}</span>
                </div>
                <div className="h-px bg-border/80" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Publication</span>
                  <span className="text-sm font-semibold text-foreground">{job.posted}</span>
                </div>
              </div>
            </div>

            {/* Related Jobs */}
            {related.length > 0 && (
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="mb-4 font-heading text-base font-semibold text-foreground">
                  Offres similaires
                </h3>
                <div className="flex flex-col gap-3">
                  {related.map((r) => (
                    <Link
                      key={r.id}
                      to={`/jobs/${r.id}`}
                      className="group flex flex-col gap-1 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-sm"
                    >
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {r.title}
                      </h4>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm text-muted-foreground">{r.company}</span>
                        <span className="text-xs font-medium text-primary/80 bg-primary/10 px-2 py-0.5 rounded-md">
                          {r.location}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
          
        </div>
      </div>

      <FooterSection />
    </div>
  );
};

export default JobDetail;
