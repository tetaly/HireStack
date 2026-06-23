import { MapPin, Clock, Building2, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const JobCard = ({
  title,
  company,
  location,
  type,
  salary,
  tags,
  posted,
  featured,
}) => {
  return (
    <div
      className={`group flex h-full cursor-pointer flex-col rounded-xl border bg-card p-6 transition-all duration-300 ${
        featured
          ? "border-primary/20 shadow-card hover:shadow-card-hover hover:-translate-y-1 relative overflow-hidden"
          : "border-border hover:border-primary/30 hover:shadow-card-hover hover:-translate-y-1 relative overflow-hidden"
      }`}
    >
      {/* Hover accent line */}
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary to-blue-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="mb-5 grid grid-cols-[1fr_auto] items-start gap-4">
        <div className="grid min-w-0 grid-cols-[48px_1fr] items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-blue-500/10 shadow-sm ring-1 ring-border group-hover:ring-primary/20 transition-all duration-300">
            <span className="font-heading text-xl font-bold text-primary">
              {company.charAt(0)}
            </span>
          </div>
          <div className="min-w-0 pt-0.5">
            <h3 className="line-clamp-2 font-heading text-lg font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
              {title}
            </h3>
            <div className="mt-2 flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4 shrink-0" />
              <span className="truncate font-medium">{company}</span>
            </div>
          </div>
        </div>
        {featured && (
          <Badge variant="success" className="shrink-0 gap-1.5 px-3">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Mis en avant
          </Badge>
        )}
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2.5 text-sm text-muted-foreground">
        <span className="flex min-w-0 items-center gap-1.5">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="truncate">{location}</span>
        </span>
        <span className="flex items-center gap-1.5 whitespace-nowrap">
          <Clock className="h-4 w-4 shrink-0" /> 
          {type}
        </span>
        <span className="whitespace-nowrap font-semibold text-foreground bg-secondary px-2.5 py-0.5 rounded-md">
          {salary}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mt-auto pb-5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="max-w-full truncate rounded-full border border-border bg-transparent px-3 py-1 text-xs font-medium text-muted-foreground transition-colors group-hover:border-primary/20 group-hover:bg-primary/5 group-hover:text-primary"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="border-t border-border pt-4 mt-auto">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>Publié {posted}</span>
          </div>
          <span className="font-medium text-primary opacity-0 transform translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
            Voir l'offre →
          </span>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
