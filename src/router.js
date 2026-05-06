import { startPreloader, endPreloader } from "./utils/preloader";
import { renderFlagLanguageToggle } from "./components/translateWidget";
import { setActiveNav } from "./utils/active";

// User routes - All user related routes
const userRoutes = {
  "user/auth": () => import("./views/user/authentication.js"),
  "user/login": () => import("./views/user/loginView.js"),
  "user/signup": () => import("./views/user/signupView.js"),
  "user/register": () => import("./views/user/signupView.js"),
  "user/forgot-password": () => import("./views/user/forgotPassword.js"),
  "user/reset-password": () => import("./views/user/resetPassword.js"),
  "user/dashboard": () => import("./views/user/dashboard.js"),
  "user/profile": () => import("./views/user/profile.js"),
  "user/withdrawal": () => import("./views/user/withdrawal.js"),
  "user/deposit": () => import("./views/user/deposit.js"),
  "user/contact": () => import("./views/user/contact.js"),
  "user/loan": () => import("./views/user/loan.js"),
  "user/cards": () => import("./views/user/cards.js"),
  "user/transfer/local": () => import("./views/user/transfers/local.js"),
  "user/transfer/wire": () => import("./views/user/transfers/wire.js"),
  "user/transfer/interbank": () => import("./views/user/transfers/interbank.js"),
  "user/edit-profile": () => import("./views/user/edit-profile.js"),
  "user/account-summary": () => import("./views/user/accountSummary.js"),
};

// Admin routes - All admin related routes
const adminRoutes = {
  "admin/dashboard": () => import("./views/admin/dashboard.js"),
  "admin/users": () => import("./views/admin/users.js"),
  "admin/userDetails": () => import("./views/admin/userDetails.js"),
  "admin/transactions": () => import("./views/admin/transactions.js"),
  "admin/notifications": () => import("./views/admin/notifications.js"),
  "admin/loans": () => import("./views/admin/loans.js"),
  "admin/cards": () => import("./views/admin/cards.js"),
  "admin/settings": () => import("./views/admin/settings.js"),
  "admin/codes": () => import("./views/admin/codes.js"),
  "admin-login": () => import("./views/admin/adminLogin.js"),
};

// Security routes - All security related routes
const securityRoutes = {
  "security/terms": "terms",
  "security/important-info": "importantInfo",
  "security/privacy": "privacy",
  "security/security": "security",
  "security/target-market": "targetMarket"
};

// Financial routes - All financial related routes
const financialRoutes = {
  "financial/abuse": "financial",
  "financial/difficulty": "financialD",
  "personal/enquiry": "personalEnquiry"
};

// Route aliases - For handling multiple path variations with cleaner organization
const routeAliases = {
  "": "home",
  "home": "home",
  "dashboard": "user/dashboard",
  "profile": "user/profile",
  "withdrawal": "user/withdrawal",
  "deposit": "user/deposit",
  "contact": "user/contact",
  "loan": "user/loan",
  "cards": "user/cards",
  "local-transfer": "user/transfer/local",
  "wire-transfer": "user/transfer/wire",
  "edit-profile": "user/edit-profile",
  "interbank-transfer": "user/transfer/interbank",
  "account-summary": "user/account-summary",
  "locate-us": "locate",
  "switch-now": "switch",
  ...securityRoutes,
  ...financialRoutes
};

// Main routes object - Combines all routes with clear categorization
const routes = {
  // Auth routes
  login: () => import("./views/user/loginView.js"),
  signup: () => import("./views/user/signupView.js"),
  register: () => import("./views/user/signupView.js"),
  auth: () => import("./views/user/authentication.js"),
  verify: () => import("./views/user/verify.js"),
  "forgot-password": () => import("./views/user/forgotPassword.js"),
  "reset-password": () => import("./views/user/resetPassword.js"),
  // 'reset-password': () => import("./views/user/resetPassword"),

  // Basic routes
  home: () => import("./views/homeView.js"),
  notfound: () => import("./views/notfound.js"),
  about: () => import("./views/aboutView.js"),
  personal: () => import("./views/personal.js"),
  personalEnquiry: () => import("./views/personal-enquiry.js"),
  "contact-us": () => import("./views/contactView.js"),
  business: () => import("./views/business.js"),
  community: () => import("./views/community.js"),
  accessibility: () => import("./views/accessibility.js"),
  support: () => import("./views/support.js"),
  locate: () => import("./views/locate-us.js"),
  switch: () => import("./views/switch.js"),
  'financial-abuse': () => import("./views/security/targetMarket.js"),
  'financial-difficulty': () => import("./views/security/security.js"),
  'target-market': () => import("./views/security/targetMarket.js"),
  'important-info': () => import("./views/security/importantInfo.js"),

  // Security routes
  financial: () => import("./views/financialAbuse.js"),
  financialD: () => import("./views/financialDifficulty.js"),
  terms: () => import("./views/security/termsView.js"),
  importantInfo: () => import("./views/security/importantInfo.js"),
  privacy: () => import("./views/security/privacy.js"),
  security: () => import("./views/security/security.js"),
  targetMarket: () => import("./views/security/targetMarket.js"),

  // Include user and admin routes
  ...userRoutes,
  ...adminRoutes,
};

// Clean URL paths
function cleanPath(pathname) {
  return pathname.replace(/^\/+/, "").split(/[?#]/)[0];
}

// Parse path to get route
export function parsePathToRoute(pathname) {
  const clean = cleanPath(pathname);

  // Handle admin routes
  if (clean.startsWith("admin/")) {
    if (adminRoutes[clean]) return { page: clean };
    if (/^admin\/user\/\w+/.test(clean)) {
      const [, , userId] = clean.split("/");
      return { page: "admin/userDetails", args: [userId] };
    }
    return { page: "notfound" };
  }

  // Handle user routes
  if (clean.startsWith("user/")) {
    if (userRoutes[clean]) return { page: clean };
    if (/^user\/transaction-details\/\w+/.test(clean)) {
      const [, , transactionId] = clean.split("/");
      return { page: "user/transaction-details", args: [transactionId] };
    }
  }

  // Handle route aliases
  const aliasedRoute = routeAliases[clean];
  if (aliasedRoute) return { page: aliasedRoute };

  // Handle direct routes
  return routes[clean] ? { page: clean } : { page: "notfound" };
}

// Get URL path from route
function getPathForRoute(page, ...args) {
  if (page === "admin/userDetails") return `/admin/user/${args[0] || ""}`;
  if (page === "user/transaction-details") return `/user/transaction-details/${args[0] || ""}`;
  if (page === "home") return "/";
  if (page === "verify") return "/verify";
  return `/${page}`;
}

// Main page loader function
export async function loadPage(page, ...args) {
  const app = window.app;
  startPreloader();
  app.style.visibility = "hidden";

  try {
    const module = await routes[page]();
    const render = module.default || module;
    const { html, pageEvents } = await render(...args);

    app.innerHTML = html;
    setActiveNav(page);
    pageEvents?.();

    endPreloader();
    app.style.visibility = "visible";

    const path = getPathForRoute(page, ...args);
    if (window.location.pathname !== path) {
      window.history.pushState({ page, args }, "", path);
    }

  } catch (error) {
    console.error("[Router Error]", error);
    const notFoundModule = await routes.notfound();
    const { html } = await notFoundModule.default();
    app.innerHTML = html;
    app.style.visibility = "visible";
    endPreloader();
  }
}

// Event Listeners
window.addEventListener("popstate", async (e) => {
  const { page, args } = e.state || parsePathToRoute(window.location.pathname);
  await loadPage(page, ...(args || []));
});

window.addEventListener("DOMContentLoaded", async () => {
  if (!window.app) {
    const appDiv = document.createElement("div");
    appDiv.id = "app";
    document.body.prepend(appDiv);
    window.app = appDiv;
  }

  const { page, args } = parsePathToRoute(window.location.pathname);
  if (page === "notfound" && (window.location.pathname === "/login" || window.location.pathname === "/user/login")) {
    await loadPage("login");
  } else {
    await loadPage(page, ...(args || []));
  }

  document.body.appendChild(renderFlagLanguageToggle());
});