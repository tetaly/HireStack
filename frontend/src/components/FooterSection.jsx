import { Briefcase, Twitter, Linkedin, Github } from "lucide-react";
import { Link } from "react-router-dom";

const FooterSection = () => {
  return (
    <footer className="relative bg-secondary/30 text-foreground pt-16 pb-8 overflow-hidden">
      
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5 mb-12">
          <div className="lg:col-span-2">
            <Link to="/" className="mb-6 flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                <Briefcase className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-heading text-xl font-bold tracking-tight text-foreground">
                HireStack
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-8">
              La plateforme de recrutement moderne qui connecte les meilleurs talents aux entreprises les plus innovantes.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="h-10 w-10 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>

          {[
            {
              title: "Candidats",
              links: [
                { label: "Rechercher un emploi", path: "/jobs" },
                { label: "Créer un profil", path: "/register" },
                { label: "Alertes emploi", path: "#" },
                { label: "Conseils carrière", path: "#" },
              ],
            },
            {
              title: "Entreprises",
              links: [
                { label: "Publier une offre", path: "/register" },
                { label: "Recherche de talents", path: "#" },
                { label: "Tarifs", path: "#" },
                { label: "Documentation API", path: "#" },
              ],
            },
            {
              title: "HireStack",
              links: [
                { label: "À propos", path: "#" },
                { label: "Blog", path: "#" },
                { label: "Centre d'aide", path: "#" },
                { label: "Contact", path: "#" },
              ],
            },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="mb-5 font-heading text-sm font-semibold text-foreground tracking-wider uppercase">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground hover:underline underline-offset-4"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} HireStack. Tous droits réservés.
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-foreground transition-colors">Conditions</a>
            <a href="#" className="hover:text-foreground transition-colors">Mentions légales</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
