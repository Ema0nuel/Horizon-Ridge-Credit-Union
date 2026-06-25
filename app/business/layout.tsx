import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your business matters",
  description: "Everything you need to make business banking easy",
  keywords: [
    "Horizon Ridge",
    "Credit Union",
    "Business",
    "Business banking",
    "Loans",
    "Accounts",
    "Cash flow",
    "Commercial",
    "Finance",
  ],
  openGraph: {
    title: "Your business matters",
    description: "Everything you need to make business banking easy",
    siteName: "Horizon Ridge Credit Union",
    url: "https://horizonridge.cc/business",
  },
  twitter: {
    card: "summary_large_image",
    title: "Your business matters",
    description: "Everything you need to make business banking easy",
    site: "@HorizonRidgeCU",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}