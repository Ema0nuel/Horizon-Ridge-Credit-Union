import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Financial Difficulty Assistance",
  description: "If you are experiencing financial difficulty, Horizon Ridge Credit Union is here to help. Learn about available support options and hardship assistance programs.",
  openGraph: {
    title: "Financial Difficulty Assistance - Horizon Ridge Credit Union",
    description: "Get support and assistance if you are experiencing financial hardship. We are here to help.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@HorizonRidgeCU",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
