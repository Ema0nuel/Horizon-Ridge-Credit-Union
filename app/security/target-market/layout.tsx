import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Target Market Determination",
  description: "Target Market Determinations (TMD) for Horizon Ridge Credit Union financial products. Information on which products suit different customer needs.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
