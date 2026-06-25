"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

const authPaths = ["/login", "/signup", "/forgot-password", "/reset-password", "/admin-login"];
const dashboardPrefix = ["/dashboard", "/profile", "/deposit", "/withdrawal", "/loan", "/cards", "/transfer", "/edit-profile", "/account-summary", "/interbank-transfer", "/local-transfer", "/wire-transfer", "/contact"];

export default function PublicLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAuth = authPaths.some((p) => pathname === p);
  const isDashboard = dashboardPrefix.some((p) => pathname === p || pathname.startsWith(p + "/"));
  const isAdmin = pathname.startsWith("/admin");
  const hideLayout = isAuth || isDashboard || isAdmin;

  if (hideLayout) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
