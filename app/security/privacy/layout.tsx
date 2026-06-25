import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Horizon Ridge Credit Union is committed to protecting your privacy. Read our full privacy policy to understand how we handle your personal information.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
