import { MapPin, Clock, Building2 } from "lucide-react";
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
      className={`group cursor-pointer rounded-xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 ${
        featured
          ? "border-primary/20 shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)]"
          : "border-border hover:border-primary/20 hover:shadow-[var(--card-shadow)]"
      }`}
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 font-heading text-lg font-bold text-primary">
            {company.charAt(0)}
          </div>
          <div>
            <h3 className="font-heading text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
              {title}
            </h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Building2 className="h-3.5 w-3.5" />
              {company}
            </div>
          </div>
        </div>
        {featured && (
          <Badge className="bg-accent text-accent-foreground border-0 text-xs">
            Mis en avant
          </Badge>
        )}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" /> {location}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" /> {type}
        </span>
        <span className="font-semibold text-foreground">{salary}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
        Publié {posted}
      </div>
    </div>
  );
};

export default JobCard;
