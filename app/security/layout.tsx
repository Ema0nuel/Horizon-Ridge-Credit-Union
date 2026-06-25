import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security Center",
  description: "Protect yourself from fraud, identity theft, and scams. Learn how Horizon Ridge Credit Union keeps your accounts and personal information secure.",
  openGraph: {
    title: "Security Center - Horizon Ridge Credit Union",
    description: "Learn about fraud prevention, identity protection, and online security best practices from Horizon Ridge Credit Union.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@HorizonRidgeCU",
  },
};

export default function SecurityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
