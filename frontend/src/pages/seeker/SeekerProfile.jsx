import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Briefcase, Plus } from "lucide-react";

const SeekerProfile = () => {
  return (
    <DashboardLayout role="seeker" title="Mon profil">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Photo + basic info */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 font-heading text-2xl font-bold text-primary">
                JD
              </div>
              <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="font-heading text-lg font-semibold text-foreground">
                Jean Dupont
              </h2>
              <p className="text-sm text-muted-foreground">
                Développeur Full Stack · Paris
              </p>
              <div className="mt-2 flex gap-2">
                <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                  Disponible
                </span>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                  5 ans d'expérience
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Personal info */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h3 className="font-heading text-base font-semibold text-foreground">
            Informations personnelles
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Prénom</Label>
              <Input defaultValue="Jean" />
            </div>
            <div className="space-y-2">
              <Label>Nom</Label>
              <Input defaultValue="Dupont" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input defaultValue="jean.dupont@email.com" />
          </div>
          <div className="space-y-2">
            <Label>Téléphone</Label>
            <Input defaultValue="+33 6 12 34 56 78" />
          </div>
          <div className="space-y-2">
            <Label>Localisation</Label>
            <Input defaultValue="Paris, France" />
          </div>
        </div>

        {/* Bio */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h3 className="font-heading text-base font-semibold text-foreground">
            À propos
          </h3>
          <Textarea
            rows={4}
            defaultValue="Développeur passionné avec 5 ans d'expérience en React, Node.js et TypeScript. Je recherche des projets innovants dans le secteur tech."
          />
        </div>

        {/* Skills */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-semibold text-foreground">
              Compétences
            </h3>
            <Button variant="ghost" size="sm">
              <Plus className="mr-1 h-3.5 w-3.5" /> Ajouter
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "React",
              "TypeScript",
              "Node.js",
              "Python",
              "PostgreSQL",
              "Docker",
              "AWS",
              "Figma",
            ].map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-semibold text-foreground">
              Expérience
            </h3>
            <Button variant="ghost" size="sm">
              <Plus className="mr-1 h-3.5 w-3.5" /> Ajouter
            </Button>
          </div>
          {[
            {
              role: "Développeur Full Stack",
              company: "TechStartup SAS",
              period: "2023 - Présent",
              desc: "Développement d'une plateforme SaaS B2B en React/Node.js",
            },
            {
              role: "Développeur Frontend",
              company: "WebAgency",
              period: "2021 - 2023",
              desc: "Création d'interfaces utilisateur pour clients grands comptes",
            },
          ].map((exp) => (
            <div
              key={exp.role + exp.company}
              className="flex gap-3 border-l-2 border-primary/20 pl-4"
            >
              <div>
                <div className="text-sm font-medium text-foreground">
                  {exp.role}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Briefcase className="h-3 w-3" /> {exp.company} · {exp.period}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{exp.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <Button variant="hero" size="lg">
          Sauvegarder le profil
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default SeekerProfile;
