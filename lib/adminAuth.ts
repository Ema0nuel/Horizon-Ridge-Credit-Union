const ADMIN_EMAIL =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_ADMIN_EMAIL) ||
  "admin@horizonridge.cc";

const ADMIN_PASSWORD =
  (typeof process !== "undefined" && process.env.ADMIN_PASSWORD) || "12345EM@";

export function localAdminLogin(email: string, password: string): boolean {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("admin_logged_in", "true");
    }
    return true;
  }
  return false;
}

export function requireAdmin(): boolean {
  if (typeof window !== "undefined") {
    if (sessionStorage.getItem("admin_logged_in") === "true") {
      return true;
    }
  }
  return false;
}

export function adminLogout(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("admin_logged_in");
  }
}
