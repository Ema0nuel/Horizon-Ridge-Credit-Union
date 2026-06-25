import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Financial Abuse Prevention",
  description: "Learn about financial abuse, how to recognize the signs, and where to get help. Horizon Ridge Credit Union is committed to protecting vulnerable customers.",
  openGraph: {
    title: "Financial Abuse Prevention - Horizon Ridge Credit Union",
    description: "Recognize the signs of financial abuse and learn how to protect yourself or someone you know.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@HorizonRidgeCU",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
