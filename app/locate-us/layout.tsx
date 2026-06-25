import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find a Branch or ATM",
  description: "Find Horizon Ridge Credit Union branch locations and ATMs near you. Visit us in person for personalized banking assistance.",
  openGraph: {
    title: "Find a Branch or ATM - Horizon Ridge Credit Union",
    description: "Locate your nearest Horizon Ridge Credit Union branch or ATM for in-person banking services.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@HorizonRidgeCU",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
