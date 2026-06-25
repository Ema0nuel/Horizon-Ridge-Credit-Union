import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms and conditions for Horizon Ridge Credit Union banking products and services. Learn about account terms, fees, and your rights as a member.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
