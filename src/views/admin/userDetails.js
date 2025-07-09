import { supabase } from "/src/utils/supabaseClient.js";

import AdminNavbar from "./components/AdminNavbar";
import { requireAdmin } from "./utils/adminAuth";
import { showToast } from "/src/components/toast";

const userDetails = async (userId) => {
  if (!(await requireAdmin())) return;
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).single();
  const { data: account } = await supabase.from("accounts").select("*").eq("user_id", userId).single();
  const { data: kyc } = await supabase.from("kyc_requests").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(1).single();
  const { data: transactions } = await supabase.from("transactions").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(10);

  return {
    html: `
      ${AdminNavbar("users")}
      <div class="pt-20 px-8">
        <h1 class="text-xl font-bold mb-4">User Details</h1>
        <div class="bg-white rounded shadow p-4 mb-4">
          <div class="flex items-center gap-4">
            <img src="${profile.avatar_url || '/default-user.png'}" class="w-16 h-16 rounded-full border" />
            <div>
              <div class="font-bold">${profile.full_name}</div>
              <div class="text-xs text-gray-500">${profile.email}</div>
              <div class="text-xs">${profile.phone || '-'}</div>
            </div>
          </div>
          <div class="mt-4">
            <div><b>Account Number:</b> ${account?.account_number || '-'}</div>
            <div><b>Balance:</b> $${account?.balance ?? '0.00'}</div>
            <div><b>Status:</b> ${account?.is_active ? "Active" : "Inactive"}</div>
          </div>
        </div>
        <div class="bg-white rounded shadow p-4 mb-4">
          <h2 class="font-semibold mb-2">KYC Status</h2>
          <div>${kyc?.status || "Not submitted"}</div>
          <div class="text-xs text-gray-500">${kyc?.created_at || ""}</div>
        </div>
        <div class="bg-white rounded shadow p-4">
          <h2 class="font-semibold mb-2">Recent Transactions</h2>
          <table class="min-w-full text-xs">
            <thead>
              <tr>
                <th>Date</th><th>Type</th><th>Amount</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${(transactions || []).map(t => `
                <tr>
                  <td>${t.created_at?.slice(0, 16).replace('T', ' ')}</td>
                  <td>${t.type}</td>
                  <td>$${t.amount}</td>
                  <td>${t.status}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
        <div class="bg-white rounded shadow p-4 mt-4">
          <h2 class="font-semibold mb-2">Send Notification / Fund Account</h2>
          <form id="admin-action-form" class="space-y-2">
            <input type="hidden" name="user_id" value="${userId}" />
            <label>Message</label>
            <input type="text" name="message" class="border rounded px-2 py-1 w-full" required />
            <label>Fund Amount ($)</label>
            <input type="number" name="fund" class="border rounded px-2 py-1 w-full" min="0" step="0.01" />
            <button type="submit" class="bg-blue-700 text-white px-4 py-2 rounded">Send / Fund</button>
          </form>
        </div>
      </div>
    `,
    pageEvents: () => {
      document.getElementById("admin-action-form").onsubmit = async function (e) {
        e.preventDefault();
        const msg = this.message.value.trim();
        const fund = parseFloat(this.fund.value);
        // Send notification
        await supabase.from("notifications").insert([
          { user_id: userId, title: "Admin Message", message: msg, type: "info" }
        ]);
        // Fund account if amount > 0
        if (fund > 0) {
          const { data: acc } = await supabase.from("accounts").select("*").eq("user_id", userId).single();
          if (acc) {
            const newBal = parseFloat(acc.balance) + fund;
            await supabase.from("accounts").update({ balance: newBal }).eq("id", acc.id);
            await supabase.from("transactions").insert([{
              account_id: acc.id,
              user_id: userId,
              type: "deposit",
              description: "Admin funding",
              amount: fund,
              balance_before: acc.balance,
              balance_after: newBal,
              status: "completed"
            }]);
          }
        }
        showToast("Action completed.", "success");
        window.location.reload();
      };
    }
  };
};
export default userDetails;