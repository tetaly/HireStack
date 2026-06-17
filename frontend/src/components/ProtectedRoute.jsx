import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authApi, authStorage, dashboardPathForRole } from "@/lib/api";

const ProtectedRoute = ({ children, roles }) => {
  const location = useLocation();
  const [state, setState] = useState({
    loading: true,
    user: null,
  });

  useEffect(() => {
    let active = true;

    const verifySession = async () => {
      if (!authStorage.getToken()) {
        authStorage.clearSession();
        setState({ loading: false, user: null });
        return;
      }

      try {
        const data = await authApi.me();

        if (!active) {
          return;
        }

        authStorage.setSession({
          token: authStorage.getToken(),
          user: data.user,
        });
        setState({ loading: false, user: data.user });
      } catch {
        if (!active) {
          return;
        }

        authStorage.clearSession();
        setState({ loading: false, user: null });
      }
    };

    verifySession();

    return () => {
      active = false;
    };
  }, []);

  if (state.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Verification de la session...
      </div>
    );
  }

  if (!state.user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles?.length && !roles.includes(state.user.role)) {
    return <Navigate to={dashboardPathForRole(state.user.role)} replace />;
  }

  if (
    state.user.role === "seeker" &&
    state.user.profileCompleted === false &&
    location.pathname !== "/seeker/onboarding"
  ) {
    return <Navigate to="/seeker/onboarding" replace />;
  }

  return children;
};

export default ProtectedRoute;
