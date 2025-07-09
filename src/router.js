import { startPreloader, endPreloader } from "./utils/preloader";
import { renderFlagLanguageToggle } from "./components/translateWidget";
import { setActiveNav } from "./utils/active";

// --- ROUTE CONFIGURATION ---
// User routes
const userRoutes = {
  "user/auth": () => import("./views/user/authentication"),
  "user/dashboard": () => import("./views/user/dashboard"),
  "user/profile": () => import("./views/user/profile"),
  "user/withdrawal": () => import("./views/user/withdrawal"),
  "user/deposit": () => import("./views/user/deposit"),
  "user/contact": () => import("./views/user/contact"),
  "user/loan": () => import("./views/user/loan"),
  "user/cards": () => import("./views/user/cards"),
  "user/transfer/local": () => import("./views/user/transfers/local"),
  "user/transfer/wire": () => import("./views/user/transfers/wire"),
  "user/transfer/interbank": () => import("./views/user/transfers/interbank"),
  "user/edit-profile": () => import("./views/user/edit-profile"),
  "user/account-summary": () => import("./views/user/accountSummary"),
};

// Admin routes
const adminRoutes = {
  "admin/dashboard": () => import("./views/admin/dashboard"),
  "admin/users": () => import("./views/admin/users"),
  "admin/userDetails": () => import("./views/admin/userDetails"),
  "admin/transactions": () => import("./views/admin/transactions"),
  "admin/notifications": () => import("./views/admin/notifications"),
  "admin/loans": () => import("./views/admin/loans"),
  "admin/cards": () => import("./views/admin/cards"),
  "admin/settings": () => import("./views/admin/settings"),
  "admin/codes": () => import("./views/admin/codes"),
  "admin-login": () => import("./views/admin/adminLogin"),
};

// General/legacy routes
const routes = {
  home: () => import("./views/homeView"),
  notfound: () => import("./views/notfound"),
  about: () => import("./views/aboutView"),
  personal: () => import("./views/personal"),
  personalEnquiry: () => import("./views/personal-enquiry"),
  "contact-us": () => import("./views/contactView"),
  business: () => import("./views/business"),
  community: () => import("./views/community"),
  accessibility: () => import("./views/accessibility"),
  support: () => import("./views/support"),
  locate: () => import("./views/locate-us"),
  switch: () => import("./views/switch"),
  financial: () => import("./views/financialAbuse"),
  financialD: () => import("./views/financialDifficulty"),
  terms: () => import("./views/security/termsView"),
  importantInfo: () => import("./views/security/importantInfo"),
  privacy: () => import("./views/security/privacy"),
  security: () => import("./views/security/security"),
  targetMarket: () => import("./views/security/targetMarket"),
  login: () => import("./views/user/loginView"),
  signup: () => import("./views/user/signupView"),
  auth: () => import("./views/user/authentication"),
  verify: () => import("./views/user/verify"),
  ...userRoutes,
  ...adminRoutes,
};

function cleanPath(pathname) {
  return pathname.replace(/^\/+/, "").split(/[?#]/)[0];
}

export function parsePathToRoute(pathname) {
  const clean = cleanPath(pathname);

  // --- ADMIN ROUTES ---
  if (clean.startsWith("admin/")) {
    // e.g. /admin/dashboard, /admin/users, /admin/userDetails, etc.
    if (adminRoutes[clean]) return { page: clean };
    // Dynamic admin user details: /admin/user/:id
    if (/^admin\/user\/\w+/.test(clean)) {
      const [, , userId] = clean.split("/");
      return { page: "admin/userDetails", args: [userId] };
    }
    // Admin login
    if (clean === "admin-login") return { page: "admin-login" };
    return { page: "notfound" };
  }

  // --- USER ROUTES ---
  if (clean.startsWith("user/")) {
    if (userRoutes[clean]) return { page: clean };
    // Transaction details with dynamic id
    if (/^user\/transaction-details\/\w+/.test(clean)) {
      const [, , , transactionId] = clean.split("/");
      return { page: "user/transaction-details", args: [transactionId] };
    }
    return { page: "notfound" };
  }

  // --- GENERAL ROUTES ---
  if (clean === "" || clean === "home") return { page: "home" };
  if (clean === "user/auth" || clean === "auth") return { page: "user/auth" };
  if (clean === "user/dashboard" || clean === "dashboard") return { page: "user/dashboard" };
  if (clean === "user/transaction" || clean === "transaction") return { page: "user/transaction" };
  if (clean === "user/profile" || clean === "profile") return { page: "user/profile" };
  if (clean === "user/withdrawal" || clean === "withdrawal") return { page: "user/withdrawal" };
  if (clean === "user/deposit" || clean === "deposit") return { page: "user/deposit" };
  if (clean === "user/contact" || clean === "contact") return { page: "user/contact" };
  if (clean === "user/loan" || clean === "loan") return { page: "user/loan" };
  if (clean === "user/cards" || clean === "cards") return { page: "user/cards" };
  if (clean === "user/transfer/local" || clean === "transfer/local" || clean === "local-transfer") return { page: "user/transfer/local" };
  if (clean === "user/transfer/wire" || clean === "transfer/wire" || clean === "wire-transfer") return { page: "user/transfer/wire" };
  if (clean === "user/transfer/interbank" || clean === "transfer/interbank" || clean === "interbank-transfer") return { page: "user/transfer/interbank" };
  if (clean === "user/edit-profile" || clean === "edit-profile") return { page: "user/edit-profile" };
  if (clean === "user/account-summary" || clean === "account-summary") return { page: "user/account-summary" };
  if (/^user\/transaction-details\/\w+/.test(clean)) {
    const [, , , transactionId] = clean.split("/");
    return { page: "user/transaction-details", args: [transactionId] };
  }

  // Legacy and other routes
  if (clean === "personal/enquiry") return { page: "personalEnquiry" };
  if (clean === "locate-us" || clean === "locate") return { page: "locate" };
  if (clean === "contact-us" || clean === "contact-us") return { page: "contact-us" };
  if (clean === "switch-now" || clean === "switch") return { page: "switch" };
  if (clean === "financial/abuse" || clean === "financial-abuse") return { page: "financial" };
  if (clean === "financial/difficulty" || clean === "financial-difficulty") return { page: "financialD" };
  if (clean === "security/terms" || clean === "terms") return { page: "terms" };
  if (clean === "security/important-info" || clean === "important-info") return { page: "importantInfo" };
  if (clean === "security/privacy" || clean === "privacy") return { page: "privacy" };
  if (clean === "security/security" || clean === "security") return { page: "security" };
  if (clean === "security/target-market" || clean === "target-market") return { page: "targetMarket" };
  if (clean === "user/login" || clean === "login") return { page: "login" };
  if (clean === "user/signup" || clean === "register" || clean === "signup") return { page: "signup" };
  if (clean === "user/verify?verify-auth-user-login" || clean === "verify") return { page: "verify" };

  if (routes[clean]) return { page: clean };
  return { page: "notfound" };
}

function getPathForRoute(page, ...args) {
  // --- ADMIN PATHS ---
  if (page.startsWith("admin/")) {
    if (page === "admin/userDetails") return `/admin/user/${args[0] || ""}`;
    return `/${page}`;
  }
  // --- USER PATHS ---
  if (page.startsWith("user/")) {
    if (page === "user/transaction-details") return `/user/transaction-details/${args[0] || ""}`;
    return `/${page}`;
  }
  // --- GENERAL PATHS ---
  switch (page) {
    case "home":
      return "/";
    case "notfound":
      return "/notfound";
    case "about":
      return "/about";
    case "personal":
      return "/personal";
    case "personalEnquiry":
      return "/personal/enquiry";
    case "contact-us":
      return "/contact-us";
    case "business":
      return "/business";
    case "community":
      return "/community";
    case "support":
      return "/support";
    case "locate":
      return "/locate-us";
    case "switch":
      return "/switch";
    case "accessibility":
      return "/accessibility";
    case "financial":
      return "/financial/abuse";
    case "financialD":
      return "/financial/difficulty";
    case "terms":
      return "/security/terms";
    case "importantInfo":
      return "/security/important-info";
    case "privacy":
      return "/security/privacy";
    case "security":
      return "/security/security";
    case "targetMarket":
      return "/security/target-market";
    case "login":
      return "/user/login";
    case "signup":
      return "/user/signup";
    case "verify":
      return "/user/verify?verify-auth-user-login";
    default:
      if (routes[page]) return "/" + page;
      return "/";
  }
}

export async function loadPage(page, ...args) {
  const loadModule = routes[page] || routes["notfound"];
  const path = getPathForRoute(page, ...args);

  if (window.location.pathname !== path) {
    window.history.pushState({ page, args }, "", path);
  }

  const app = window.app;
  startPreloader();
  app.style.visibility = "hidden";

  try {
    await new Promise((res) => setTimeout(res, 150));

    const module = await loadModule();
    const render = module.default || module;
    const { html, pageEvents } = await render(...args);

    const wrapper = document.createElement("div");
    wrapper.id = "page-transition-wrapper";
    wrapper.style.transform = "translateY(40px) scale(0.98)";
    wrapper.style.transition = "transform 0.5s cubic-bezier(0.4,0,0.2,1)";
    wrapper.innerHTML = html;
    app.innerHTML = "";
    app.appendChild(wrapper);

    endPreloader(500);
    setTimeout(() => {
      app.style.visibility = "visible";
      requestAnimationFrame(() => {
        wrapper.style.transform = "translateY(0) scale(1)";
      });
    }, 500);

    setActiveNav(page);
    pageEvents?.();
  } catch (err) {
    console.error("[Router Error]", err);
    const fallbackModule = await routes["notfound"]();
    const fallbackRender = fallbackModule.default || fallbackModule;
    const fallback = await fallbackRender();
    app.innerHTML = fallback.html;
    app.style.visibility = "visible";
  }
}

// Handle browser navigation (back/forward)
window.addEventListener("popstate", async (e) => {
  const { page, args } = e.state || parsePathToRoute(window.location.pathname);
  await loadPage(page, ...(args || []));
});

// Initial page load
window.addEventListener("DOMContentLoaded", async () => {
  const { page, args } = parsePathToRoute(window.location.pathname);
  await loadPage(page, ...(args || []));
  document.body.appendChild(renderFlagLanguageToggle());
});