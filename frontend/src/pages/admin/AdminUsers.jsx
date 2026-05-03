import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Shield, Trash2 } from "lucide-react";

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
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Rechercher un utilisateur..." className="pl-10" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Tous
          </Button>
          <Button variant="outline" size="sm">
            Recruteurs
          </Button>
          <Button variant="outline" size="sm">
            Chercheurs
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                Utilisateur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                Rôle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                Inscrit le
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((u) => (
              <tr
                key={u.email}
                className="hover:bg-secondary/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-heading text-xs font-bold text-primary">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        {u.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {u.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${u.role === "Recruteur" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"}`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${u.status === "Actif" ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"}`}
                  >
                    {u.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {u.joined}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Shield className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
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

export default AdminUsers;
