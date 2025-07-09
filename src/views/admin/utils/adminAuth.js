// Local admin validation using localStorage/sessionStorage

const ADMIN_EMAIL = "horizonridgecreditunion@gmail.com";
const ADMIN_PASSWORD = "12345EM@";

// Call this on login form submit
export function localAdminLogin(email, password) {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    sessionStorage.setItem("admin_logged_in", "true");
    return true;
  }
  return false;
}

// Call this on every admin page
export function requireAdmin() {
  if (sessionStorage.getItem("admin_logged_in") === "true") {
    return true;
  }
  window.location.href = "/admin-login";
  return false;
}

// Call this to logout
export function adminLogout() {
  sessionStorage.removeItem("admin_logged_in");
  window.location.href = "/admin-login";
}