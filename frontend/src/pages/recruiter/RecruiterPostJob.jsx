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

      toast.success(status === "draft" ? "Brouillon sauvegarde" : "Offre publiee");
      navigate("/recruiter/listings");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

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
              <Input
                value={form.title}
                onChange={updateField("title")}
                placeholder="ex: Développeur Full Stack React/Node.js"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type de contrat</Label>
                <Select
                  value={form.contractType}
                  onValueChange={(value) =>
                    setForm((current) => ({ ...current, contractType: value }))
                  }
                >
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
                <Input
                  value={form.location}
                  onChange={updateField("location")}
                  placeholder="ex: Paris, Télétravail"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Salaire min (€)</Label>
                <Input
                  type="number"
                  value={form.salaryMin}
                  onChange={updateField("salaryMin")}
                  placeholder="40000"
                />
              </div>
              <div className="space-y-2">
                <Label>Salaire max (€)</Label>
                <Input
                  type="number"
                  value={form.salaryMax}
                  onChange={updateField("salaryMax")}
                  placeholder="55000"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Catégorie</Label>
                <Input
                  value={form.category}
                  onChange={updateField("category")}
                  placeholder="Tech, Design, Marketing..."
                />
              </div>
              <div className="space-y-2">
                <Label>Compétences</Label>
                <Input
                  value={form.skills}
                  onChange={updateField("skills")}
                  placeholder="React, Symfony, SQL"
                />
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
                value={form.description}
                onChange={updateField("description")}
                placeholder="Décrivez le poste, les responsabilités..."
              />
            </div>
            <div className="space-y-2">
              <Label>Profil recherché</Label>
              <Textarea
                rows={4}
                value={form.profileRequired}
                onChange={updateField("profileRequired")}
                placeholder="Compétences requises, expérience..."
              />
            </div>
            <div className="space-y-2">
              <Label>Avantages</Label>
              <Textarea
                rows={3}
                value={form.benefits}
                onChange={updateField("benefits")}
                placeholder="Télétravail, tickets restaurant, mutuelle..."
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="hero"
              size="lg"
              disabled={saving}
              onClick={() => saveJob("active")}
            >
              {saving ? "Sauvegarde..." : "Publier l'offre"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              disabled={saving}
              onClick={() => saveJob("draft")}
            >
              Sauvegarder brouillon
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default RecruiterPostJob;
