import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Plus, Trash2 } from "lucide-react";
import { authStorage, seekerProfileApi } from "@/lib/api";
import { toast } from "sonner";

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

const SeekerProfile = () => {
  const user = authStorage.getUser();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    headline: "",
    location: "",
    yearsExperience: "",
    bio: "",
  });
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);
  const firstName = user?.firstName ?? "";
  const lastName = user?.lastName ?? "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || "Mon profil";
  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "U";

  useEffect(() => {
    let active = true;

    seekerProfileApi
      .get()
      .then((profileData) => {
        if (active) {
          setData(profileData);
          setForm({
            firstName: profileData.user?.firstName ?? "",
            lastName: profileData.user?.lastName ?? "",
            email: profileData.user?.email ?? "",
            phone: profileData.user?.phone ?? "",
            headline: profileData.profile?.headline ?? "",
            location: profileData.profile?.location ?? "",
            yearsExperience: profileData.profile?.yearsExperience ?? "",
            bio: profileData.profile?.bio ?? "",
          });
          setSkills(profileData.skills ?? []);
          setExperiences(profileData.experiences ?? []);
          setEducations(profileData.educations ?? []);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const profileUser = data?.user ?? user;
  const avatarUrl = profileUser?.avatarUrl;

  const updateField = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const addSkill = () => {
    const value = skillInput.trim();

    if (!value) {
      return;
    }

    if (skills.some((skill) => skill.toLowerCase() === value.toLowerCase())) {
      setSkillInput("");
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

  const buildProfilePayload = (avatarUrlValue = avatarUrl) => ({
    user: {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      avatarUrl: avatarUrlValue,
    },
    profile: {
      headline: form.headline,
      location: form.location,
      yearsExperience: form.yearsExperience,
      bio: form.bio,
    },
    skills,
    experiences,
    educations,
  });

  const applyUpdatedProfile = (updated) => {
    setData(updated);
    setForm({
      firstName: updated.user?.firstName ?? "",
      lastName: updated.user?.lastName ?? "",
      email: updated.user?.email ?? "",
      phone: updated.user?.phone ?? "",
      headline: updated.profile?.headline ?? "",
      location: updated.profile?.location ?? "",
      yearsExperience: updated.profile?.yearsExperience ?? "",
      bio: updated.profile?.bio ?? "",
    });
    authStorage.setSession({
      token: authStorage.getToken(),
      user: updated.user,
    });
  };

  const saveProfileInfo = async () => {
    setSaving(true);

    try {
      const updated = await seekerProfileApi.update(buildProfilePayload());

      applyUpdatedProfile(updated);
      toast.success("Profil mis a jour");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const saveAvatar = async (avatarDataUrl) => {
    try {
      const updated = await seekerProfileApi.update(buildProfilePayload(avatarDataUrl));

      applyUpdatedProfile(updated);
      toast.success("Image de profil mise a jour");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez choisir une image.");
      return;
    }

    if (file.size > 1024 * 1024) {
      toast.error("L'image doit faire moins de 1 Mo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => saveAvatar(String(reader.result));
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  return (
    <DashboardLayout role="seeker" title="Mon profil">
      <div className="mx-auto max-w-2xl space-y-6">
        {loading && (
          <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
            Chargement du profil...
          </div>
        )}

        {/* Photo + basic info */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 font-heading text-2xl font-bold text-primary">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
              <label className="absolute -bottom-1 -right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Camera className="h-3.5 w-3.5" />
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            <div className="flex-1">
              <h2 className="font-heading text-lg font-semibold text-foreground">
                {[form.firstName, form.lastName].filter(Boolean).join(" ") ||
                  fullName}
              </h2>
              <p className="text-sm text-muted-foreground">
                {[form.headline, form.location].filter(Boolean).join(" · ") ||
                  user?.email}
              </p>
              <div className="mt-2 flex gap-2">
                <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                  Disponible
                </span>
                {form.yearsExperience !== "" &&
                  form.yearsExperience !== null &&
                  form.yearsExperience !== undefined && (
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                      {form.yearsExperience} ans d'expérience
                    </span>
                  )}
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
              <Input value={form.firstName} onChange={updateField("firstName")} />
            </div>
            <div className="space-y-2">
              <Label>Nom</Label>
              <Input value={form.lastName} onChange={updateField("lastName")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={form.email} onChange={updateField("email")} />
          </div>
          <div className="space-y-2">
            <Label>Téléphone</Label>
            <Input
              value={form.phone}
              onChange={updateField("phone")}
              placeholder="+33 6 12 34 56 78"
            />
          </div>
          <div className="space-y-2">
            <Label>Titre professionnel</Label>
            <Input
              value={form.headline}
              onChange={updateField("headline")}
              placeholder="Développeur Full Stack"
            />
          </div>
          <div className="space-y-2">
            <Label>Localisation</Label>
            <Input
              value={form.location}
              onChange={updateField("location")}
              placeholder="Paris, France"
            />
          </div>
          <div className="space-y-2">
            <Label>Années d'expérience</Label>
            <Input
              type="number"
              min="0"
              value={form.yearsExperience}
              onChange={updateField("yearsExperience")}
              placeholder="3"
            />
          </div>
        </div>

        {/* Bio */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h3 className="font-heading text-base font-semibold text-foreground">
            À propos
          </h3>
          <Textarea
            rows={4}
            value={form.bio}
            onChange={updateField("bio")}
            placeholder="Presentez votre parcours, vos competences et le type d'opportunite recherchee."
          />
        </div>

        <Button variant="hero" size="lg" disabled={saving} onClick={saveProfileInfo}>
          {saving ? "Sauvegarde..." : "Sauvegarder le profil"}
        </Button>

        {/* Skills */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-semibold text-foreground">
              Compétences
            </h3>
          </div>
          <div className="flex gap-2">
            <Input
              value={skillInput}
              onChange={(event) => setSkillInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addSkill();
                }
              }}
              placeholder="ex: React, Symfony, SQL"
            />
            <Button type="button" variant="outline" onClick={addSkill}>
              <Plus className="mr-2 h-4 w-4" /> Ajouter
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Aucune competence ajoutee.
              </p>
            )}
            {skills.map((skill) => (
              <button
                type="button"
                key={skill}
                className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                onClick={() =>
                  setSkills((current) => current.filter((item) => item !== skill))
                }
              >
                {skill} ×
              </button>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-semibold text-foreground">
              Expérience
            </h3>
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
          {experiences.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Aucune experience ajoutee.
            </p>
          )}
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="space-y-3 rounded-lg border border-border p-4"
            >
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeListItem(setExperiences, index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Poste</Label>
                  <Input
                    value={exp.title ?? ""}
                    onChange={(event) =>
                      updateListItem(setExperiences, index, "title", event.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Entreprise</Label>
                  <Input
                    value={exp.companyName ?? ""}
                    onChange={(event) =>
                      updateListItem(
                        setExperiences,
                        index,
                        "companyName",
                        event.target.value,
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date début</Label>
                  <Input
                    type="date"
                    value={exp.startDate ?? ""}
                    onChange={(event) =>
                      updateListItem(
                        setExperiences,
                        index,
                        "startDate",
                        event.target.value,
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date fin</Label>
                  <Input
                    type="date"
                    value={exp.endDate ?? ""}
                    disabled={Boolean(exp.isCurrent)}
                    onChange={(event) =>
                      updateListItem(setExperiences, index, "endDate", event.target.value)
                    }
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={Boolean(exp.isCurrent)}
                  onChange={(event) =>
                    updateListItem(
                      setExperiences,
                      index,
                      "isCurrent",
                      event.target.checked,
                    )
                  }
                />
                Poste actuel
              </label>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  rows={3}
                  value={exp.description ?? ""}
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
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-semibold text-foreground">
              Études
            </h3>
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
          {educations.length === 0 && (
            <p className="text-sm text-muted-foreground">Aucune etude ajoutee.</p>
          )}
          {educations.map((education, index) => (
            <div key={index} className="space-y-3 rounded-lg border border-border p-4">
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeListItem(setEducations, index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Diplôme</Label>
                  <Input
                    value={education.degree ?? ""}
                    onChange={(event) =>
                      updateListItem(setEducations, index, "degree", event.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>École</Label>
                  <Input
                    value={education.schoolName ?? ""}
                    onChange={(event) =>
                      updateListItem(
                        setEducations,
                        index,
                        "schoolName",
                        event.target.value,
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Domaine</Label>
                  <Input
                    value={education.fieldOfStudy ?? ""}
                    onChange={(event) =>
                      updateListItem(
                        setEducations,
                        index,
                        "fieldOfStudy",
                        event.target.value,
                      )
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>Début</Label>
                    <Input
                      type="number"
                      value={education.startYear ?? ""}
                      onChange={(event) =>
                        updateListItem(
                          setEducations,
                          index,
                          "startYear",
                          event.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Fin</Label>
                    <Input
                      type="number"
                      value={education.endYear ?? ""}
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
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  rows={3}
                  value={education.description ?? ""}
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
            </div>
          ))}
        </div>

        <Button variant="hero" size="lg" disabled={saving} onClick={saveProfileInfo}>
          {saving ? "Sauvegarde..." : "Sauvegarder toutes les modifications"}
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default SeekerProfile;
