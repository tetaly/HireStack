import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, Plus, Trash2, MapPin, Search } from "lucide-react";

const alerts = [
  { keyword: "Développeur React", location: "Paris", frequency: "Quotidien" },
  { keyword: "Full Stack", location: "Télétravail", frequency: "Hebdomadaire" },
  { keyword: "Frontend TypeScript", location: "Lyon", frequency: "Quotidien" },
];

const SeekerAlerts = () => {
  return (
    <DashboardLayout role="seeker" title="Alertes emploi">
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground">Gérer vos alertes</h2>
          <p className="text-muted-foreground mt-1">Soyez le premier informé des nouvelles offres correspondant à votre profil.</p>
        </div>

        {/* Create new alert */}
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="border-b border-border bg-slate-50/50 p-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground">Créer une alerte</h3>
              <p className="text-xs text-muted-foreground">Définissez vos critères de recherche</p>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Mots-clés ou poste</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="ex: Développeur Python" className="pl-9 h-11 rounded-xl bg-background" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Localisation</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="ex: Paris, Télétravail" className="pl-9 h-11 rounded-xl bg-background" />
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-secondary/30">
              <div className="space-y-0.5">
                <div className="text-base font-semibold text-foreground">
                  Notifications par email
                </div>
                <div className="text-sm text-muted-foreground">
                  Recevez un résumé des nouvelles offres directement dans votre boîte de réception.
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Button variant="hero" className="w-full sm:w-auto rounded-xl h-11 px-8">
              <Plus className="mr-2 h-4 w-4" /> Enregistrer l'alerte
            </Button>
          </div>
        </div>

        {/* Existing alerts */}
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="border-b border-border bg-slate-50/50 p-5 flex justify-between items-center">
            <h3 className="font-heading text-lg font-semibold text-foreground">Mes alertes actives ({alerts.length})</h3>
          </div>
          
          <div className="divide-y divide-border">
            {alerts.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <Bell className="mx-auto h-8 w-8 mb-3 opacity-20" />
                <p>Vous n'avez pas encore d'alertes actives.</p>
              </div>
            ) : (
              alerts.map((a, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 transition-colors hover:bg-slate-50/50 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Bell className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground text-base group-hover:text-primary transition-colors">
                        {a.keyword}
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground font-medium">
                        <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {a.location}</span>
                        <span className="h-1 w-1 rounded-full bg-border"></span>
                        <span>{a.frequency}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 sm:border-l sm:border-border sm:pl-6 pt-4 sm:pt-0 border-t border-border sm:border-t-0 justify-between sm:justify-start w-full sm:w-auto">
                    <div className="flex items-center gap-2">
                      <Switch defaultChecked id={`switch-${index}`} />
                      <Label htmlFor={`switch-${index}`} className="text-sm text-muted-foreground cursor-pointer">Active</Label>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SeekerAlerts;
