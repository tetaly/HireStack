import DashboardLayout from "@/components/DashboardLayout";
import { Users, FileText, Activity, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    listings: 0,
    applications: 0,
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    adminApi
      .getStats()
      .then((data) => {
        if (active) setStats(data);
      })
      .catch(console.error)
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const statCards = [
    {
      title: "Utilisateurs totaux",
      value: stats.users,
      icon: Users,
      trend: "+12%",
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/20",
    },
    {
      title: "Offres actives",
      value: stats.listings,
      icon: FileText,
      trend: "+5%",
      color: "text-emerald-600",
      bg: "bg-emerald-600/10",
      border: "border-emerald-600/20",
    },
    {
      title: "Candidatures",
      value: stats.applications,
      icon: Activity,
      trend: "+18%",
      color: "text-purple-600",
      bg: "bg-purple-600/10",
      border: "border-purple-600/20",
    },
  ];

  return (
    <DashboardLayout role="admin" title="Vue d'ensemble">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className={`relative overflow-hidden rounded-2xl border ${stat.border} bg-card p-6 shadow-sm transition-all hover:shadow-card-hover`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <h3 className="font-heading text-3xl font-bold tracking-tight text-foreground">
                    {loading ? "..." : stat.value}
                  </h3>
                  <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    {stat.trend}
                  </span>
                </div>
              </div>
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${stat.bg}`}>
                <stat.icon className={`h-7 w-7 ${stat.color}`} />
              </div>
            </div>
            {/* Decorative background accent */}
            <div className={`absolute -bottom-6 -right-6 h-24 w-24 rounded-full ${stat.bg} blur-2xl`}></div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="border-b border-border bg-slate-50/50 p-6">
          <h2 className="font-heading text-lg font-bold text-foreground">
            Inscriptions récentes
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Les 5 derniers utilisateurs inscrits sur la plateforme.
          </p>
        </div>

        <div className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/80 text-xs font-semibold uppercase text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-6 py-4">Utilisateur</th>
                  <th className="px-6 py-4">Rôle</th>
                  <th className="px-6 py-4">Date d'inscription</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-muted-foreground">
                      <span className="flex items-center justify-center gap-2">
                        <span className="h-4 w-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></span>
                        Chargement...
                      </span>
                    </td>
                  </tr>
                ) : stats.recentActivity.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-12 text-center text-muted-foreground">
                      Aucune activité récente.
                    </td>
                  </tr>
                ) : (
                  stats.recentActivity.map((user, i) => (
                    <tr key={i} className="transition-colors hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-medium text-primary">
                            {user.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-muted-foreground text-xs">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          user.role === 'recruiter' 
                            ? 'bg-accent/10 text-accent' 
                            : user.role === 'admin' 
                              ? 'bg-destructive/10 text-destructive' 
                              : 'bg-primary/10 text-primary'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
