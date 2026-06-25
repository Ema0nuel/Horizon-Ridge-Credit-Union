"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { requireAdmin, adminLogout } from "@/lib/adminAuth";
import { useTheme } from "@/components/ThemeProvider";

const sidebarItems = [
  { key: "dashboard", label: "Dashboard", icon: "fa-chart-pie", href: "/admin/dashboard" },
  { key: "users", label: "Users", icon: "fa-users", href: "/admin/users" },
  { key: "transactions", label: "Transactions", icon: "fa-arrow-right-arrow-left", href: "/admin/transactions" },
  { key: "loans", label: "Loans", icon: "fa-file-invoice-dollar", href: "/admin/loans" },
  { key: "cards", label: "Cards", icon: "fa-id-card", href: "/admin/cards" },
  { key: "notifications", label: "Notifications", icon: "fa-bell", href: "/admin/notifications" },
  { key: "codes", label: "Codes", icon: "fa-qrcode", href: "/admin/codes" },
  { key: "settings", label: "Settings", icon: "fa-gear", href: "/admin/settings" },
];

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const { dark: isDark, toggleTheme: toggleDark } = useTheme();

  useEffect(() => {
    if (!requireAdmin()) {
      router.push("/admin-login");
    } else {
      setAuthed(true);
    }
  }, [router]);

  const handleLogout = useCallback(() => {
    adminLogout();
    router.push("/admin-login");
  }, [router]);

  if (!authed) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-lg transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200 dark:border-gray-800">
          <Link href="/admin/dashboard" className="text-lg font-semibold text-brand-navy dark:text-brand-light">
            Admin Panel
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 lg:hidden"
          >
            <i className="fa-solid fa-xmark text-xl" />
          </button>
        </div>
        <nav className="p-3 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  isActive
                    ? "bg-brand-sun/10 text-brand-sun font-medium"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <i className={`fa-solid ${item.icon} w-5 text-center text-base`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="lg:ml-64 min-h-screen flex flex-col">
        <header className="sticky top-0 z-30 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between h-full px-4 lg:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-1.5 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
              >
                <i className="fa-solid fa-bars text-lg" />
              </button>
              <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
                {sidebarItems.find((i) => i.href === pathname || pathname.startsWith(i.href + "/"))?.label || "Admin"}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleDark}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {isDark ? (
                  <i className="fa-regular fa-sun text-base" />
                ) : (
                  <i className="fa-regular fa-moon text-base" />
                )}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-danger hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 transition-colors"
              >
                <i className="fa-solid fa-power-off" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
