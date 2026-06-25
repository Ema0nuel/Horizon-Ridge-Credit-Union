"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabaseClient";
import { useTheme } from "@/components/ThemeProvider";

interface Profile {
  full_name: string;
  avatar_url?: string;
}

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { dark: isDarkMode, toggleTheme: toggleDark } = useTheme();

  useEffect(() => {
    const collapsed = localStorage.getItem("hrcu_sidebar") === "true";
    setSidebarCollapsed(collapsed);
  }, []);

  const closeMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(false);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/login");
        return;
      }
      supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          if (data) setProfile(data);
        });
    });
  }, [router]);

  const toggleSidebar = useCallback(() => {
    if (window.innerWidth < 768) {
      setMobileSidebarOpen((prev) => !prev);
    } else {
      setSidebarCollapsed((prev) => {
        const next = !prev;
        localStorage.setItem("hrcu_sidebar", next ? "true" : "false");
        return next;
      });
    }
  }, []);

  const handleLogout = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }, [router]);

  const navItems = [
    { href: "/dashboard", icon: "fa-house", label: "Dashboard" },
    { href: "/profile", icon: "fa-user", label: "My Profile" },
    { href: "/account-summary", icon: "fa-briefcase", label: "Account Summary" },
    { href: "/deposit", icon: "fa-dollar-sign", label: "Deposit" },
    { href: "/withdrawal", icon: "fa-money-bill-transfer", label: "Withdrawal" },
    { href: "/loan", icon: "fa-landmark", label: "Loan" },
    { href: "/cards", icon: "fa-credit-card", label: "Credit Cards" },
    {
      label: "Funds Transfer",
      icon: "fa-arrow-right-arrow-left",
      children: [
        { href: "/interbank-transfer", icon: "fa-building-columns", label: "Inter-Bank Transfer" },
        { href: "/local-transfer", icon: "fa-location-dot", label: "Local Transfer" },
        { href: "/wire-transfer", icon: "fa-coins", label: "Wire Transfer" },
      ],
    },
    {
      label: "Settings",
      icon: "fa-gear",
      children: [
        { href: "/edit-profile", icon: "fa-pen-to-square", label: "Edit Profile" },
      ],
    },
    {
      label: "Personal Banking",
      icon: "fa-building-columns",
      children: [
        { href: "/contact", icon: "fa-envelope", label: "Contact Us" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-12 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between h-full px-3">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
              className="p-1.5 rounded text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <i className="fa-solid fa-bars text-sm" />
            </button>
            <Link href="/dashboard">
              <Image
                src="/images/logo.jpg"
                alt="Horizon Ridge"
                width={28}
                height={28}
                className="h-7 w-auto"
              />
            </Link>
          </div>
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                aria-label="Notifications"
                className="relative p-1.5 rounded text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <i className="fa-regular fa-bell text-sm" />
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] rounded-full h-3.5 w-3.5 flex items-center justify-center" />
              </button>
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50">
                    <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="font-medium text-gray-900 dark:text-white text-xs">Notifications</h3>
                    </div>
                    <div className="p-4 text-center text-xs text-gray-400 dark:text-gray-500">
                      No new notifications
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="h-7 w-7 rounded-full bg-brand-sun flex items-center justify-center text-white text-xs font-medium">
                  {profile?.full_name?.charAt(0) || "U"}
                </div>
                <span className="text-xs font-normal text-gray-900 dark:text-gray-100 hidden sm:block">
                  {profile?.full_name || "User"}
                </span>
                <i className="fa-solid fa-caret-down text-[10px] text-gray-500 dark:text-gray-300" />
              </button>
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50">
                    <Link
                      href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs text-gray-700 dark:text-gray-200"
                    >
                      <i className="fa-regular fa-user" />
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs text-gray-700 dark:text-gray-200"
                    >
                      <i className="fa-solid fa-power-off" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleDark}
              aria-label="Toggle dark mode"
              className="p-1.5 rounded text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isDarkMode ? (
                <i className="fa-regular fa-sun text-sm" />
              ) : (
                <i className="fa-regular fa-moon text-sm" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile sidebar backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-12 bottom-0 z-40 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-sm overflow-y-auto transition-transform duration-300 md:transition-[width] md:duration-300 ${
          sidebarCollapsed ? "md:w-14" : "md:w-56"
        } w-64 ${
          mobileSidebarOpen
            ? "translate-x-0 shadow-2xl"
            : "-translate-x-full"
        } md:translate-x-0 md:shadow-sm`}
      >
        <nav className="pt-2 px-1">
          {navItems.map((item, i) =>
            item.children ? (
              <SidebarGroup
                key={i}
                icon={item.icon}
                label={item.label}
                collapsed={sidebarCollapsed}
                children={item.children}
                pathname={pathname}
              />
            ) : (
              <Link
                key={i}
                href={item.href}
                className={`flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-xs ${
                  pathname === item.href
                    ? "bg-brand-sun/10 text-brand-sun font-medium"
                    : "text-gray-700 dark:text-gray-200"
                }`}
              >
                <i className={`fa-solid ${item.icon} text-sm w-5 text-center`} />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </Link>
            )
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs"
          >
            <i className="fa-solid fa-power-off text-sm w-5 text-center" />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <div
        className={`pt-12 transition-[margin] duration-300 ${
          sidebarCollapsed ? "md:ml-14" : "md:ml-56"
        } ml-0`}
      >
        {children}
      </div>
    </div>
  );
}

function SidebarGroup({
  icon,
  label,
  collapsed,
  children,
  pathname,
}: {
  icon: string;
  label: string;
  collapsed: boolean;
  children: { href: string; icon: string; label: string }[];
  pathname: string;
}) {
  const [open, setOpen] = useState(
    children.some((c) => pathname === c.href)
  );

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs"
      >
        <i className={`fa-solid ${icon} text-sm w-5 text-center`} />
        {!collapsed && (
          <>
            <span className="flex-1 text-left">{label}</span>
            <i
              className={`fa-solid fa-angle-right text-[10px] transition-transform ${
                open ? "rotate-90" : ""
              }`}
            />
          </>
        )}
      </button>
      {open && !collapsed && (
        <div className="ml-6 mt-0.5 space-y-0.5">
          {children.map((child, i) => (
            <Link
              key={i}
              href={child.href}
              className={`flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-xs ${
                pathname === child.href
                  ? "text-brand-sun font-medium"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              <i className={`fa-solid ${child.icon} text-xs w-4 text-center`} />
              <span>{child.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
