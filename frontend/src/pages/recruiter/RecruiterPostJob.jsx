import { useState } from "react";
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
import { FileText, Save, CheckCircle2, AlignLeft, Briefcase } from "lucide-react";
import { recruiterJobsApi } from "@/lib/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const RecruiterPostJob = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    contractType: "",
    location: "",
    salaryMin: "",
    salaryMax: "",
    category: "",
    skills: "",
    description: "",
    profileRequired: "",
    benefits: "",
  });

  const updateField = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const saveJob = async (status) => {
    setSaving(true);

    try {
      await recruiterJobsApi.create({
        ...form,
        status,
        skills: form.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      });

      toast.success(status === "draft" ? "Brouillon sauvegardé" : "Offre publiée avec succès");
      navigate("/recruiter/listings");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout role="recruiter" title="Publier une offre">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h2 className="font-heading text-2xl font-bold text-foreground">Créer une annonce</h2>
          <p className="text-muted-foreground mt-2">Remplissez les informations ci-dessous pour attirer les meilleurs talents.</p>
        </div>

        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          
          {/* Basic Info Section */}
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="border-b border-border bg-slate-50/50 p-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold text-foreground">Informations de base</h3>
                <p className="text-xs text-muted-foreground">Les détails essentiels de votre offre</p>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Titre du poste <span className="text-destructive">*</span></Label>
                <Input
                  className="h-11 rounded-xl bg-background"
                  value={form.title}
                  onChange={updateField("title")}
                  placeholder="ex: Développeur Full Stack React/Node.js"
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Type de contrat <span className="text-destructive">*</span></Label>
                  <Select
                    value={form.contractType}
                    onValueChange={(value) =>
                      setForm((current) => ({ ...current, contractType: value }))
                    }
                  >
                    <SelectTrigger className="h-11 rounded-xl bg-background">
                      <SelectValue placeholder="Sélectionner le type" />
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
                  <Label className="text-sm font-semibold">Localisation <span className="text-destructive">*</span></Label>
                  <Input
                    className="h-11 rounded-xl bg-background"
                    value={form.location}
                    onChange={updateField("location")}
                    placeholder="ex: Paris, Hybride"
                  />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Catégorie professionnelle</Label>
                  <Input
                    className="h-11 rounded-xl bg-background"
                    value={form.category}
                    onChange={updateField("category")}
                    placeholder="ex: Tech, Marketing, RH..."
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Fourchette de salaire (annuel bruts)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      className="h-11 rounded-xl bg-background"
                      value={form.salaryMin}
                      onChange={updateField("salaryMin")}
                      placeholder="Min"
                    />
                    <span className="text-muted-foreground">-</span>
                    <Input
                      type="number"
                      className="h-11 rounded-xl bg-background"
                      value={form.salaryMax}
                      onChange={updateField("salaryMax")}
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="border-b border-border bg-slate-50/50 p-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <AlignLeft className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold text-foreground">Détails de l'offre</h3>
                <p className="text-xs text-muted-foreground">Missions, profil et avantages</p>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <Label className="text-sm font-semibold">Description du poste <span className="text-destructive">*</span></Label>
                  <span className="text-xs text-muted-foreground">Soyez clair et précis</span>
                </div>
                <Textarea
                  className="min-h-[160px] resize-y rounded-xl bg-background p-4"
                  value={form.description}
                  onChange={updateField("description")}
                  placeholder="Décrivez les missions principales, l'équipe et le contexte du poste..."
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Profil recherché</Label>
                <Textarea
                  className="min-h-[120px] resize-y rounded-xl bg-background p-4"
                  value={form.profileRequired}
                  onChange={updateField("profileRequired")}
                  placeholder="Années d'expérience, diplômes, soft skills attendues..."
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Compétences clés</Label>
                <Input
                  className="h-11 rounded-xl bg-background"
                  value={form.skills}
                  onChange={updateField("skills")}
                  placeholder="ex: React, Node.js, Agile (séparées par des virgules)"
                />
                <p className="text-xs text-muted-foreground mt-1.5">Les candidats verront ces compétences sous forme de tags.</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Avantages</Label>
                <Textarea
                  className="min-h-[100px] resize-y rounded-xl bg-background p-4"
                  value={form.benefits}
                  onChange={updateField("benefits")}
                  placeholder="Télétravail, Mutuelle, Tickets restaurant..."
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              type="button"
              variant="hero"
              size="lg"
              className="flex-1 rounded-xl h-14 text-base"
              disabled={saving || !form.title || !form.description}
              onClick={() => saveJob("active")}
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                  Publication...
                </span>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-5 w-5" /> Publier l'offre
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="sm:w-1/3 rounded-xl h-14 bg-card hover:bg-secondary border-border"
              disabled={saving}
              onClick={() => saveJob("draft")}
            >
              <Save className="mr-2 h-5 w-5 text-muted-foreground" /> Sauvegarder brouillon
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default RecruiterPostJob;
