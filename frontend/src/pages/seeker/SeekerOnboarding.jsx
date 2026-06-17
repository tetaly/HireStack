import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { authStorage, seekerProfileApi } from "@/lib/api";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

const emptyExperience = {
  title: "",
  companyName: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  description: "",
};

const emptyEducation = {
  degree: "",
  schoolName: "",
  fieldOfStudy: "",
  startYear: "",
  endYear: "",
  description: "",
};

const steps = ["Profil", "Compétences", "Expériences", "Études"];

const SeekerOnboarding = () => {
  const navigate = useNavigate();
  const user = authStorage.getUser();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    headline: "",
    location: "",
    yearsExperience: "",
    bio: "",
  });
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([{ ...emptyExperience }]);
  const [educations, setEducations] = useState([{ ...emptyEducation }]);

  const updateProfile = (field) => (event) => {
    setProfile((current) => ({ ...current, [field]: event.target.value }));
  };

  const addSkill = () => {
    const value = skillInput.trim();

    if (!value || skills.includes(value)) {
      return;
    }

    setSkills((current) => [...current, value]);
    setSkillInput("");
  };

  const updateListItem = (setter, index, field, value) => {
    setter((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    );
  };

  const removeListItem = (setter, index) => {
    setter((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const saveProfile = async () => {
    setSaving(true);

    try {
      const data = await seekerProfileApi.update({
        profile,
        skills,
        experiences: experiences.filter((item) => item.title.trim()),
        educations: educations.filter((item) => item.degree.trim()),
      });

      authStorage.setSession({
        token: authStorage.getToken(),
        user: data.user,
      });
      toast.success("Profil complete avec succes");
      navigate("/seeker/profile", { replace: true });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout role="seeker" title="Completer mon profil">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-6 flex items-center justify-between gap-2">
            {steps.map((label, index) => (
              <button
                key={label}
                type="button"
                onClick={() => setStep(index)}
                className={`h-9 flex-1 rounded-md text-xs font-medium ${
                  step === index
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {step === 0 && (
            <div className="space-y-4">
              <div>
                <h2 className="font-heading text-lg font-semibold text-foreground">
                  Bonjour {user?.firstName}, presentez votre profil
                </h2>
                <p className="text-sm text-muted-foreground">
                  Ces informations seront affichees sur votre page profil.
                </p>
              </div>
              <div className="space-y-2">
                <Label>Titre professionnel</Label>
                <Input
                  placeholder="ex: Développeur Full Stack"
                  value={profile.headline}
                  onChange={updateProfile("headline")}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Localisation</Label>
                  <Input
                    placeholder="ex: Paris, France"
                    value={profile.location}
                    onChange={updateProfile("location")}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Années d'expérience</Label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="ex: 3"
                    value={profile.yearsExperience}
                    onChange={updateProfile("yearsExperience")}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>À propos</Label>
                <Textarea
                  rows={5}
                  placeholder="Resumez votre parcours et ce que vous recherchez."
                  value={profile.bio}
                  onChange={updateProfile("bio")}
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-heading text-lg font-semibold text-foreground">
                Vos compétences
              </h2>
              <div className="flex gap-2">
                <Input
                  placeholder="ex: React, Symfony, SQL"
                  value={skillInput}
                  onChange={(event) => setSkillInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addSkill();
                    }
                  }}
                />
                <Button type="button" onClick={addSkill}>
                  <Plus className="mr-2 h-4 w-4" /> Ajouter
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() =>
                      setSkills((current) => current.filter((item) => item !== skill))
                    }
                    className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-lg font-semibold text-foreground">
                  Vos expériences
                </h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setExperiences((current) => [...current, { ...emptyExperience }])
                  }
                >
                  <Plus className="mr-2 h-4 w-4" /> Ajouter
                </Button>
              </div>
              {experiences.map((experience, index) => (
                <div key={index} className="space-y-3 rounded-lg border border-border p-4">
                  <div className="flex justify-end">
                    {experiences.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeListItem(setExperiences, index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input
                      placeholder="Poste"
                      value={experience.title}
                      onChange={(event) =>
                        updateListItem(setExperiences, index, "title", event.target.value)
                      }
                    />
                    <Input
                      placeholder="Entreprise"
                      value={experience.companyName}
                      onChange={(event) =>
                        updateListItem(
                          setExperiences,
                          index,
                          "companyName",
                          event.target.value,
                        )
                      }
                    />
                    <Input
                      type="date"
                      value={experience.startDate}
                      onChange={(event) =>
                        updateListItem(
                          setExperiences,
                          index,
                          "startDate",
                          event.target.value,
                        )
                      }
                    />
                    <Input
                      type="date"
                      value={experience.endDate}
                      onChange={(event) =>
                        updateListItem(setExperiences, index, "endDate", event.target.value)
                      }
                    />
                  </div>
                  <Textarea
                    rows={3}
                    placeholder="Description"
                    value={experience.description}
                    onChange={(event) =>
                      updateListItem(
                        setExperiences,
                        index,
                        "description",
                        event.target.value,
                      )
                    }
                  />
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-lg font-semibold text-foreground">
                  Vos études
                </h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setEducations((current) => [...current, { ...emptyEducation }])
                  }
                >
                  <Plus className="mr-2 h-4 w-4" /> Ajouter
                </Button>
              </div>
              {educations.map((education, index) => (
                <div key={index} className="space-y-3 rounded-lg border border-border p-4">
                  <div className="flex justify-end">
                    {educations.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeListItem(setEducations, index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input
                      placeholder="Diplôme"
                      value={education.degree}
                      onChange={(event) =>
                        updateListItem(setEducations, index, "degree", event.target.value)
                      }
                    />
                    <Input
                      placeholder="École"
                      value={education.schoolName}
                      onChange={(event) =>
                        updateListItem(
                          setEducations,
                          index,
                          "schoolName",
                          event.target.value,
                        )
                      }
                    />
                    <Input
                      placeholder="Domaine"
                      value={education.fieldOfStudy}
                      onChange={(event) =>
                        updateListItem(
                          setEducations,
                          index,
                          "fieldOfStudy",
                          event.target.value,
                        )
                      }
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder="Début"
                        value={education.startYear}
                        onChange={(event) =>
                          updateListItem(
                            setEducations,
                            index,
                            "startYear",
                            event.target.value,
                          )
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Fin"
                        value={education.endYear}
                        onChange={(event) =>
                          updateListItem(
                            setEducations,
                            index,
                            "endYear",
                            event.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                  <Textarea
                    rows={3}
                    placeholder="Description"
                    value={education.description}
                    onChange={(event) =>
                      updateListItem(
                        setEducations,
                        index,
                        "description",
                        event.target.value,
                      )
                    }
                  />
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex justify-between">
            <Button
              type="button"
              variant="outline"
              disabled={step === 0}
              onClick={() => setStep((current) => current - 1)}
            >
              Retour
            </Button>
            {step < steps.length - 1 ? (
              <Button type="button" onClick={() => setStep((current) => current + 1)}>
                Continuer
              </Button>
            ) : (
              <Button type="button" disabled={saving} onClick={saveProfile}>
                {saving ? "Sauvegarde..." : "Terminer"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SeekerOnboarding;
