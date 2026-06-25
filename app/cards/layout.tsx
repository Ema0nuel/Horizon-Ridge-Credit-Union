import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Credit Cards",
  description: "Explore Horizon Ridge Credit Union credit card options. Compare rewards, low-rate, and balance transfer cards designed for your lifestyle.",
  openGraph: {
    title: "Credit Cards - Horizon Ridge Credit Union",
    description: "Find the right credit card for your needs. Compare rewards, rates, and benefits from Horizon Ridge.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@HorizonRidgeCU",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
