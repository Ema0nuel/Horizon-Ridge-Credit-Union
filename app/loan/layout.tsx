import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personal Loans",
  description: "Explore Horizon Ridge Credit Union personal loan options. Competitive rates for home loans, auto loans, debt consolidation, and more.",
  openGraph: {
    title: "Personal Loans - Horizon Ridge Credit Union",
    description: "Find the right loan for your needs. Competitive rates and flexible terms from Horizon Ridge.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@HorizonRidgeCU",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
