const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api";

export const authStorage = {
  getToken() {
    return localStorage.getItem("hirestack_token");
  },
  getUser() {
    const rawUser = localStorage.getItem("hirestack_user");

    if (!rawUser) {
      return null;
    }

    try {
      return JSON.parse(rawUser);
    } catch {
      return null;
    }
  },
  setSession({ token, user }) {
    localStorage.setItem("hirestack_token", token);
    localStorage.setItem("hirestack_user", JSON.stringify(user));
  },
  clearSession() {
    localStorage.removeItem("hirestack_token");
    localStorage.removeItem("hirestack_user");
  },
};

export const dashboardPathForRole = (role) => {
  const routes = {
    admin: "/admin",
    recruiter: "/recruiter",
    seeker: "/seeker",
  };

  return routes[role] ?? "/";
};

export const nextPathForUser = (user) => {
  if (user?.role === "seeker" && user.profileCompleted === false) {
    return "/seeker/onboarding";
  }

  return dashboardPathForRole(user?.role);
};

export async function apiRequest(path, options = {}) {
  const token = authStorage.getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers ?? {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const body = await response.json().catch(() => null);

  if (!response.ok || body?.success === false) {
    throw new Error(body?.error?.message ?? "Une erreur est survenue.");
  }

  return body.data;
}

export const authApi = {
  me() {
    return apiRequest("/auth/me");
  },
  logout() {
    return apiRequest("/auth/logout", {
      method: "POST",
      body: JSON.stringify({}),
    });
  },
};

export const seekerProfileApi = {
  get() {
    return apiRequest("/seeker/profile");
  },
  update(payload) {
    return apiRequest("/seeker/profile", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
};

export const jobsApi = {
  list(params = {}) {
    const search = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        search.set(key, value);
      }
    });

    const query = search.toString();

    return apiRequest(`/jobs${query ? `?${query}` : ""}`);
  },
  get(id) {
    return apiRequest(`/jobs/${id}`);
  },
};

export const recruiterJobsApi = {
  list() {
    return apiRequest("/recruiter/jobs");
  },
  create(payload) {
    return apiRequest("/recruiter/jobs", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

export const adminApi = {
  getStats() {
    return apiRequest("/admin/stats");
  }
};
