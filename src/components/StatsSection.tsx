const stats = [
  { value: "12 500+", label: "Offres actives" },
  { value: "3 200+", label: "Entreprises" },
  { value: "85 000+", label: "Candidats inscrits" },
  { value: "94%", label: "Taux de satisfaction" },
];

const StatsSection = () => {
  return (
    <section className="bg-primary py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center animate-counter">
              <div className="font-heading text-3xl font-bold text-primary-foreground md:text-4xl">
                {value}
              </div>
              <div className="mt-2 text-sm text-primary-foreground/70">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
