import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Open an Account",
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}