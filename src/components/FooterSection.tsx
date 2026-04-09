import { Briefcase } from "lucide-react";

const FooterSection = () => {
  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Briefcase className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-heading text-lg font-bold text-foreground">RecrutPro</span>
            </div>
            <p className="text-sm text-muted-foreground">
              La plateforme de recrutement qui connecte talents et entreprises.
            </p>
          </div>

          {[
            { title: "Candidats", links: ["Rechercher un emploi", "Créer un CV", "Alertes emploi", "Conseils"] },
            { title: "Entreprises", links: ["Publier une offre", "Recherche de talents", "Tarifs", "API"] },
            { title: "Ressources", links: ["Blog", "Centre d'aide", "Mentions légales", "Contact"] },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="mb-3 font-heading text-sm font-semibold text-foreground">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © 2026 RecrutPro. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
