import { Briefcase, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authApi, authStorage, nextPathForUser } from "@/lib/api";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = authStorage.getUser();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const goTo = (path) => {
    setMobileOpen(false);
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // The local session should be cleared even if the API is unreachable.
    } finally {
      authStorage.clearSession();
      setMobileOpen(false);
      navigate("/login", { replace: true });
    }
  };

  const NavLink = ({ path, label }) => {
    const isActive = location.pathname.startsWith(path) && path !== "/" || (path === "/" && location.pathname === "/");
    return (
      <button
        onClick={() => goTo(path)}
        className={`relative text-sm font-medium transition-colors hover:text-primary ${
          isActive ? "text-primary" : "text-muted-foreground"
        }`}
      >
        {label}
        {isActive && (
          <span className="absolute -bottom-5 left-0 h-0.5 w-full bg-primary rounded-t-full" />
        )}
      </button>
    );
  };

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "glass shadow-sm py-3" 
          : "bg-transparent py-4 border-b border-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 lg:px-8">
        <button
          type="button"
          onClick={() => goTo("/")}
          className="group flex items-center gap-2.5 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Retour a l'accueil"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-600 shadow-md transition-transform group-hover:scale-105 group-active:scale-95">
            <Briefcase className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-heading text-xl font-bold tracking-tight text-foreground">
            HireStack
          </span>
        </button>

        {/* Desktop */}
        <div className="hidden items-center gap-8 md:flex ml-8">
          <NavLink path="/jobs" label="Offres d'emploi" />
          <NavLink path="/companies" label="Entreprises" />
          <button className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Conseils carrière
          </button>
        </div>

        <div className="hidden flex-1 md:flex" />

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => goTo(nextPathForUser(user))}
              >
                Mon espace
              </Button>
              <Button variant="default" size="sm" onClick={handleLogout}>
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => goTo("/login")}>
                Se connecter
              </Button>
              <Button
                variant="default"
                size="sm"
                className="rounded-full px-6"
                onClick={() => goTo("/register")}
              >
                S'inscrire
              </Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground hover:bg-secondary rounded-lg p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile menu - full screen overlay with animation */}
      <div 
        className={`fixed inset-x-0 top-[73px] bottom-0 z-40 bg-background/95 backdrop-blur-xl transition-all duration-300 ease-in-out md:hidden ${
          mobileOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <div className="flex h-full flex-col px-6 py-8">
          <div className="flex flex-col gap-6 text-lg">
            <button
              type="button"
              onClick={() => goTo("/jobs")}
              className="text-left font-medium text-foreground hover:text-primary transition-colors"
            >
              Offres d'emploi
            </button>
            <button
              type="button"
              onClick={() => goTo("/companies")}
              className="text-left font-medium text-foreground hover:text-primary transition-colors"
            >
              Entreprises
            </button>
            <button className="text-left font-medium text-foreground hover:text-primary transition-colors">
              Conseils carrière
            </button>
          </div>
          
          <div className="mt-auto flex flex-col gap-3 pb-8">
            <hr className="border-border mb-4" />
            {user ? (
              <>
                <Button
                  variant="hero-outline"
                  size="lg"
                  className="w-full"
                  onClick={() => goTo(nextPathForUser(user))}
                >
                  Mon espace
                </Button>
                <Button variant="ghost" size="lg" className="w-full" onClick={handleLogout}>
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-full"
                  onClick={() => goTo("/login")}
                >
                  Se connecter
                </Button>
                <Button
                  variant="hero"
                  size="lg"
                  className="w-full rounded-full"
                  onClick={() => goTo("/register")}
                >
                  S'inscrire
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
