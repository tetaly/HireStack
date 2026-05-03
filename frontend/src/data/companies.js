import { allJobs } from "@/pages/Jobs";

export const companies = [
  {
    id: "techvision",
    name: "TechVision",
    industry: "Tech / SaaS",
    location: "Paris",
    size: "50-200",
    description:
      "TechVision construit des outils SaaS pour aider les équipes produit à livrer plus vite. Nous sommes une équipe internationale, passionnée par le code propre et l'expérience utilisateur.",
    website: "techvision.io",
    founded: "2018",
    cover: "from-blue-500 to-indigo-600",
  },
  {
    id: "designlab",
    name: "DesignLab",
    industry: "Design / Studio",
    location: "Lyon",
    size: "10-50",
    description:
      "Studio de design produit qui accompagne startups et grandes entreprises sur leurs interfaces critiques.",
    website: "designlab.fr",
    founded: "2016",
    cover: "from-pink-500 to-rose-600",
  },
  {
    id: "datacore",
    name: "DataCore",
    industry: "Data / IA",
    location: "Télétravail",
    size: "20-50",
    description:
      "Plateforme d'analyse de données pour les entreprises data-driven. Nous démocratisons l'accès à la donnée.",
    website: "datacore.ai",
    founded: "2020",
    cover: "from-emerald-500 to-teal-600",
  },
  {
    id: "growthup",
    name: "GrowthUp",
    industry: "Marketing",
    location: "Bordeaux",
    size: "10-50",
    description:
      "Agence growth spécialisée acquisition et rétention pour les startups B2B/B2C en hyper-croissance.",
    website: "growthup.co",
    founded: "2019",
    cover: "from-orange-500 to-red-600",
  },
  {
    id: "cloudnine",
    name: "CloudNine",
    industry: "Cloud / DevOps",
    location: "Nantes",
    size: "50-200",
    description:
      "Infrastructure cloud managée pour les entreprises qui veulent scaler sans douleur.",
    website: "cloudnine.tech",
    founded: "2017",
    cover: "from-sky-500 to-cyan-600",
  },
  {
    id: "agencyx",
    name: "AgencyX",
    industry: "Digital / Agence",
    location: "Paris",
    size: "200-500",
    description:
      "Agence digitale de référence sur les projets de transformation pour les grands comptes.",
    website: "agencyx.fr",
    founded: "2010",
    cover: "from-violet-500 to-purple-600",
  },
  {
    id: "scaleio",
    name: "ScaleIO",
    industry: "Tech / Backend",
    location: "Télétravail",
    size: "10-50",
    description: "API haute performance pour les fintechs européennes.",
    website: "scaleio.dev",
    founded: "2021",
    cover: "from-slate-600 to-zinc-700",
  },
  {
    id: "pixelhub",
    name: "PixelHub",
    industry: "Design / Recherche",
    location: "Marseille",
    size: "10-50",
    description:
      "Recherche utilisateur et design d'interfaces pour les produits grand public.",
    website: "pixelhub.io",
    founded: "2019",
    cover: "from-fuchsia-500 to-pink-600",
  },
  {
    id: "finpro",
    name: "FinPro",
    industry: "Finance",
    location: "Toulouse",
    size: "50-200",
    description:
      "Cabinet d'expertise comptable nouvelle génération pour PME et indépendants.",
    website: "finpro.fr",
    founded: "2014",
    cover: "from-amber-500 to-yellow-600",
  },
];

export const getJobsByCompany = (companyName) =>
  allJobs.filter((j) => j.company.toLowerCase() === companyName.toLowerCase());
