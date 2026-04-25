import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("seeker");

  const roles = [
    {
      value: "seeker",
      label: "Je cherche un emploi",
      icon: User,
      desc: "Parcourez les offres et postulez",
    },
    {
      value: "recruiter",
      label: "Je recrute",
      icon: Briefcase,
      desc: "Publiez des offres et trouvez des talents",
    },
  ];

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 items-center justify-center bg-primary lg:flex">
        <div className="max-w-md px-8 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/10">
            <Briefcase className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="mb-4 font-heading text-3xl font-bold text-primary-foreground">
            Rejoignez RecrutPro
          </h2>
          <p className="text-primary-foreground/70">
            Créez votre compte et accédez à des milliers d'opportunités.
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center px-6 lg:w-1/2">
        <div className="w-full max-w-md">
          <h1 className="mb-2 font-heading text-2xl font-bold text-foreground">
            Créer un compte
          </h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Choisissez votre profil et commencez
          </p>

          {/* Role selector */}
          <div className="mb-6 grid grid-cols-2 gap-3">
            {roles.map((r) => (
              <button
                key={r.value}
                onClick={() => setRole(r.value)}
                className={`rounded-xl border-2 p-4 text-left transition-all ${
                  role === r.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <r.icon
                  className={`mb-2 h-5 w-5 ${role === r.value ? "text-primary" : "text-muted-foreground"}`}
                />
                <div className="text-sm font-semibold text-foreground">
                  {r.label}
                </div>
                <div className="text-xs text-muted-foreground">{r.desc}</div>
              </button>
            ))}
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Prénom</Label>
                <Input placeholder="Jean" />
              </div>
              <div className="space-y-2">
                <Label>Nom</Label>
                <Input placeholder="Dupont" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="votre@email.com"
                  className="pl-10"
                />
              </div>
            </div>
            {role === "recruiter" && (
              <div className="space-y-2">
                <Label>Entreprise</Label>
                <Input placeholder="Nom de votre entreprise" />
              </div>
            )}
            <div className="space-y-2">
              <Label>Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <Button variant="hero" className="w-full" size="lg">
              Créer mon compte
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Déjà inscrit ?{" "}
            <a
              href="/login"
              className="font-medium text-primary hover:underline"
              onClick={(e) => {
                e.preventDefault();
                navigate("/login");
              }}
            >
              Se connecter
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
