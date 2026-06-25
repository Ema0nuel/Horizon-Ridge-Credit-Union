"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabaseClient";

const SETTINGS_GROUPS = [
  {
    key: "interest",
    label: "Interest Settings",
    fields: [
      { key: "usd_saving_interest", label: "USD Saving Interest (%)", type: "number", step: "0.01" },
      { key: "money_market_interest", label: "Money Market Interest (%)", type: "number", step: "0.01" },
    ],
  },
  {
    key: "tx_limits",
    label: "Transaction Limits",
    fields: [
      { key: "daily_transfer_limit", label: "Daily Transfer Limit ($)", type: "number" },
      { key: "withdrawal_limit", label: "Withdrawal Limit ($)", type: "number" },
      { key: "min_balance_required", label: "Minimum Balance Required ($)", type: "number", step: "0.01" },
    ],
  },
  {
    key: "loan_defaults",
    label: "Loan Defaults",
    fields: [
      { key: "default_loan_interest", label: "Default Loan Interest (%)", type: "number", step: "0.01" },
      { key: "max_loan_duration", label: "Max Loan Duration (months)", type: "number" },
      { key: "min_loan_amount", label: "Minimum Loan Amount ($)", type: "number" },
    ],
  },
  {
    key: "card_management",
    label: "Card Management",
    fields: [
      { key: "card_processing_fee", label: "Card Processing Fee ($)", type: "number", step: "0.01" },
      { key: "card_auto_issue", label: "Auto-Issue Virtual Cards?", type: "checkbox" },
    ],
  },
  {
    key: "system",
    label: "System Settings",
    fields: [
      {
        key: "system_status",
        label: "System Status",
        type: "select",
        options: ["online", "maintenance"],
      },
      { key: "maintenance_message", label: "Maintenance Message", type: "text" },
      { key: "support_email", label: "Support Email", type: "email" },
    ],
  },
];

interface SettingsMap {
  [key: string]: string;
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<SettingsMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!sessionStorage.getItem("admin_logged_in")) {
      window.location.href = "/admin-login";
      return;
    }

    const supabase = createClient();
    (async () => {
      const { data } = await supabase
        .from("settings")
        .select("*");
      if (data) {
        const obj: SettingsMap = {};
        data.forEach((s: { key: string; value: string }) => {
          obj[s.key] = s.value;
        });
        setSettings(obj);
      }
      setLoading(false);
    })();
  }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    const updates: { key: string; value: string }[] = [];

    SETTINGS_GROUPS.forEach((group) => {
      group.fields.forEach((field) => {
        let value: string;
        if (field.type === "checkbox") {
          value = formData.get(field.key) === "on" ? "true" : "false";
        } else {
          value = (formData.get(field.key) as string) || "";
        }
        updates.push({ key: field.key, value });
      });
    });

    try {
      const supabase = createClient();
      for (const s of updates) {
        await supabase.from("settings").upsert([s], { onConflict: "key" });
      }
      setMessage({ type: "success", text: "Settings saved successfully" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to save settings" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <i className="fa fa-spinner fa-spin text-3xl text-brand-sun mb-2"></i>
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  const renderField = (field: any) => {
    const value = settings[field.key] ?? "";

    if (field.type === "checkbox") {
      return (
        <label key={field.key} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30">
          <input
            type="checkbox"
            name={field.key}
            defaultChecked={value === "true"}
            className="h-4 w-4 rounded border-gray-300 text-brand-sun focus:ring-brand-sun"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">{field.label}</span>
        </label>
      );
    }

    if (field.type === "select") {
      return (
        <div key={field.key}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {field.label}
          </label>
          <select
            name={field.key}
            defaultValue={value}
            className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
          >
            {(field.options || []).map((opt: string) => (
              <option key={opt} value={opt}>
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </option>
            ))}
          </select>
        </div>
      );
    }

    return (
      <div key={field.key}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {field.label}
        </label>
        <input
          type={field.type}
          name={field.key}
          defaultValue={value}
          step={field.step}
          className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <nav className="flex text-sm text-gray-500 dark:text-gray-400 mb-2">
          <a href="/admin/dashboard" className="hover:text-brand-sun">Dashboard</a>
          <span className="mx-2">/</span>
          <span className="text-gray-700 dark:text-gray-300">Settings</span>
        </nav>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          System Settings
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Configure platform settings, limits, and defaults
        </p>
      </div>

      {message && (
        <div
          className={`px-4 py-3 rounded-xl text-sm font-medium ${
            message.type === "success"
              ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
              : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {SETTINGS_GROUPS.map((group) => (
          <div
            key={group.key}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {group.label}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {group.fields.map(renderField)}
            </div>
          </div>
        ))}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-brand-sun hover:bg-brand-navy disabled:bg-brand-sun/50 text-white font-medium py-2.5 px-6 rounded-xl transition-colors text-sm"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
