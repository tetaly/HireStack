import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RecruiterPostJob = () => {
  return (
    <DashboardLayout role="recruiter" title="Publier une offre">
      <div className="mx-auto max-w-2xl">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h2 className="font-heading text-lg font-semibold text-foreground">
              Informations de l'offre
            </h2>
            <div className="space-y-2">
              <Label>Titre du poste</Label>
              <Input placeholder="ex: Développeur Full Stack React/Node.js" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type de contrat</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cdi">CDI</SelectItem>
                    <SelectItem value="cdd">CDD</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="stage">Stage</SelectItem>
                    <SelectItem value="alternance">Alternance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Localisation</Label>
                <Input placeholder="ex: Paris, Télétravail" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Salaire min (€)</Label>
                <Input type="number" placeholder="40000" />
              </div>
              <div className="space-y-2">
                <Label>Salaire max (€)</Label>
                <Input type="number" placeholder="55000" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h2 className="font-heading text-lg font-semibold text-foreground">
              Description
            </h2>
            <div className="space-y-2">
              <Label>Description du poste</Label>
              <Textarea
                rows={6}
                placeholder="Décrivez le poste, les responsabilités..."
              />
            </div>
            <div className="space-y-2">
              <Label>Profil recherché</Label>
              <Textarea
                rows={4}
                placeholder="Compétences requises, expérience..."
              />
            </div>
            <div className="space-y-2">
              <Label>Avantages</Label>
              <Textarea
                rows={3}
                placeholder="Télétravail, tickets restaurant, mutuelle..."
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="hero" size="lg">
              Publier l'offre
            </Button>
            <Button variant="outline" size="lg">
              Sauvegarder brouillon
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default RecruiterPostJob;
