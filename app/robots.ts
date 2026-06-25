import { MetadataRoute } from "next";
import { siteConfig } from "../lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/about",
          "/personal",
          "/business",
          "/contact",
          "/support",
          "/locate-us",
          "/community",
          "/switch",
          "/security",
          "/security/important-info",
          "/security/privacy",
          "/security/target-market",
          "/security/terms",
          "/financial-abuse",
          "/financial-difficulty",
          "/accessibility",
          "/authentication",
          "/personal-enquiry",
          "/cards",
          "/loan",
        ],
        disallow: [
          "/dashboard",
          "/dashboard/",
          "/admin",
          "/admin/",
          "/profile",
          "/account-summary",
          "/deposit",
          "/withdrawal",
          "/edit-profile",
          "/interbank-transfer",
          "/local-transfer",
          "/wire-transfer",
          "/verify",
          "/api/",
          "/reset-password",
          "/admin-login",
        ],
      },
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
