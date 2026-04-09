import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, Plus, Trash2 } from "lucide-react";

const alerts = [
  { keyword: "Développeur React", location: "Paris", frequency: "Quotidien" },
  { keyword: "Full Stack", location: "Télétravail", frequency: "Hebdomadaire" },
  { keyword: "Frontend TypeScript", location: "Lyon", frequency: "Quotidien" },
];

const SeekerAlerts = () => {
  return (
    <DashboardLayout role="seeker" title="Alertes emploi">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Create new alert */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
            <Bell className="h-5 w-5 text-primary" /> Créer une alerte
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Mot-clé</Label>
              <Input placeholder="ex: Développeur Python" />
            </div>
            <div className="space-y-2">
              <Label>Localisation</Label>
              <Input placeholder="ex: Paris, Télétravail" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-foreground">Notifications par email</div>
              <div className="text-xs text-muted-foreground">Recevez les nouvelles offres par email</div>
            </div>
            <Switch defaultChecked />
          </div>
          <Button variant="hero" size="sm"><Plus className="mr-1 h-4 w-4" /> Créer l'alerte</Button>
        </div>

        {/* Existing alerts */}
        <div>
          <h2 className="mb-4 font-heading text-lg font-semibold text-foreground">Mes alertes actives</h2>
          <div className="space-y-3">
            {alerts.map((a) => (
              <div key={a.keyword} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
                <div>
                  <div className="text-sm font-medium text-foreground">{a.keyword}</div>
                  <div className="text-xs text-muted-foreground">{a.location} · {a.frequency}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch defaultChecked />
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SeekerAlerts;
