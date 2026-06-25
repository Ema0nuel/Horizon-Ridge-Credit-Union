import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personal loans",
  description: "Bringing your plans to life.",
  keywords: [
    "Horizon Ridge",
    "Credit Union",
    "Personal",
    "Loans",
    "Personal loans",
    "Banking",
    "Finance",
    "Loan types",
    "Secured loans",
    "Unsecured loans",
    "Loan calculator",
  ],
  openGraph: {
    title: "Personal loans",
    description: "Bringing your plans to life.",
    siteName: "Horizon Ridge Credit Union",
    url: "https://horizonridge.cc/personal",
  },
  twitter: {
    card: "summary_large_image",
    title: "Personal loans",
    description: "Bringing your plans to life.",
    site: "@HorizonRidgeCU",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}