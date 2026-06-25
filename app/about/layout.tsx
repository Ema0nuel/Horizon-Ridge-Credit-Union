import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The better big bank",
  description: "When you are a big bank, you have big responsibilities. The biggest of which is to do the right thing. It is something we have always been good at.",
  keywords: ["Horizon Ridge", "Credit Union", "About", "The better big bank", "community", "banking"],
  openGraph: {
    title: "The better big bank",
    description: "When you are a big bank, you have big responsibilities. The biggest of which is to do the right thing. It is something we have always been good at.",
    siteName: "Horizon Ridge Credit Union",
    url: "https://horizonridge.cc/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "The better big bank",
    description: "When you are a big bank, you have big responsibilities. The biggest of which is to do the right thing. It is something we have always been good at.",
    site: "@HorizonRidgeCU",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}