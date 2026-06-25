// Shared SEO configuration and helpers for Horizon Ridge Credit Union
// Domain: horizonridge.cc

export const siteConfig = {
  name: "Horizon Ridge Credit Union",
  shortName: "Horizon Ridge",
  tagline: "Secure, trusted online banking for your financial future",
  url: "https://horizonridge.cc",
  locale: "en_US",
  localeFull: "en-US",
  twitterHandle: "@HorizonRidgeCU",
  defaultOgImage: "/images/logo.jpg",
  defaultOgImageAlt: "Horizon Ridge Credit Union - Online Banking",
  themeColor: "#1e3a8a", // brand-navy
  backgroundColor: "#f9fafb",
  phone: "+1-800-HORIZON",
  email: "support@horizonridge.cc",
  address: {
    street: "100 Ridge Boulevard",
    city: "Mountain View",
    state: "CO",
    zip: "80001",
    country: "US",
  },
  foundingDate: "1985-03-15",
} as const;

// Public routes that should be indexed
export const publicRoutes = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/personal", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/business", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/support", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/locate-us", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/community", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/switch", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/security", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/security/important-info", priority: 0.4, changeFrequency: "monthly" as const },
  { path: "/security/privacy", priority: 0.4, changeFrequency: "monthly" as const },
  { path: "/security/target-market", priority: 0.3, changeFrequency: "monthly" as const },
  { path: "/security/terms", priority: 0.4, changeFrequency: "monthly" as const },
  { path: "/financial-abuse", priority: 0.4, changeFrequency: "monthly" as const },
  { path: "/financial-difficulty", priority: 0.4, changeFrequency: "monthly" as const },
  { path: "/accessibility", priority: 0.4, changeFrequency: "monthly" as const },
  { path: "/authentication", priority: 0.3, changeFrequency: "monthly" as const },
  { path: "/personal-enquiry", priority: 0.3, changeFrequency: "monthly" as const },
  { path: "/login", priority: 0.3, changeFrequency: "monthly" as const },
  { path: "/signup", priority: 0.3, changeFrequency: "monthly" as const },
  { path: "/forgot-password", priority: 0.2, changeFrequency: "monthly" as const },
  { path: "/cards", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/loan", priority: 0.5, changeFrequency: "monthly" as const },
];

// Dashboard and admin routes that should NOT be indexed
export const noindexRoutes = [
  "/dashboard",
  "/dashboard/",
  "/profile",
  "/account-summary",
  "/deposit",
  "/withdrawal",
  "/loan",
  "/cards",
  "/edit-profile",
  "/interbank-transfer",
  "/local-transfer",
  "/wire-transfer",
  "/admin",
  "/admin/",
  "/admin/dashboard",
  "/admin/users",
  "/admin/transactions",
  "/admin/loans",
  "/admin/cards",
  "/admin/notifications",
  "/admin/settings",
  "/admin/codes",
  "/admin/user-details",
  "/verify",
  "/reset-password",
  "/admin-login",
];

// Generate JSON-LD Organization schema
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "CreditUnion",
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo.jpg`,
    image: `${siteConfig.url}${siteConfig.defaultOgImage}`,
    description: siteConfig.tagline,
    foundingDate: siteConfig.foundingDate,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.state,
      postalCode: siteConfig.address.zip,
      addressCountry: siteConfig.address.country,
    },
    sameAs: [
      "https://facebook.com/horizonridgecu",
      "https://twitter.com/horizonridgecu",
      "https://linkedin.com/company/horizonridgecu",
    ],
    department: [
      {
        "@type": "FinancialService",
        name: "Personal Banking",
        description: "Personal checking, savings, loans, and credit cards",
      },
      {
        "@type": "FinancialService",
        name: "Business Banking",
        description: "Business accounts, loans, and merchant services",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Banking Services",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Checking Accounts" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Savings Accounts" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Home Loans" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Credit Cards" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Wire Transfers" } },
      ],
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "15243",
      bestRating: "5",
    },
    knowsAbout: ["Personal Finance", "Mortgages", "Business Banking", "Wealth Management"],
  };
}

// Generate JSON-LD WebSite schema
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.tagline,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// Generate JSON-LD BreadcrumbList schema
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  };
}

// Generate JSON-LD LocalBusiness schema for branch locations
export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.name,
    image: `${siteConfig.url}/images/logo.jpg`,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.state,
      postalCode: siteConfig.address.zip,
      addressCountry: siteConfig.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 39.5501,
      longitude: -105.7821,
    },
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Monday", opens: "09:00", closes: "17:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Tuesday", opens: "09:00", closes: "17:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Wednesday", opens: "09:00", closes: "17:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Thursday", opens: "09:00", closes: "17:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Friday", opens: "09:00", closes: "18:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:00", closes: "13:00" },
    ],
    priceRange: "$$",
    areaServed: "US",
  };
}
