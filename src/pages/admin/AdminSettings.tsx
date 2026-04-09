import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const AdminSettings = () => {
  return (
    <DashboardLayout role="admin" title="Paramètres">
      <div className="max-w-2xl space-y-8">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold text-foreground">Général</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nom de la plateforme</Label>
              <Input defaultValue="RecrutPro" />
            </div>
            <div className="space-y-2">
              <Label>Email de contact</Label>
              <Input defaultValue="admin@recrutpro.com" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold text-foreground">Modération</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-foreground">Validation manuelle des offres</div>
                <div className="text-xs text-muted-foreground">Les offres doivent être approuvées avant publication</div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-foreground">Notifications par email</div>
                <div className="text-xs text-muted-foreground">Recevoir un email pour chaque nouvelle offre</div>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        <Button variant="hero">Sauvegarder</Button>
      </div>
    </DashboardLayout>
  );
};

export default AdminSettings;
