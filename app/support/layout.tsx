import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Support",
  description: "Get help with your Horizon Ridge Credit Union accounts. Contact our support team for assistance with online banking, loans, cards, and other services.",
  openGraph: {
    title: "Customer Support - Horizon Ridge Credit Union",
    description: "We are here to help. Contact Horizon Ridge Credit Union support for assistance with your accounts and banking needs.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@HorizonRidgeCU",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
