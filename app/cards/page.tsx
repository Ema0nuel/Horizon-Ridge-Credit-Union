"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";
import DashboardShell from "@/components/DashboardShell";

interface Profile {
  full_name: string;
  email: string;
}

interface Account {
  id: string;
  balance: number;
  account_number: string;
  account_type: string;
}

interface Card {
  id: string;
  card_type: string;
  card_number: string;
  card_holder: string;
  expiry_date: string;
  cvv: string;
  status: string;
  is_active: boolean;
  issued_at: string;
}

function generateCardNumber() {
  let n = "";
  for (let i = 0; i < 16; i++) n += Math.floor(Math.random() * 10);
  return n.replace(/(.{4})/g, "$1 ").trim();
}

function generateCVV() {
  return "" + Math.floor(100 + Math.random() * 900);
}

function generateExpiry() {
  const now = new Date();
  const year = now.getFullYear() + 4;
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  return `${month}/${year.toString().slice(-2)}`;
}

const fmtDate = (date: string | undefined | null) => {
  if (!date) return "";
  const d = new Date(date);
  return `${d.getMonth() + 1}/${d.getFullYear().toString().slice(-2)}`;
};

export default function CardsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [cardType, setCardType] = useState<"visa" | "mastercard">("visa");
  const [cardName, setCardName] = useState("");
  const [generating, setGenerating] = useState(false);

  const [generatedCard, setGeneratedCard] = useState<{
    card_number: string;
    card_type: string;
    card_holder: string;
    expiry: string;
    cvv: string;
  } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ message, type });
    toastTimeoutRef.current = setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { router.push("/login"); return; }

        const [profileRes, accountRes, cardsRes] = await Promise.all([
          supabase.from("profiles").select("*").eq("id", user.id).single(),
          supabase.from("accounts").select("*").eq("user_id", user.id).single(),
          supabase.from("cards").select("*").eq("user_id", user.id).order("issued_at", { ascending: false }),
        ]);

        if (profileRes.error) throw profileRes.error;
        if (accountRes.error) throw accountRes.error;

        setProfile(profileRes.data);
        setAccount(accountRes.data);
        setCards(cardsRes.data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, supabase]);

  const handleGenerateCard = async () => {
    if (!cardName.trim()) { showToast("Enter the cardholder name.", "error"); return; }
    setGenerating(true);
    try {
      const cardData = {
        card_type: cardType,
        card_number: generateCardNumber(),
        card_holder: cardName.trim(),
        expiry: generateExpiry(),
        cvv: generateCVV(),
      };
      setGeneratedCard(cardData);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("cards").insert([{
        user_id: user.id, card_type: cardData.card_type,
        card_number: cardData.card_number.replace(/\s/g, ""),
        card_holder: cardData.card_holder,
        expiry_date: `${new Date().getFullYear() + 4}-${(new Date().getMonth() + 1).toString().padStart(2, "0")}-01`,
        cvv: cardData.cvv, status: "pending", is_active: false,
      }]);
      if (error) throw error;

      await supabase.from("notifications").insert([{
        user_id: user.id, title: "Card Request Submitted",
        message: `Your ${cardData.card_type.toUpperCase()} card request has been submitted and is pending approval.`,
      }]);

      showToast("Card generated and request submitted!", "success");
      setCardName("");

      const { data: cardsRes } = await supabase.from("cards").select("*").eq("user_id", user.id).order("issued_at", { ascending: false });
      setCards(cardsRes || []);
    } catch (err: any) {
      showToast("Failed to generate card: " + err.message, "error");
    } finally {
      setGenerating(false);
    }
  };

  const handleRequestCard = async () => {
    if (!generatedCard) { showToast("No generated card to request.", "error"); return; }
    showToast("Card request has been submitted for approval.", "success");
    setGeneratedCard(null);
  };

  const getStatusBadge = (card: Card) => {
    if (card.is_active) {
      return <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Active</span>;
    }
    return <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">{card.status || "Pending"}</span>;
  };

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <i className="fa fa-spinner fa-spin text-3xl text-brand-sun mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading cards...</p>
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (error) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center bg-red-50 dark:bg-red-900/20 rounded-xl p-8 shadow-sm">
            <i className="fa fa-exclamation-triangle text-3xl text-red-500 mb-2" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 rounded-lg bg-brand-sun text-white text-sm font-semibold shadow-sm hover:bg-brand-navy">Retry</button>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      {/* ===== DESKTOP LAYOUT (md+) ===== */}
      <div className="hidden md:block font-sans min-h-screen">
        <div className="max-w-5xl mx-auto py-6 px-4">
          <nav className="flex items-center space-x-2 text-xs mb-4">
            <i className="fa fa-home text-gray-500" />
            <span className="text-gray-500">/</span>
            <span className="text-gray-700 dark:text-gray-300">Cards</span>
          </nav>

          {toast && (
            <div className={`fixed top-4 right-4 z-50 max-sm:left-4 max-sm:text-center px-4 py-2 rounded-lg shadow-lg text-sm ${
              toast.type === "success" ? "bg-green-500 text-white" :
              toast.type === "error" ? "bg-red-500 text-white" :
              "bg-brand-sun text-white"
            }`}>
              {toast.message}
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-brand-navy dark:text-white">Credit / Debit Cards</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Request a new card or view your existing cards.</p>
          </div>

          <div className="bg-white dark:bg-brand-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">
              <i className="fa fa-credit-card mr-1" /> Request New Card
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs mb-1 text-gray-600 dark:text-gray-400">Card Type</label>
                <select value={cardType} onChange={(e) => setCardType(e.target.value as "visa" | "mastercard")}
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                >
                  <option value="visa">Visa</option>
                  <option value="mastercard">MasterCard</option>
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1 text-gray-600 dark:text-gray-400">Cardholder Name</label>
                <input type="text" value={cardName} onChange={(e) => setCardName(e.target.value)}
                  placeholder={profile?.full_name || "John Doe"}
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                />
              </div>
              <div className="flex items-end">
                <button onClick={handleGenerateCard} disabled={generating}
                  className="w-full px-4 py-2.5 rounded-lg bg-brand-sun text-white text-sm font-semibold shadow-sm hover:bg-brand-navy disabled:opacity-50"
                >
                  {generating ? <i className="fa fa-spinner fa-spin" /> : <><i className="fa fa-magic mr-1" /> Generate Card</>}
                </button>
              </div>
            </div>
          </div>

          {generatedCard && (
            <div className="mb-6">
              <div className="flex justify-center items-center py-6">
                <div className="relative" style={{ width: 340, height: 210, perspective: 1000 }}>
                  <div className="transition-transform duration-500 hover:rotate-y-180" style={{ width: "100%", height: "100%", position: "relative", transformStyle: "preserve-3d" }}>
                    <div className="absolute w-full h-full rounded-2xl shadow-xl bg-gradient-to-br from-brand-navy via-brand-navy to-brand-navy/80 text-white flex flex-col justify-between p-6" style={{ backfaceVisibility: "hidden" }}>
                      <div className="flex justify-between items-center">
                        <div className="w-10 h-7 rounded bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-inner" />
                        <span className={generatedCard.card_type === "visa" ? "font-bold italic text-white text-2xl drop-shadow-lg" : "font-bold text-yellow-400 text-2xl drop-shadow-lg"}>
                          {generatedCard.card_type === "visa" ? "VISA" : "MasterCard"}
                        </span>
                      </div>
                      <div className="text-lg font-mono tracking-widest mt-4 mb-2">{generatedCard.card_number}</div>
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="uppercase text-xs opacity-70">Card Holder</div>
                          <div className="font-bold text-base">{generatedCard.card_holder}</div>
                        </div>
                        <div className="text-right">
                          <div className="uppercase text-xs opacity-70">Expires</div>
                          <div className="font-bold text-base">{generatedCard.expiry}</div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute w-full h-full rounded-2xl shadow-xl bg-gradient-to-br from-brand-navy/80 via-brand-navy to-brand-navy text-white flex flex-col justify-between p-6 rotate-y-180" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                      <div className="w-full h-8 bg-black rounded mt-2 mb-4" />
                      <div className="flex flex-col">
                        <div className="flex items-center mb-2">
                          <span className="bg-white text-black px-3 py-1 rounded text-xs font-mono mr-2">CVV</span>
                          <span className="font-mono text-lg">{generatedCard.cvv}</span>
                        </div>
                        <div className="bg-white text-black px-3 py-1 rounded text-xs font-mono w-32 mb-2">{generatedCard.card_holder}</div>
                        <div className="text-[10px] opacity-60">This card is property of Horizon Ridge Credit Union.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-2">
                <button onClick={handleRequestCard} className="px-6 py-2 rounded-lg bg-brand-sun text-white text-sm font-semibold shadow-sm hover:bg-brand-navy">
                  <i className="fa fa-check mr-1" /> Request This Card
                </button>
                <button onClick={() => setGeneratedCard(null)} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 text-xs hover:bg-gray-300">Discard</button>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-brand-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200"><i className="fa fa-list mr-1" /> Your Cards</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 dark:bg-gray-800/60">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-400">Type</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-400">Card Number</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-400">Status</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-400">Expiry</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-400">Issued</th>
                  </tr>
                </thead>
                <tbody>
                  {cards.length > 0 ? (
                    cards.map((c) => (
                      <tr key={c.id} className="hover:bg-brand-navy/5 dark:hover:bg-brand-navy/20">
                        <td className="px-3 py-2 font-semibold uppercase">{c.card_type || "-"}</td>
                        <td className="px-3 py-2 font-mono">{c.card_number ? c.card_number.replace(/(.{4})/g, "$1 ").trim() : "-"}</td>
                        <td className="px-3 py-2">{getStatusBadge(c)}</td>
                        <td className="px-3 py-2">{fmtDate(c.expiry_date)}</td>
                        <td className="px-3 py-2">{c.issued_at?.slice(0, 16).replace("T", " ")}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center text-gray-400 dark:text-gray-500 py-8">
                        <i className="fa fa-credit-card text-2xl mb-2 block" /> No cards requested yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <footer className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500 py-4">
            <p><strong>Copyright &copy; {new Date().getFullYear()}</strong> All rights reserved | Horizon Ridge Credit Union.</p>
          </footer>
        </div>
      </div>

      {/* ===== MOBILE LAYOUT (below md) ===== */}
      <div className="md:hidden px-4 py-4 max-w-3xl mx-auto">
        {toast && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            toast.type === "success" ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800" :
            toast.type === "error" ? "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800" :
            "bg-brand-navy/5 dark:bg-brand-navy/20 text-brand-navy dark:text-brand-light border border-brand-navy/20"
          }`}>
            <div className="flex items-center gap-2">
              {toast.type === "success" && <i className="fa-solid fa-circle-check text-green-500" />}
              {toast.type === "error" && <i className="fa-solid fa-circle-exclamation text-red-500" />}
              {toast.type === "info" && <i className="fa-solid fa-circle-info text-brand-sun" />}
              <p className="font-medium">{toast.message}</p>
            </div>
          </div>
        )}

        <div className="mb-4">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Cards</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Request a new card or view your existing cards</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 mb-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-1.5">
            <i className="fa-solid fa-credit-card text-brand-sun" />
            Request New Card
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Card Type</label>
              <select value={cardType} onChange={(e) => setCardType(e.target.value as "visa" | "mastercard")}
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-3 text-sm text-brand-navy dark:text-brand-light focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
              >
                <option value="visa">Visa</option>
                <option value="mastercard">MasterCard</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Cardholder Name</label>
              <input type="text" value={cardName} onChange={(e) => setCardName(e.target.value)}
                placeholder={profile?.full_name || "Full name"}
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-3 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
              />
            </div>
            <button onClick={handleGenerateCard} disabled={generating}
              className="w-full py-3 rounded-xl bg-brand-sun text-white font-semibold text-sm shadow-sm hover:bg-brand-navy transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {generating ? <><i className="fa-solid fa-spinner fa-spin mr-1" /> Generating...</> : <><i className="fa-solid fa-magic mr-1" /> Generate Card</>}
            </button>
          </div>
        </div>

        {generatedCard && (
          <div className="md:hidden fixed inset-0 z-50 flex items-end justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setGeneratedCard(null)} />
            <div className="relative bg-white dark:bg-gray-900 rounded-t-2xl w-full max-w-md mx-auto shadow-2xl animate-slide-up pb-6">
              <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" /></div>
              <div className="px-6 pt-2 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white">Card Preview</h4>
                  <button onClick={() => setGeneratedCard(null)} className="p-1 text-gray-400 hover:text-gray-600"><i className="fa-solid fa-xmark text-lg" /></button>
                </div>
                <div className="relative rounded-2xl shadow-xl bg-gradient-to-br from-brand-navy via-brand-navy to-brand-navy/80 text-white p-5 mb-4" style={{ minHeight: 190 }}>
                  <div className="flex justify-between items-center mb-6">
                    <div className="w-9 h-6 rounded bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-inner" />
                    <span className={generatedCard.card_type === "visa" ? "font-bold italic text-white text-xl drop-shadow-lg" : "font-bold text-yellow-400 text-xl drop-shadow-lg"}>
                      {generatedCard.card_type === "visa" ? "VISA" : "MasterCard"}
                    </span>
                  </div>
                  <div className="text-base font-mono tracking-widest mb-4">{generatedCard.card_number}</div>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="uppercase text-[10px] opacity-70">Card Holder</div>
                      <div className="font-bold text-sm">{generatedCard.card_holder}</div>
                    </div>
                    <div className="text-right">
                      <div className="uppercase text-[10px] opacity-70">Expires</div>
                      <div className="font-bold text-sm">{generatedCard.expiry}</div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/20 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-mono">CVV</span>
                      <span className="font-mono text-sm">{generatedCard.cvv}</span>
                    </div>
                    <span className="text-[10px] opacity-60">HRCU</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleRequestCard} className="flex-1 py-3 rounded-xl bg-brand-sun text-white font-semibold text-sm shadow-sm hover:bg-brand-navy transition-colors active:scale-[0.98]">
                    <i className="fa-solid fa-check mr-1" /> Request This Card
                  </button>
                  <button onClick={() => setGeneratedCard(null)} className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300">Discard</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-1.5"><i className="fa-solid fa-list text-gray-400" /> Your Cards</h3>
            <span className="text-[10px] text-gray-400 dark:text-gray-500">{cards.length} card{cards.length !== 1 ? "s" : ""}</span>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {cards.length > 0 ? (
              cards.map((c) => (
                <div key={c.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-brand-navy/10 dark:bg-brand-navy/30 flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-credit-card text-brand-navy dark:text-brand-light text-sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-900 dark:text-white uppercase">{c.card_type || "-"}</span>
                      {getStatusBadge(c)}
                    </div>
                    <p className="text-[11px] font-mono text-gray-500 dark:text-gray-400 mt-0.5">{"**** " + c.card_number.slice(-4)}</p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">Expires {fmtDate(c.expiry_date)} &middot; Issued {c.issued_at?.slice(0, 10) || "-"}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-gray-400 dark:text-gray-500">
                <i className="fa-regular fa-credit-card text-lg mb-2 block" /> No cards requested yet
              </div>
            )}
          </div>
        </div>

        <footer className="text-center text-[10px] text-gray-400 dark:text-gray-500 py-4">
          Copyright &copy; {new Date().getFullYear()} All rights reserved | Horizon Ridge Credit Union.
        </footer>
      </div>
    </DashboardShell>
  );
}
