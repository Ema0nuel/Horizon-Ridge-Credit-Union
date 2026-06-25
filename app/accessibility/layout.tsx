import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibility and Inclusion",
  description: "Horizon Ridge Credit Union is committed to accessibility and inclusion. Learn about our efforts to provide accessible banking services for all members.",
  openGraph: {
    title: "Accessibility and Inclusion - Horizon Ridge Credit Union",
    description: "Our commitment to providing accessible banking services for all members.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@HorizonRidgeCU",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
