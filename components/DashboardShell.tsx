"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabaseClient";

interface Profile {
  full_name: string;
  avatar_url?: string;
}

const MOBILE_TABS = [
  { href: "/dashboard", icon: "fa-house", label: "Home" },
  { href: null, icon: "fa-arrow-right-arrow-left", label: "Transfer", isAction: true },
  { href: "/cards", icon: "fa-credit-card", label: "Cards" },
  { href: "/account-summary", icon: "fa-clock-rotate", label: "Activity" },
];

const TRANSFER_ACTIONS = [
  { href: "/deposit", icon: "fa-arrow-right-to-bracket", label: "Deposit", desc: "Add funds" },
  { href: "/withdrawal", icon: "fa-money-bill-transfer", label: "Withdraw", desc: "Send to bank" },
  { href: "/local-transfer", icon: "fa-location-dot", label: "Local Transfer", desc: "Within HRCU" },
  { href: "/interbank-transfer", icon: "fa-building-columns", label: "Inter-Bank", desc: "Other banks" },
  { href: "/wire-transfer", icon: "fa-coins", label: "Wire Transfer", desc: "International" },
];

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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [transferSheetOpen, setTransferSheetOpen] = useState(false);

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

  // Determine active mobile tab
  const activeTab = MOBILE_TABS.find((t) => t.href && pathname.startsWith(t.href))?.href || "/dashboard";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16 md:pb-0">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 md:h-12 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between h-full px-3">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
              className="hidden md:inline-flex p-1.5 rounded text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <i className="fa-solid fa-bars text-sm" />
            </button>
            <Link href="/dashboard">
              <Image
                src="/images/logo.jpg"
                alt="Horizon Ridge"
                width={36}
                height={36}
                className="h-9 w-auto"
              />
            </Link>
          </div>
          <div className="flex items-center gap-2">
            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {profile?.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.full_name || "User"}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-brand-sun flex items-center justify-center text-white text-xs font-medium">
                    {profile?.full_name?.charAt(0) || "U"}
                  </div>
                )}
                <span className="text-xs font-medium text-gray-900 dark:text-gray-100 hidden sm:block">
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
        className={`fixed left-0 top-14 md:top-12 bottom-0 z-40 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-sm overflow-y-auto transition-transform duration-300 md:transition-[width] md:duration-300 ${
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
        className={`pt-14 md:pt-12 transition-[margin] duration-300 ${
          sidebarCollapsed ? "md:ml-14" : "md:ml-56"
        } ml-0`}
      >
        {children}
      </div>

      {/* Bottom Tab Bar - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 safe-area-bottom">
        <div className="flex items-center justify-around h-14 px-1">
          {MOBILE_TABS.map((tab, i) => {
            if (tab.isAction) {
              // Center FAB-style action button
              return (
                <button
                  key={i}
                  onClick={() => setTransferSheetOpen(true)}
                  className="relative -top-3 flex flex-col items-center justify-center w-14 h-14 rounded-full bg-brand-sun text-white shadow-lg hover:bg-brand-navy transition-colors active:scale-95"
                  aria-label="Transfer funds"
                >
                  <i className="fa-solid fa-arrow-right-arrow-left text-lg" />
                </button>
              );
            }
            const isActive = pathname === tab.href || (tab.href && pathname.startsWith(tab.href));
            return (
              <Link
                key={i}
                href={tab.href!}
                className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-lg min-w-[56px] transition-colors ${
                  isActive
                    ? "text-brand-sun"
                    : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                }`}
              >
                <i className={`fa-solid ${tab.icon} text-lg leading-none`} />
                <span className="text-[10px] font-medium leading-tight">{tab.label}</span>
              </Link>
            );
          })}
          {/* Empty spacer at end to avoid JivoChat overlap */}
          <div className="min-w-[56px]" />
        </div>
      </nav>

      {/* Transfer Action Sheet */}
      {transferSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setTransferSheetOpen(false)}
          />
          <div className="relative bg-white dark:bg-gray-900 rounded-t-2xl md:rounded-2xl w-full max-w-md mx-auto shadow-2xl animate-slide-up pb-6 md:pb-4">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
            </div>

            <div className="px-6 pb-4">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                Transfer Funds
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Choose a transfer method
              </p>

              <div className="grid grid-cols-2 gap-3">
                {TRANSFER_ACTIONS.map((action, i) => (
                  <Link
                    key={i}
                    href={action.href}
                    onClick={() => setTransferSheetOpen(false)}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:bg-brand-sun/5 hover:border-brand-sun/30 transition-colors active:scale-[0.97]"
                  >
                    <div className="w-10 h-10 rounded-full bg-brand-sun/10 dark:bg-brand-sun/20 flex items-center justify-center">
                      <i className={`fa-solid ${action.icon} text-brand-sun text-base`} />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-semibold text-gray-900 dark:text-white">
                        {action.label}
                      </p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500">
                        {action.desc}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
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
