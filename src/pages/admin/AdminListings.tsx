import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye, Trash2, CheckCircle, XCircle } from "lucide-react";

const listings = [
  { title: "Développeur Full Stack", company: "TechVision", status: "Actif", applications: 23, date: "10 Jan 2026" },
  { title: "Product Designer", company: "DesignLab", status: "Actif", applications: 15, date: "9 Jan 2026" },
  { title: "Data Analyst", company: "DataCore", status: "En attente", applications: 0, date: "8 Jan 2026" },
  { title: "Chef de Projet", company: "AgencyX", status: "Actif", applications: 8, date: "7 Jan 2026" },
  { title: "Commercial B2B", company: "SalesForce", status: "Expiré", applications: 34, date: "1 Jan 2026" },
];

const AdminListings = () => {
  return (
    <DashboardLayout role="admin" title="Gestion des offres">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Rechercher une offre..." className="pl-10" />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Offre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Candidatures</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {listings.map((l) => (
              <tr key={l.title} className="hover:bg-secondary/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-foreground">{l.title}</div>
                  <div className="text-xs text-muted-foreground">{l.company}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    l.status === "Actif" ? "bg-accent/10 text-accent" : l.status === "En attente" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  }`}>{l.status}</span>
                </td>
                <td className="px-6 py-4 text-sm text-foreground">{l.applications}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{l.date}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-accent"><CheckCircle className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default AdminListings;
