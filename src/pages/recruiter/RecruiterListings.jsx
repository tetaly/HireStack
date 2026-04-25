import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { PlusCircle, Eye, Edit, Trash2, MapPin, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const listings = [
  {
    title: "Développeur Full Stack",
    location: "Paris",
    type: "CDI",
    apps: 23,
    views: 456,
    status: "Actif",
    posted: "10 Jan",
  },
  {
    title: "Product Designer",
    location: "Lyon · Hybride",
    type: "CDI",
    apps: 15,
    views: 289,
    status: "Actif",
    posted: "9 Jan",
  },
  {
    title: "Data Analyst",
    location: "Télétravail",
    type: "CDI",
    apps: 8,
    views: 178,
    status: "Actif",
    posted: "7 Jan",
  },
  {
    title: "Stagiaire Marketing",
    location: "Bordeaux",
    type: "Stage",
    apps: 34,
    views: 567,
    status: "Expiré",
    posted: "1 Déc",
  },
];

const RecruiterListings = () => {
  const navigate = useNavigate();

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
        {listings.map((l) => (
          <div
            key={l.title}
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
                  <Users className="h-3 w-3" /> {l.apps} candidatures
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" /> {l.views} vues
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${l.status === "Actif" ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"}`}
              >
                {l.status}
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
