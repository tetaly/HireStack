import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Mail, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { apiRequest, authStorage, nextPathForUser } from "@/lib/api";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      authStorage.setSession(data);
      toast.success("Connexion réussie");
      navigate(nextPathForUser(data.user));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = (role) => {
    const routes = {
      admin: "/admin",
      recruiter: "/recruiter",
      seeker: "/seeker",
    };
    navigate(routes[role]);
  };

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
            Accélérez votre <br />
            <span className="text-blue-200">carrière.</span>
          </h2>
          
          {/* Glassmorphism Feature Cards */}
          <div className="grid gap-4">
            <div className="group flex items-start gap-4 rounded-2xl bg-white/10 border border-white/20 p-5 backdrop-blur-md transition-all hover:bg-white/20 hover:-translate-y-1 shadow-lg">
               <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20 text-white shadow-sm">
                 <CheckCircle2 className="h-6 w-6" />
               </div>
               <div>
                 <h3 className="font-semibold text-white text-lg tracking-tight">Opportunités exclusives</h3>
                 <p className="mt-1 text-sm text-blue-100 leading-relaxed">Accédez à des offres premium inédites et propulsez votre trajectoire professionnelle.</p>
               </div>
            </div>
            
            <div className="group flex items-start gap-4 rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-md transition-all hover:bg-white/20 hover:-translate-y-1 shadow-md ml-4">
               <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
                 <Briefcase className="h-6 w-6" />
               </div>
               <div>
                 <h3 className="font-semibold text-white text-lg tracking-tight">Mise en relation directe</h3>
                 <p className="mt-1 text-sm text-blue-100 leading-relaxed">Discutez sans filtre avec les recruteurs des entreprises les plus innovantes du marché.</p>
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
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-600 shadow-md">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <span className="font-heading text-xl font-bold tracking-tight text-foreground">
              HireStack
            </span>
          </div>

          <div className="mb-8">
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
              Bon retour !
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Entrez vos identifiants pour accéder à votre espace personnel.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">Adresse email</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  className="pl-11 h-12 rounded-xl border-border bg-card shadow-sm transition-all focus-visible:ring-primary/20 focus-visible:border-primary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-semibold">Mot de passe</Label>
                <a href="#" className="text-xs font-medium text-primary hover:text-primary-hover hover:underline underline-offset-4">
                  Mot de passe oublié ?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-11 pr-11 h-12 rounded-xl border-border bg-card shadow-sm transition-all focus-visible:ring-primary/20 focus-visible:border-primary"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            </div>
            
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20 transition-all cursor-pointer" 
                /> 
                <span>Se souvenir de moi</span>
              </label>
            </div>
            
            <Button variant="hero" className="w-full h-12 rounded-xl mt-2" size="lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                  Connexion en cours...
                </span>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>

          {/* Demo access section */}
          <div className="mt-10">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-2 text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  Accès de démonstration
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin("admin")}
                className="text-xs font-medium rounded-lg h-9 bg-card hover:bg-secondary border-border shadow-sm"
              >
                Admin
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin("recruiter")}
                className="text-xs font-medium rounded-lg h-9 bg-card hover:bg-secondary border-border shadow-sm"
              >
                Recruteur
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin("seeker")}
                className="text-xs font-medium rounded-lg h-9 bg-card hover:bg-secondary border-border shadow-sm"
              >
                Candidat
              </Button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Vous n'avez pas encore de compte ?{" "}
            <a
              href="/register"
              className="font-semibold text-primary hover:text-primary-hover hover:underline underline-offset-4 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                navigate("/register");
              }}
            >
              Créez-en un gratuitement
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
