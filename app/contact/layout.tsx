import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Horizon Ridge Credit Union. Contact our support team, visit a branch, or send us a message online.",
  openGraph: {
    title: "Contact Us - Horizon Ridge Credit Union",
    description: "Reach out to Horizon Ridge Credit Union. We are here to help with your banking needs.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@HorizonRidgeCU",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
