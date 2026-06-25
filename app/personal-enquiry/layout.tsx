import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit an Enquiry",
  description: "Have a question about Horizon Ridge Credit Union products or services? Submit an enquiry and our team will get back to you.",
  openGraph: {
    title: "Submit an Enquiry - Horizon Ridge Credit Union",
    description: "Get in touch with our team. Submit your enquiry and we will respond promptly.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@HorizonRidgeCU",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
