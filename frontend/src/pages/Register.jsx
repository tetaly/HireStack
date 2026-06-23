import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Mail, Lock, User, Eye, EyeOff, CheckCircle2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { apiRequest, authStorage, nextPathForUser } from "@/lib/api";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("seeker");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          role,
        }),
      });

      authStorage.setSession(data);
      toast.success("Compte créé avec succès");
      navigate(nextPathForUser(data.user));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const roles = [
    {
      value: "seeker",
      label: "Candidat",
      icon: User,
      desc: "Je cherche des opportunités",
    },
    {
      value: "recruiter",
      label: "Recruteur",
      icon: Briefcase,
      desc: "Je cherche des talents",
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left panel - Decorative */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-primary p-12 lg:flex">
        {/* Crisp Geometric Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute -left-20 top-20 h-64 w-64 rounded-full border-[24px] border-white/10"></div>
          <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-white/5"></div>
          <div className="absolute bottom-40 right-20 h-24 w-24 rounded-full border-[12px] border-white/10"></div>
          
          {/* Subtle pattern grid */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wOCkiLz48L3N2Zz4=')] bg-[length:24px_24px]"></div>
          
          {/* Architectural lines */}
          <div className="absolute left-1/4 top-0 h-full w-px bg-gradient-to-b from-white/0 via-white/20 to-white/0"></div>
          <div className="absolute left-3/4 top-0 h-full w-px bg-gradient-to-b from-white/0 via-white/10 to-white/0"></div>
        </div>

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary shadow-xl">
            <Briefcase className="h-6 w-6" />
          </div>
          <span className="font-heading text-2xl font-bold tracking-tight text-white">
            HireStack
          </span>
        </div>

        {/* Dynamic Content */}
        <div className="relative z-10 w-full max-w-lg mb-4 mt-12">
          <h2 className="mb-8 font-heading text-5xl font-extrabold text-white leading-[1.15] tracking-tight">
            Rejoignez <br />
            <span className="text-blue-200">l'excellence.</span>
          </h2>
          
          {/* Glassmorphism Feature Cards */}
          <div className="grid gap-4">
            <div className="group flex items-start gap-4 rounded-2xl bg-white/10 border border-white/20 p-5 backdrop-blur-md transition-all hover:bg-white/20 hover:-translate-y-1 shadow-lg">
               <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20 text-white shadow-sm">
                 <User className="h-6 w-6" />
               </div>
               <div>
                 <h3 className="font-semibold text-white text-lg tracking-tight">Profil sur mesure</h3>
                 <p className="mt-1 text-sm text-blue-100 leading-relaxed">Mettez en valeur vos compétences et laissez les meilleures opportunités venir à vous.</p>
               </div>
            </div>
            
            <div className="group flex items-start gap-4 rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-md transition-all hover:bg-white/20 hover:-translate-y-1 shadow-md ml-4">
               <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
                 <Lock className="h-6 w-6" />
               </div>
               <div>
                 <h3 className="font-semibold text-white text-lg tracking-tight">Données sécurisées</h3>
                 <p className="mt-1 text-sm text-blue-100 leading-relaxed">Votre confidentialité est notre priorité. Contrôlez exactement qui peut voir votre profil.</p>
               </div>
            </div>
          </div>
        </div>
        
        {/* Social / Trust Indicator */}
        <div className="relative z-10 mt-auto pt-10 flex items-center gap-4 text-white">
          <div className="flex -space-x-3">
             <div className="h-10 w-10 rounded-full border-2 border-primary bg-blue-300"></div>
             <div className="h-10 w-10 rounded-full border-2 border-primary bg-blue-400"></div>
             <div className="h-10 w-10 rounded-full border-2 border-primary bg-blue-500"></div>
             <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-white text-xs font-bold text-primary shadow-sm">+2k</div>
          </div>
          <p className="text-sm font-medium text-blue-50">Rejoignez notre communauté active.</p>
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 sm:px-12 lg:px-24">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile Logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-600 shadow-md">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <span className="font-heading text-xl font-bold tracking-tight text-foreground">
              HireStack
            </span>
          </div>

          <div className="mb-8">
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
              Créer un compte
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Commencez par choisir le type de profil qui vous correspond.
            </p>
          </div>

          {/* Role selector */}
          <div className="mb-8 grid grid-cols-2 gap-4">
            {roles.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                className={`relative flex flex-col items-start rounded-2xl border-2 p-4 transition-all duration-200 text-left ${
                  role === r.value
                    ? "border-primary bg-primary/5 shadow-sm ring-4 ring-primary/10"
                    : "border-border bg-card hover:border-primary/30 hover:bg-secondary"
                }`}
              >
                {role === r.value && (
                  <div className="absolute top-4 right-4 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                    <CheckCircle2 className="h-3 w-3 text-white" />
                  </div>
                )}
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${role === r.value ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground'}`}>
                  <r.icon className="h-5 w-5" />
                </div>
                <div className={`font-heading text-base font-semibold ${role === r.value ? 'text-primary' : 'text-foreground'}`}>
                  {r.label}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {r.desc}
                </div>
              </button>
            ))}
          </div>

          <form className="space-y-5" onSubmit={handleRegister}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Prénom</Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Jean"
                    className="pl-11 h-12 rounded-xl bg-card border-border shadow-sm focus-visible:ring-primary/20"
                    value={form.firstName}
                    onChange={updateField("firstName")}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Nom</Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Dupont"
                    className="pl-11 h-12 rounded-xl bg-card border-border shadow-sm focus-visible:ring-primary/20"
                    value={form.lastName}
                    onChange={updateField("lastName")}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Adresse email</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="votre@email.com"
                  className="pl-11 h-12 rounded-xl bg-card border-border shadow-sm focus-visible:ring-primary/20"
                  value={form.email}
                  onChange={updateField("email")}
                  required
                />
              </div>
            </div>

            {role === "recruiter" && (
              <div className="space-y-2 animate-in fade-in slide-up">
                <Label className="text-sm font-semibold">Nom de l'entreprise</Label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="TechCorp Inc."
                    className="pl-11 h-12 rounded-xl bg-card border-border shadow-sm focus-visible:ring-primary/20"
                    value={form.companyName}
                    onChange={updateField("companyName")}
                    required={role === "recruiter"}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-11 pr-11 h-12 rounded-xl bg-card border-border shadow-sm focus-visible:ring-primary/20"
                  value={form.password}
                  onChange={updateField("password")}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {form.password.length > 0 && form.password.length < 6 && (
                <p className="text-xs text-amber-500 mt-1.5">
                  Le mot de passe doit contenir au moins 6 caractères
                </p>
              )}
            </div>

            <Button 
              variant="hero" 
              className="w-full h-12 rounded-xl mt-4" 
              size="lg" 
              disabled={isSubmitting || (form.password.length > 0 && form.password.length < 6)}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                  Création en cours...
                </span>
              ) : (
                "Créer mon compte"
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Vous avez déjà un compte ?{" "}
            <a
              href="/login"
              className="font-semibold text-primary hover:text-primary-hover hover:underline underline-offset-4 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                navigate("/login");
              }}
            >
              Connectez-vous
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
