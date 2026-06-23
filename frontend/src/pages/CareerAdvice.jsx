import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  FileText,
  MessageSquareText,
  Search,
  Sparkles,
  Target,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const topics = ["Tous", "CV", "Entretien", "Recherche", "Carrière"];

const articles = [
  {
    title: "Construire un CV clair et convaincant",
    topic: "CV",
    readTime: "6 min",
    icon: FileText,
    summary:
      "Structurez votre parcours, mettez en avant vos résultats et adaptez votre CV à chaque offre.",
  },
  {
    title: "Préparer un entretien sans réciter ses réponses",
    topic: "Entretien",
    readTime: "8 min",
    icon: MessageSquareText,
    summary:
      "Transformez vos expériences en exemples précis et gardez une discussion naturelle avec le recruteur.",
  },
  {
    title: "Organiser sa recherche d'emploi chaque semaine",
    topic: "Recherche",
    readTime: "5 min",
    icon: ClipboardList,
    summary:
      "Priorisez les offres, suivez vos candidatures et évitez de postuler partout sans stratégie.",
  },
  {
    title: "Identifier les entreprises qui vous correspondent",
    topic: "Recherche",
    readTime: "7 min",
    icon: Target,
    summary:
      "Comparez la mission, le rythme, la culture et les opportunités d'évolution avant de candidater.",
  },
  {
    title: "Négocier son salaire avec des arguments solides",
    topic: "Carrière",
    readTime: "9 min",
    icon: Briefcase,
    summary:
      "Préparez une fourchette, reliez-la au marché et formulez votre demande avec calme.",
  },
  {
    title: "Relancer un recruteur au bon moment",
    topic: "Entretien",
    readTime: "4 min",
    icon: CalendarCheck,
    summary:
      "Envoyez un message court, utile et professionnel sans paraître insistant.",
  },
];

const checklist = [
  "Un titre de profil aligné avec le poste visé",
  "Des expériences formulées avec actions et résultats",
  "Une liste courte de compétences vraiment maîtrisées",
  "Une lettre ou note de motivation adaptée à l'offre",
  "Un suivi simple des candidatures envoyées",
];

const CareerAdvice = () => {
  const [activeTopic, setActiveTopic] = useState("Tous");
  const [query, setQuery] = useState("");

  const filteredArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return articles.filter((article) => {
      const matchesTopic = activeTopic === "Tous" || article.topic === activeTopic;
      const matchesQuery =
        normalizedQuery === "" ||
        article.title.toLowerCase().includes(normalizedQuery) ||
        article.summary.toLowerCase().includes(normalizedQuery) ||
        article.topic.toLowerCase().includes(normalizedQuery);

      return matchesTopic && matchesQuery;
    });
  }, [activeTopic, query]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        <section className="border-b border-border bg-slate-50 py-10 lg:py-14">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
              <div className="max-w-3xl">
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
                  Conseils carrière
                </h1>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
                  Des guides simples pour améliorer votre profil, préparer vos entretiens et avancer avec méthode dans votre recherche.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
                  <Sparkles className="h-4 w-4" />
                  À faire aujourd'hui
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Choisissez une offre intéressante, adaptez votre CV en 15 minutes, puis envoyez une candidature ciblée.
                </p>
                <Button asChild variant="hero" className="mt-5 h-10 w-full rounded-xl">
                  <Link to="/jobs">
                    Trouver une offre
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 lg:py-12">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="relative max-w-xl">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Rechercher un conseil..."
                  className="h-12 rounded-xl bg-card pl-11 shadow-sm"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {topics.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => setActiveTopic(topic)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      activeTopic === topic
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary"
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
              <div>
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <h2 className="font-heading text-xl font-bold text-foreground">
                      Guides pratiques
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {filteredArticles.length} résultat{filteredArticles.length > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                {filteredArticles.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                      <Search className="h-7 w-7" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-foreground">
                      Aucun conseil trouvé
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      Essayez avec un autre mot-clé ou changez de thème.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-6 rounded-xl"
                      onClick={() => {
                        setQuery("");
                        setActiveTopic("Tous");
                      }}
                    >
                      Effacer les filtres
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2">
                    {filteredArticles.map(({ title, topic, readTime, icon: Icon, summary }) => (
                      <article
                        key={title}
                        className="group rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/30 hover:shadow-card-hover"
                      >
                        <div className="mb-5 flex items-start justify-between gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                            {topic} · {readTime}
                          </span>
                        </div>
                        <h3 className="font-heading text-lg font-semibold leading-snug text-foreground group-hover:text-primary">
                          {title}
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                          {summary}
                        </p>
                      </article>
                    ))}
                  </div>
                )}
              </div>

              <aside className="space-y-4">
                <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                  <h2 className="font-heading text-lg font-bold text-foreground">
                    Checklist candidature
                  </h2>
                  <div className="mt-5 space-y-3">
                    {checklist.map((item) => (
                      <div key={item} className="flex gap-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span className="text-sm leading-relaxed text-muted-foreground">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
                  <h2 className="font-heading text-lg font-bold text-foreground">
                    Prêt à appliquer ?
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Passez des conseils à l'action avec les offres qui correspondent à votre profil.
                  </p>
                  <Button asChild variant="outline" className="mt-5 h-10 w-full rounded-xl bg-card">
                    <Link to="/jobs">
                      Explorer les offres
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  );
};

export default CareerAdvice;
