import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secure Authentication",
  description: "Learn about Horizon Ridge Credit Union multi-factor authentication and security measures that protect your online banking accounts.",
  openGraph: {
    title: "Secure Authentication - Horizon Ridge Credit Union",
    description: "Multi-factor authentication and advanced security measures to protect your accounts.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@HorizonRidgeCU",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
