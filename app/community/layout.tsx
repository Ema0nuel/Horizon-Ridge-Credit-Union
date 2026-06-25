import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Be part of the Horizon Ridge Credit Union community",
  description: "Every day our customers help change and save lives, simply by banking with us.",
  keywords: [
    "Horizon Ridge",
    "Credit Union",
    "Community",
    "Community banking",
    "Social responsibility",
    "Local community",
    "Banking",
    "Finance",
  ],
  openGraph: {
    title: "Be part of the Horizon Ridge Credit Union community",
    description: "Every day our customers help change and save lives, simply by banking with us.",
    siteName: "Horizon Ridge Credit Union",
    url: "https://horizonridge.cc/community",
  },
  twitter: {
    card: "summary_large_image",
    title: "Be part of the Horizon Ridge Credit Union community",
    description: "Every day our customers help change and save lives, simply by banking with us.",
    site: "@HorizonRidgeCU",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}