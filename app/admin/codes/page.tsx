"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";
import { requireAdmin } from "@/lib/adminAuth";

export default function AdminCodes() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!requireAdmin()) {
      router.push("/admin-login");
      return;
    }
    setLoading(false);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const emailInput = form.elements.namedItem("email") as HTMLInputElement;
    const typeInput = form.elements.namedItem("type") as HTMLSelectElement;
    const emailVal = emailInput?.value || (formData.get("email") as string);
    const type = typeInput?.value || (formData.get("type") as string);

    if (!emailVal || !type) {
      setMessage({ type: "error", text: "Email and code type required" });
      return;
    }

    setSending(true);
    try {
      const supabase = createClient();
      const code = Math.floor(100000 + Math.random() * 900000);

      const { data: user } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", emailVal)
        .single();

      if (user) {
        await supabase.from("otps").insert([
          {
            user_id: user.id,
            code: code.toString(),
            type,
            expires_at: new Date(Date.now() + 10 * 60000).toISOString(),
          },
        ]);
      }

      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: emailVal,
          subject: `${type} Code`,
          html: `<h2>Your ${type} Code</h2><p>${code}</p>`,
        }),
      });

      setMessage({ type: "success", text: `${type} code sent to ${emailVal}` });
      form.reset();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to generate code" });
    } finally {
      setSending(false);
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

  return (
    <div className="space-y-6">
      <div>
        <nav className="flex text-sm text-gray-500 dark:text-gray-400 mb-2">
          <a href="/admin/dashboard" className="hover:text-brand-sun">Dashboard</a>
          <span className="mx-2">/</span>
          <span className="text-gray-700 dark:text-gray-300">Codes</span>
        </nav>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Generate Codes
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Generate IMF, VAT, and COT codes for users
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

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 max-w-lg">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Code Generator
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              User Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
              placeholder="user@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Code Type
            </label>
            <select
              name="type"
              required
              className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
            >
              <option value="IMF">IMF</option>
              <option value="VAT">VAT</option>
              <option value="COT">COT</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={sending}
            className="w-full bg-brand-sun hover:bg-brand-navy disabled:bg-brand-sun/50 disabled:opacity-50 disabled:cursor-not-allowed text-white font-normal py-2.5 px-4 rounded-xl transition-colors text-sm"
          >
            {sending ? <i className="fa-solid fa-spinner fa-spin mr-1"></i> : <i className="fa-regular fa-key mr-1"></i>}
            {sending ? "Generating..." : "Generate and Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
