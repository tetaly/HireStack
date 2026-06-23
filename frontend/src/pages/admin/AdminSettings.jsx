import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, Globe, Shield, Bell, Mail } from "lucide-react";
import { toast } from "sonner";

const AdminSettings = () => {
  const handleSave = () => {
    toast.success("Paramètres sauvegardés avec succès");
  };

  return (
    <DashboardLayout role="admin" title="Paramètres">
      <div className="max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Configuration de la plateforme</h2>
            <p className="text-sm text-muted-foreground mt-1">Gérez les paramètres globaux de HireStack</p>
          </div>
          <Button variant="hero" onClick={handleSave} className="hidden sm:flex rounded-xl">
            <Save className="mr-2 h-4 w-4" />
            Enregistrer les modifications
          </Button>
        </div>

        <div className="space-y-6">
          {/* General Section */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="border-b border-border bg-slate-50/50 p-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold text-foreground">Général</h3>
                <p className="text-xs text-muted-foreground">Informations de base de la plateforme</p>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Nom de la plateforme</Label>
                  <Input defaultValue="HireStack" className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Email de contact principal</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input defaultValue="contact@hirestack.com" className="pl-9 h-11 rounded-xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Moderation Section */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="border-b border-border bg-slate-50/50 p-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold text-foreground">Modération & Sécurité</h3>
                <p className="text-xs text-muted-foreground">Règles de validation et sécurité</p>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between rounded-xl border border-border p-4 bg-secondary/30">
                <div className="space-y-0.5">
                  <Label className="text-base font-semibold">Validation manuelle des offres</Label>
                  <p className="text-sm text-muted-foreground">
                    Les nouvelles offres doivent être approuvées par un administrateur avant publication.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between rounded-xl border border-border p-4 bg-secondary/30">
                <div className="space-y-0.5">
                  <Label className="text-base font-semibold">Vérification des entreprises</Label>
                  <p className="text-sm text-muted-foreground">
                    Obliger les recruteurs à vérifier leur domaine d'entreprise.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="border-b border-border bg-slate-50/50 p-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold text-foreground">Notifications système</h3>
                <p className="text-xs text-muted-foreground">Alertes et rapports par email</p>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium text-foreground">Alertes de nouvelles offres</Label>
                  <p className="text-sm text-muted-foreground">Recevoir un email lorsqu'une offre nécessite une validation</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="h-px bg-border w-full" />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium text-foreground">Rapport hebdomadaire</Label>
                  <p className="text-sm text-muted-foreground">Recevoir un résumé des statistiques de la semaine</p>
                </div>
                <Switch />
              </div>
            </div>
          </div>
          
          <div className="flex sm:hidden justify-end">
            <Button variant="hero" onClick={handleSave} className="w-full rounded-xl h-12">
              <Save className="mr-2 h-4 w-4" />
              Enregistrer
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminSettings;
