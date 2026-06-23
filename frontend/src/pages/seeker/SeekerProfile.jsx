import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Plus, Trash2, UserCircle, Briefcase, GraduationCap, Code2, Save, Download, Globe, Sparkles } from "lucide-react";
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
  const [generatingCv, setGeneratingCv] = useState(false);
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
      toast.success("Profil mis à jour avec succès");
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
      toast.success("Image de profil mise à jour");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const downloadGeneratedCv = (blob) => {
    const filenameBase = [form.firstName, form.lastName]
      .filter(Boolean)
      .join("-")
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-") || "cv";
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${filenameBase}-cv.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateCv = async () => {
    setGeneratingCv(true);

    try {
      const pdf = await seekerProfileApi.generateCvPdf();

      downloadGeneratedCv(pdf);
      toast.success("CV PDF généré");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setGeneratingCv(false);
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

  if (loading) {
    return (
      <DashboardLayout role="seeker" title="Mon profil">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="h-48 rounded-2xl border border-border bg-card/50 animate-pulse"></div>
          <div className="h-96 rounded-2xl border border-border bg-card/50 animate-pulse"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="seeker" title="Mon profil">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground">Éditer le profil</h2>
            <p className="text-muted-foreground mt-1">Gérez vos informations personnelles et votre CV numérique.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl shadow-sm border-border bg-card hover:bg-secondary">
              <Globe className="mr-2 h-4 w-4 text-muted-foreground" /> Voir profil public
            </Button>
            <Button variant="hero" disabled={saving} onClick={saveProfileInfo} className="rounded-xl shadow-sm">
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Sauvegarde..." : "Enregistrer"}
            </Button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* LinkedIn-style Cover & Avatar Card */}
            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden relative">
              <div className="h-32 bg-gradient-to-r from-primary/80 to-blue-400"></div>
              <div className="px-6 pb-6">
                <div className="relative flex justify-between items-end -mt-12 mb-4">
                  <div className="relative">
                    <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-card bg-card font-heading text-3xl font-bold text-primary shadow-sm overflow-hidden">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={fullName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                          {initials}
                        </div>
                      )}
                    </div>
                    <label className="absolute -bottom-2 -right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl bg-background border border-border shadow-sm text-foreground hover:bg-secondary transition-colors">
                      <Camera className="h-4 w-4" />
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-lg h-9"
                    disabled={generatingCv}
                    onClick={generateCv}
                  >
                    {generatingCv ? (
                      <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                    ) : (
                      <Download className="mr-2 h-4 w-4" />
                    )}
                    {generatingCv ? "Génération..." : "Générer CV IA"}
                  </Button>
                </div>
                
                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground">
                    {[form.firstName, form.lastName].filter(Boolean).join(" ") || fullName}
                  </h2>
                  <p className="text-lg text-foreground mt-1 font-medium">
                    {form.headline || "Titre professionnel"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {[form.location, form.email].filter(Boolean).join(" · ")}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-lg bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-600 border border-emerald-500/20">
                      À l'écoute d'opportunités
                    </span>
                    {form.yearsExperience && (
                      <span className="rounded-lg bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground border border-border">
                        {form.yearsExperience} ans d'expérience
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* About / Bio */}
            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="border-b border-border bg-slate-50/50 p-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <UserCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-foreground">À propos</h3>
                  <p className="text-xs text-muted-foreground">Présentez-vous en quelques lignes</p>
                </div>
              </div>
              <div className="p-6">
                <Textarea
                  rows={5}
                  value={form.bio}
                  onChange={updateField("bio")}
                  className="rounded-xl resize-y bg-background"
                  placeholder="Décrivez votre parcours, vos ambitions et le type d'opportunité recherchée..."
                />
              </div>
            </div>

            {/* Experience Timeline */}
            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="border-b border-border bg-slate-50/50 p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-foreground">Expérience</h3>
                    <p className="text-xs text-muted-foreground">Votre parcours professionnel</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  onClick={() => setExperiences((current) => [{ ...emptyExperience }, ...current])}
                >
                  <Plus className="mr-1 h-4 w-4" /> Ajouter
                </Button>
              </div>
              <div className="p-6 space-y-6">
                {experiences.length === 0 && (
                  <div className="text-center p-6 border-2 border-dashed border-border rounded-xl">
                    <p className="text-sm text-muted-foreground mb-4">Aucune expérience ajoutée.</p>
                    <Button variant="outline" onClick={() => setExperiences([{ ...emptyExperience }])}>
                      Ajouter une expérience
                    </Button>
                  </div>
                )}
                {experiences.map((exp, index) => (
                  <div key={index} className="relative pl-6 pb-6 border-l-2 border-border last:border-0 last:pb-0">
                    <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary ring-4 ring-card"></div>
                    <div className="space-y-4 rounded-xl border border-border bg-secondary/20 p-5 ml-2">
                      <div className="flex justify-between items-start">
                        <div className="space-y-3 flex-1 mr-4">
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div className="space-y-1.5">
                              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Poste</Label>
                              <Input className="h-9 rounded-lg bg-background" value={exp.title ?? ""} onChange={(e) => updateListItem(setExperiences, index, "title", e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Entreprise</Label>
                              <Input className="h-9 rounded-lg bg-background" value={exp.companyName ?? ""} onChange={(e) => updateListItem(setExperiences, index, "companyName", e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date début</Label>
                              <Input type="date" className="h-9 rounded-lg bg-background" value={exp.startDate ?? ""} onChange={(e) => updateListItem(setExperiences, index, "startDate", e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                              <div className="flex justify-between items-center">
                                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date fin</Label>
                                <label className="flex items-center gap-1.5 text-xs text-foreground font-medium cursor-pointer">
                                  <input type="checkbox" checked={Boolean(exp.isCurrent)} className="rounded border-border text-primary focus:ring-primary/20" onChange={(e) => updateListItem(setExperiences, index, "isCurrent", e.target.checked)} />
                                  Poste actuel
                                </label>
                              </div>
                              <Input type="date" className="h-9 rounded-lg bg-background" value={exp.endDate ?? ""} disabled={Boolean(exp.isCurrent)} onChange={(e) => updateListItem(setExperiences, index, "endDate", e.target.value)} />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Description</Label>
                            <Textarea rows={3} className="rounded-lg bg-background resize-y text-sm" value={exp.description ?? ""} onChange={(e) => updateListItem(setExperiences, index, "description", e.target.value)} />
                          </div>
                        </div>
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive shrink-0" onClick={() => removeListItem(setExperiences, index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education Timeline */}
            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="border-b border-border bg-slate-50/50 p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-foreground">Formation</h3>
                    <p className="text-xs text-muted-foreground">Vos diplômes et études</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  onClick={() => setEducations((current) => [{ ...emptyEducation }, ...current])}
                >
                  <Plus className="mr-1 h-4 w-4" /> Ajouter
                </Button>
              </div>
              <div className="p-6 space-y-6">
                {educations.length === 0 && (
                  <div className="text-center p-6 border-2 border-dashed border-border rounded-xl">
                    <p className="text-sm text-muted-foreground mb-4">Aucune formation ajoutée.</p>
                    <Button variant="outline" onClick={() => setEducations([{ ...emptyEducation }])}>
                      Ajouter une formation
                    </Button>
                  </div>
                )}
                {educations.map((edu, index) => (
                  <div key={index} className="relative pl-6 pb-6 border-l-2 border-border last:border-0 last:pb-0">
                    <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary ring-4 ring-card"></div>
                    <div className="space-y-4 rounded-xl border border-border bg-secondary/20 p-5 ml-2">
                      <div className="flex justify-between items-start">
                        <div className="space-y-3 flex-1 mr-4">
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div className="space-y-1.5">
                              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Diplôme</Label>
                              <Input className="h-9 rounded-lg bg-background" value={edu.degree ?? ""} onChange={(e) => updateListItem(setEducations, index, "degree", e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">École</Label>
                              <Input className="h-9 rounded-lg bg-background" value={edu.schoolName ?? ""} onChange={(e) => updateListItem(setEducations, index, "schoolName", e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Domaine</Label>
                              <Input className="h-9 rounded-lg bg-background" value={edu.fieldOfStudy ?? ""} onChange={(e) => updateListItem(setEducations, index, "fieldOfStudy", e.target.value)} />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Début</Label>
                                <Input type="number" className="h-9 rounded-lg bg-background" value={edu.startYear ?? ""} onChange={(e) => updateListItem(setEducations, index, "startYear", e.target.value)} />
                              </div>
                              <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Fin</Label>
                                <Input type="number" className="h-9 rounded-lg bg-background" value={edu.endYear ?? ""} onChange={(e) => updateListItem(setEducations, index, "endYear", e.target.value)} />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Description</Label>
                            <Textarea rows={2} className="rounded-lg bg-background resize-y text-sm" value={edu.description ?? ""} onChange={(e) => updateListItem(setEducations, index, "description", e.target.value)} />
                          </div>
                        </div>
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive shrink-0" onClick={() => removeListItem(setEducations, index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            
            {/* Personal Details */}
            <div className="rounded-2xl border border-border bg-card shadow-sm p-6 sticky top-24">
              <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Informations</h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Prénom</Label>
                  <Input className="h-10 rounded-xl" value={form.firstName} onChange={updateField("firstName")} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nom</Label>
                  <Input className="h-10 rounded-xl" value={form.lastName} onChange={updateField("lastName")} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</Label>
                  <Input className="h-10 rounded-xl" value={form.email} onChange={updateField("email")} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Téléphone</Label>
                  <Input className="h-10 rounded-xl" value={form.phone} onChange={updateField("phone")} placeholder="+33 6..." />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Localisation</Label>
                  <Input className="h-10 rounded-xl" value={form.location} onChange={updateField("location")} placeholder="Ville, Pays" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Titre / Rôle</Label>
                  <Input className="h-10 rounded-xl" value={form.headline} onChange={updateField("headline")} placeholder="Titre professionnel" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Expérience (Années)</Label>
                  <Input type="number" min="0" className="h-10 rounded-xl" value={form.yearsExperience} onChange={updateField("yearsExperience")} />
                </div>
              </div>
            </div>

            {/* Skills Card */}
            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="border-b border-border bg-slate-50/50 p-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Code2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-foreground">Compétences</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="flex gap-2 mb-4">
                  <Input
                    className="h-10 rounded-xl bg-secondary/30"
                    value={skillInput}
                    onChange={(event) => setSkillInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addSkill();
                      }
                    }}
                    placeholder="Ajouter (ex: React)"
                  />
                  <Button type="button" variant="outline" className="rounded-xl px-3 shrink-0" onClick={addSkill}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.length === 0 && (
                    <p className="text-sm text-muted-foreground">Aucune compétence ajoutée.</p>
                  )}
                  {skills.map((skill) => (
                    <button
                      type="button"
                      key={skill}
                      className="rounded-lg bg-primary/10 border border-primary/20 px-3 py-1.5 text-sm font-medium text-primary hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-colors flex items-center gap-1 group"
                      onClick={() => setSkills((current) => current.filter((item) => item !== skill))}
                    >
                      {skill} 
                      <Trash2 className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SeekerProfile;
