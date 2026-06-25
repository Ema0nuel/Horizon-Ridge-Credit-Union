import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Important Information",
  description: "Important information about your accounts, fees, interest rates, and terms with Horizon Ridge Credit Union.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
