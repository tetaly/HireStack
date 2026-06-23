import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Shield, Trash2, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const users = [
  {
    name: "Marie Dupont",
    email: "marie@email.com",
    role: "Chercheur",
    status: "Actif",
    joined: "12 Jan 2026",
  },
  {
    name: "Pierre Martin",
    email: "pierre@techco.com",
    role: "Recruteur",
    status: "Actif",
    joined: "10 Jan 2026",
  },
  {
    name: "Sophie Leroy",
    email: "sophie@email.com",
    role: "Chercheur",
    status: "Suspendu",
    joined: "8 Jan 2026",
  },
  {
    name: "Lucas Bernard",
    email: "lucas@startup.io",
    role: "Recruteur",
    status: "Actif",
    joined: "5 Jan 2026",
  },
  {
    name: "Emma Moreau",
    email: "emma@email.com",
    role: "Chercheur",
    status: "Actif",
    joined: "3 Jan 2026",
  },
  {
    name: "Hugo Petit",
    email: "hugo@corp.fr",
    role: "Recruteur",
    status: "Actif",
    joined: "1 Jan 2026",
  },
];

const AdminUsers = () => {
  return (
    <DashboardLayout role="admin" title="Gestion des utilisateurs">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Rechercher par nom ou email..." 
            className="pl-10 h-10 rounded-xl bg-card border-border shadow-sm focus-visible:ring-primary/20" 
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground mr-1 hidden sm:inline-block">Filtrer :</span>
          <Button variant="solid" size="sm" className="rounded-full shadow-sm">
            Tous
          </Button>
          <Button variant="outline" size="sm" className="rounded-full bg-card shadow-sm border-border">
            Recruteurs
          </Button>
          <Button variant="outline" size="sm" className="rounded-full bg-card shadow-sm border-border">
            Candidats
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/80 text-xs font-semibold uppercase text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4">Utilisateur</th>
                <th className="px-6 py-4">Rôle</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Inscrit le</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => (
                <tr
                  key={u.email}
                  className="transition-colors hover:bg-slate-50/50 group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading font-bold text-primary">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {u.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {u.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={u.role === "Recruteur" ? "warning" : "info"}>
                      {u.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={u.status === "Actif" ? "success" : "destructive"}>
                      {u.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground font-medium">
                    {u.joined}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg">
                        <Shield className="h-4 w-4" />
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

export default AdminUsers;
