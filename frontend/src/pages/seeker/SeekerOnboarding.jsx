import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { authStorage, seekerProfileApi } from "@/lib/api";
import { toast } from "sonner";
import { Plus, Trash2, ArrowRight, ArrowLeft, CheckCircle2, UserCircle, Code2, Briefcase, GraduationCap } from "lucide-react";

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

const steps = [
  { id: "profile", label: "Profil", icon: UserCircle },
  { id: "skills", label: "Compétences", icon: Code2 },
  { id: "experience", label: "Expériences", icon: Briefcase },
  { id: "education", label: "Études", icon: GraduationCap }
];

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
      toast.success("Profil complété avec succès !");
      navigate("/seeker/profile", { replace: true });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const CurrentStepIcon = steps[step].icon;

  return (
    <DashboardLayout role="seeker" title="Compléter mon profil">
      <div className="mx-auto max-w-3xl">
        
        {/* Progress Tracker */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-secondary rounded-full -z-10"></div>
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full -z-10 transition-all duration-500 ease-in-out"
              style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
            ></div>
            
            {steps.map((s, index) => {
              const Icon = s.icon;
              const isActive = index === step;
              const isCompleted = index < step;
              
              return (
                <div key={s.id} className="flex flex-col items-center gap-2">
                  <div 
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-4 border-background transition-colors duration-300 ${
                      isActive ? "bg-primary text-primary-foreground scale-110 shadow-lg" : 
                      isCompleted ? "bg-primary text-primary-foreground" : 
                      "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <span className={`text-xs font-semibold hidden sm:block ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 via-blue-500/5 to-transparent p-6 border-b border-border flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <CurrentStepIcon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground">
                {step === 0 && `Bienvenue ${user?.firstName}, parlons de vous`}
                {step === 1 && "Quelles sont vos compétences clés ?"}
                {step === 2 && "Détaillez votre parcours professionnel"}
                {step === 3 && "Parlez-nous de votre formation"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {step === 0 && "Ces informations seront la première chose que les recruteurs verront."}
                {step === 1 && "Ajoutez les technologies, outils et soft skills que vous maîtrisez."}
                {step === 2 && "Mettez en valeur vos expériences les plus pertinentes."}
                {step === 3 && "Ajoutez vos diplômes, certifications et formations."}
              </p>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {step === 0 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Titre professionnel <span className="text-destructive">*</span></Label>
                  <Input
                    className="h-11 rounded-xl bg-background"
                    placeholder="ex: Développeur Full Stack React / Node.js"
                    value={profile.headline}
                    onChange={updateProfile("headline")}
                  />
                  <p className="text-xs text-muted-foreground">Apparaîtra directement sous votre nom.</p>
                </div>
                
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Localisation <span className="text-destructive">*</span></Label>
                    <Input
                      className="h-11 rounded-xl bg-background"
                      placeholder="ex: Paris, France"
                      value={profile.location}
                      onChange={updateProfile("location")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Années d'expérience</Label>
                    <Input
                      className="h-11 rounded-xl bg-background"
                      type="number"
                      min="0"
                      placeholder="ex: 3"
                      value={profile.yearsExperience}
                      onChange={updateProfile("yearsExperience")}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Résumé de votre profil (À propos)</Label>
                  <Textarea
                    className="min-h-[150px] resize-y rounded-xl bg-background p-4"
                    placeholder="Décrivez votre parcours, vos ambitions, et ce qui vous motive. Les recruteurs aiment les profils authentiques."
                    value={profile.bio}
                    onChange={updateProfile("bio")}
                  />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <div className="rounded-xl border border-border bg-secondary/20 p-5">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                      className="h-12 rounded-xl bg-background flex-1"
                      placeholder="Tapez une compétence et appuyez sur Entrée (ex: React, SEO, Gestion de projet)"
                      value={skillInput}
                      onChange={(event) => setSkillInput(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          addSkill();
                        }
                      }}
                    />
                    <Button type="button" onClick={addSkill} className="h-12 px-6 rounded-xl shrink-0">
                      <Plus className="mr-2 h-4 w-4" /> Ajouter
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold mb-3">Compétences ajoutées ({skills.length})</h3>
                  <div className="flex flex-wrap gap-2 min-h-[100px] p-4 rounded-xl border border-border bg-background">
                    {skills.length === 0 ? (
                      <p className="text-sm text-muted-foreground w-full text-center py-4">
                        Vous n'avez pas encore ajouté de compétences.
                      </p>
                    ) : (
                      skills.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() =>
                            setSkills((current) => current.filter((item) => item !== skill))
                          }
                          className="rounded-lg bg-primary/10 border border-primary/20 px-3 py-1.5 text-sm font-medium text-primary hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-colors flex items-center gap-2 group"
                        >
                          {skill}
                          <Trash2 className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100" />
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                {experiences.map((experience, index) => (
                  <div key={index} className="relative rounded-xl border border-border bg-secondary/10 p-5 group">
                    {experiences.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -right-3 -top-3 h-8 w-8 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeListItem(setExperiences, index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <div className="grid gap-5 sm:grid-cols-2 mb-5">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Poste</Label>
                        <Input
                          className="h-10 rounded-xl bg-background"
                          placeholder="Développeur Frontend"
                          value={experience.title}
                          onChange={(event) =>
                            updateListItem(setExperiences, index, "title", event.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Entreprise</Label>
                        <Input
                          className="h-10 rounded-xl bg-background"
                          placeholder="Tech Corp"
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
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date début</Label>
                        <Input
                          className="h-10 rounded-xl bg-background"
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
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date fin</Label>
                          <label className="flex items-center gap-1.5 text-xs text-foreground font-medium cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={Boolean(experience.isCurrent)} 
                              className="rounded border-border text-primary focus:ring-primary/20" 
                              onChange={(e) => updateListItem(setExperiences, index, "isCurrent", e.target.checked)} 
                            />
                            Poste actuel
                          </label>
                        </div>
                        <Input
                          className="h-10 rounded-xl bg-background"
                          type="date"
                          value={experience.endDate}
                          disabled={Boolean(experience.isCurrent)}
                          onChange={(event) =>
                            updateListItem(setExperiences, index, "endDate", event.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Description des missions</Label>
                      <Textarea
                        className="rounded-xl bg-background resize-y"
                        rows={3}
                        placeholder="Détaillez vos responsabilités et accomplissements..."
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
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-xl border-dashed py-6 text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5 transition-colors"
                  onClick={() =>
                    setExperiences((current) => [...current, { ...emptyExperience }])
                  }
                >
                  <Plus className="mr-2 h-5 w-5" /> Ajouter une autre expérience
                </Button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                {educations.map((education, index) => (
                  <div key={index} className="relative rounded-xl border border-border bg-secondary/10 p-5 group">
                    {educations.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -right-3 -top-3 h-8 w-8 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeListItem(setEducations, index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <div className="grid gap-5 sm:grid-cols-2 mb-5">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Diplôme</Label>
                        <Input
                          className="h-10 rounded-xl bg-background"
                          placeholder="Master Informatique"
                          value={education.degree}
                          onChange={(event) =>
                            updateListItem(setEducations, index, "degree", event.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">École / Établissement</Label>
                        <Input
                          className="h-10 rounded-xl bg-background"
                          placeholder="Université de Paris"
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
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Domaine d'études</Label>
                        <Input
                          className="h-10 rounded-xl bg-background"
                          placeholder="Développement Web, Ingénierie Logicielle..."
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
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Année de début</Label>
                        <Input
                          className="h-10 rounded-xl bg-background"
                          type="number"
                          placeholder="2018"
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
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Année de fin (ou prévue)</Label>
                        <Input
                          className="h-10 rounded-xl bg-background"
                          type="number"
                          placeholder="2023"
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
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Description (Optionnel)</Label>
                      <Textarea
                        className="rounded-xl bg-background resize-y"
                        rows={2}
                        placeholder="Mentions, projets de fin d'études, activités..."
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
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-xl border-dashed py-6 text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5 transition-colors"
                  onClick={() =>
                    setEducations((current) => [...current, { ...emptyEducation }])
                  }
                >
                  <Plus className="mr-2 h-5 w-5" /> Ajouter une autre formation
                </Button>
              </div>
            )}

          </div>
          
          <div className="bg-slate-50/50 border-t border-border p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto rounded-xl"
              disabled={step === 0}
              onClick={() => setStep((current) => current - 1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Précédent
            </Button>
            
            {step < steps.length - 1 ? (
              <Button 
                type="button" 
                variant="hero" 
                size="lg" 
                className="w-full sm:w-auto rounded-xl"
                disabled={step === 0 && !profile.headline}
                onClick={() => setStep((current) => current + 1)}
              >
                Suivant <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                type="button" 
                variant="hero" 
                size="lg" 
                className="w-full sm:w-auto rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={saving} 
                onClick={saveProfile}
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                    Enregistrement...
                  </span>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5" /> Terminer l'inscription
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SeekerOnboarding;
