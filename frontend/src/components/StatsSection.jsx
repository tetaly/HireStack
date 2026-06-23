const stats = [
  { value: "12 500+", label: "Offres actives" },
  { value: "3 200+", label: "Entreprises partenaires" },
  { value: "85 000+", label: "Candidats inscrits" },
  { value: "94%", label: "Taux de satisfaction" },
];

const StatsSection = () => {
  return (
    <section className="relative overflow-hidden bg-[image:var(--hero-gradient)] py-20">
      {/* Decorative background elements */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-white blur-3xl"></div>
        <div className="absolute bottom-0 left-0 h-64 w-64 -translate-x-1/3 translate-y-1/3 rounded-full bg-white blur-3xl"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 gap-y-12 gap-x-8 md:grid-cols-4 md:divide-x md:divide-white/20">
          {stats.map(({ value, label }, index) => (
            <div key={label} className={`text-center animate-counter ${index !== 0 ? "md:pl-8" : ""}`}>
              <div className="font-heading text-4xl font-extrabold tracking-tight text-white md:text-5xl">
                {value}
              </div>
              <div className="mt-3 text-sm font-medium tracking-wide text-blue-100 uppercase">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
