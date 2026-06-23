import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Eye, Edit, Trash2, MapPin, Users, Briefcase } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { recruiterJobsApi } from "@/lib/api";

const RecruiterListings = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    recruiterJobsApi
      .list()
      .then((data) => {
        if (active) {
          setListings(data.jobs);
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
    <DashboardLayout role="recruiter" title="Mes offres">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-heading text-lg font-bold text-foreground">Gestion des annonces</h2>
          <p className="text-sm text-muted-foreground">
            {listings.length} offre{listings.length > 1 ? "s" : ""} publiée{listings.length > 1 ? "s" : ""} au total
          </p>
        </div>
        <Button
          variant="hero"
          className="rounded-xl shrink-0"
          onClick={() => navigate("/recruiter/post")}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Nouvelle offre
        </Button>
      </div>

      <div className="space-y-4">
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-2xl border border-border bg-card/50 p-5 animate-pulse"></div>
            ))}
          </div>
        )}
        {!loading && listings.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border/60 bg-card p-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary mb-4">
              <Briefcase className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Aucune offre</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Vous n'avez pas encore publié d'offres d'emploi. Commencez par créer votre première annonce.
            </p>
            <Button variant="outline" onClick={() => navigate("/recruiter/post")}>
              Créer une annonce
            </Button>
          </div>
        )}
        {!loading && listings.map((l) => (
          <div
            key={l.id}
            className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-card-hover"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Link to={`/jobs/${l.id}`} className="font-heading text-lg font-semibold text-foreground hover:text-primary transition-colors">
                  {l.title}
                </Link>
                <Badge variant={l.status === "active" ? "success" : "secondary"}>
                  {l.status === "active" ? "Actif" : "Brouillon"}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground font-medium">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> {l.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4" /> {l.type}
                </span>
                <span className="flex items-center gap-1.5 text-foreground">
                  <Users className="h-4 w-4 text-primary" /> 
                  {l.applications} candidat{l.applications > 1 ? "s" : ""}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="h-4 w-4" /> {l.views} vues
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-4 sm:pt-0 border-t border-border sm:border-0">
              <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg" asChild>
                <Link to={`/jobs/${l.id}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg">
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default RecruiterListings;
