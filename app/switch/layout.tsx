import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Switch Your Banking to Horizon Ridge",
  description: "Switching your banking to Horizon Ridge Credit Union is easy. Enjoy competitive rates, no account fees, and a seamless transfer experience.",
  openGraph: {
    title: "Switch Your Banking - Horizon Ridge Credit Union",
    description: "Make the switch to Horizon Ridge Credit Union. Easy transfer process, competitive rates, and better banking experience.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@HorizonRidgeCU",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
