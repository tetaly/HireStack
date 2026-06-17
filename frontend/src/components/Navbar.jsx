import { Briefcase, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi, authStorage, nextPathForUser } from "@/lib/api";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const user = authStorage.getUser();

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

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <button
          type="button"
          onClick={() => goTo("/")}
          className="flex items-center gap-2 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Retour a l'accueil"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Briefcase className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-heading text-xl font-bold text-foreground">
            RecrutPro
          </span>
        </button>

        {/* Desktop */}
        <div className="hidden items-center gap-6 md:flex">
          <button
            onClick={() => goTo("/jobs")}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Offres d'emploi
          </button>
          <button
            onClick={() => goTo("/companies")}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Entreprises
          </button>
          <a
            href="#"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Conseils carrière
          </a>
        </div>

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
                onClick={() => goTo("/register")}
              >
                S'inscrire
              </Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-card px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => goTo("/jobs")}
              className="text-left text-sm font-medium text-foreground"
            >
              Offres d'emploi
            </button>
            <button
              type="button"
              onClick={() => goTo("/companies")}
              className="text-left text-sm font-medium text-foreground"
            >
              Entreprises
            </button>
            <a href="#" className="text-sm font-medium text-foreground">
              Conseils carrière
            </a>
            <hr className="border-border" />
            {user ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start"
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start"
                  onClick={() => goTo("/login")}
                >
                  Se connecter
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => goTo("/register")}
                >
                  S'inscrire
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
