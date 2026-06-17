import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { PlusCircle, Eye, Edit, Trash2, MapPin, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {listings.length} offres publiées
        </p>
        <Button
          variant="hero"
          size="sm"
          onClick={() => navigate("/recruiter/post")}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Publier une offre
        </Button>
      </div>

      <div className="space-y-4">
        {loading && (
          <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
            Chargement des offres...
          </div>
        )}
        {!loading && listings.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            Aucune offre publiee pour le moment.
          </div>
        )}
        {listings.map((l) => (
          <div
            key={l.id}
            className="flex items-center justify-between rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/20"
          >
            <div>
              <h3 className="font-heading text-base font-semibold text-foreground">
                {l.title}
              </h3>
              <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {l.location}
                </span>
                <span>{l.type}</span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" /> {l.applications} candidatures
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" /> {l.views} vues
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${l.status === "active" ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"}`}
              >
                {l.status === "active" ? "Actif" : "Brouillon"}
              </span>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Edit className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default RecruiterListings;
