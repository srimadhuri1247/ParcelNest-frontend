
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      password,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Login failed.");
  }

  if (!data.token || !data.user) {
    throw new Error("The server returned an invalid login response.");
  }

  return data;
}

export function getDashboardPath(role) {
  const paths = {
    USER: "/user/dashboard",
    MANAGER: "/manager/dashboard",
    ADMIN: "/admin/dashboard",
  };

  return paths[role] || "/";
}
