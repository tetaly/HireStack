import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye, Trash2, CheckCircle, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const listings = [
  {
    title: "Développeur Full Stack",
    company: "TechVision",
    status: "Actif",
    applications: 23,
    date: "10 Jan 2026",
  },
  {
    title: "Product Designer",
    company: "DesignLab",
    status: "Actif",
    applications: 15,
    date: "9 Jan 2026",
  },
  {
    title: "Data Analyst",
    company: "DataCore",
    status: "En attente",
    applications: 0,
    date: "8 Jan 2026",
  },
  {
    title: "Chef de Projet",
    company: "AgencyX",
    status: "Actif",
    applications: 8,
    date: "7 Jan 2026",
  },
  {
    title: "Commercial B2B",
    company: "SalesForce",
    status: "Expiré",
    applications: 34,
    date: "1 Jan 2026",
  },
];

const AdminListings = () => {
  return (
    <DashboardLayout role="admin" title="Gestion des offres">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Rechercher une offre ou entreprise..." 
            className="pl-10 h-10 rounded-xl bg-card border-border shadow-sm focus-visible:ring-primary/20" 
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground mr-1 hidden sm:inline-block">Filtrer :</span>
          <Button variant="solid" size="sm" className="rounded-full shadow-sm">
            Toutes
          </Button>
          <Button variant="outline" size="sm" className="rounded-full bg-card shadow-sm border-border">
            En attente
          </Button>
          <Button variant="outline" size="sm" className="rounded-full bg-card shadow-sm border-border">
            Actives
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/80 text-xs font-semibold uppercase text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4">Offre</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Candidatures</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {listings.map((l) => (
                <tr
                  key={l.title}
                  className="transition-colors hover:bg-slate-50/50 group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary font-heading font-bold text-muted-foreground border border-border">
                        {l.company.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {l.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {l.company}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge 
                      variant={
                        l.status === "Actif" ? "success" : 
                        l.status === "En attente" ? "warning" : "secondary"
                      }
                    >
                      {l.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-foreground font-medium">
                    {l.applications}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {l.date}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-600/10 rounded-lg"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminListings;
