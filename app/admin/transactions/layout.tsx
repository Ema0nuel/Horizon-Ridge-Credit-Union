import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Transactions",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
