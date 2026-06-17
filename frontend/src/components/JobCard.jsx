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
      className={`group flex h-full min-h-[245px] cursor-pointer flex-col rounded-xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 ${
        featured
          ? "border-primary/20 shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)]"
          : "border-border hover:border-primary/20 hover:shadow-[var(--card-shadow)]"
      }`}
    >
      <div className="mb-4 grid grid-cols-[1fr_auto] items-start gap-3">
        <div className="grid min-w-0 grid-cols-[48px_1fr] items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-heading text-lg font-bold text-primary">
            {company.charAt(0)}
          </div>
          <div className="min-w-0">
            <h3 className="line-clamp-2 min-h-[56px] font-heading text-lg font-semibold leading-7 text-card-foreground transition-colors group-hover:text-primary">
              {title}
            </h3>
            <div className="mt-1 flex min-w-0 items-center gap-1 text-sm text-muted-foreground">
              <Building2 className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{company}</span>
            </div>
          </div>
        </div>
        {featured && (
          <Badge className="max-w-[82px] justify-center whitespace-normal rounded-full border-0 bg-accent px-3 py-1 text-center text-[11px] leading-3 text-accent-foreground">
            Mis en avant
          </Badge>
        )}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
        <span className="flex min-w-0 items-center gap-1">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{location}</span>
        </span>
        <span className="flex items-center gap-1 whitespace-nowrap">
          <Clock className="h-3.5 w-3.5 shrink-0" /> {type}
        </span>
        <span className="whitespace-nowrap font-semibold text-foreground">
          {salary}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="max-w-full truncate rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto border-t border-border pt-3 text-xs text-muted-foreground">
        Publié {posted}
      </div>
    </div>
  );
};

export default JobCard;
