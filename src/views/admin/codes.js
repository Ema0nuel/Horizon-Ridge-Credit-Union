import { supabase } from "/src/utils/supabaseClient.js";

import AdminNavbar from "./components/AdminNavbar";
import { requireAdmin } from "./utils/adminAuth";
import { showToast } from "/src/components/toast";

const codes = async () => {
  if (!(await requireAdmin())) return;
  return {
    html: `
      ${AdminNavbar("codes")}
      <div class="pt-20 px-8">
        <h1 class="text-xl font-bold mb-4">Generate Codes (IMF, VAT, COT)</h1>
        <form id="code-form" class="bg-white rounded shadow p-4 max-w-md">
          <label>User Email</label>
          <input type="email" name="email" class="border rounded px-2 py-1 mb-4 w-full" required />
          <label>Code Type</label>
          <select name="type" class="border rounded px-2 py-1 mb-4 w-full">
            <option value="IMF">IMF</option>
            <option value="VAT">VAT</option>
            <option value="COT">COT</option>
          </select>
          <button type="submit" class="bg-blue-700 text-white px-4 py-2 rounded">Generate & Send</button>
        </form>
      </div>
    `,
    pageEvents: () => {
      document.getElementById("code-form").onsubmit = async function (e) {
        e.preventDefault();
        const email = this.email.value.trim();
        const type = this.type.value;
        const code = Math.floor(100000 + Math.random() * 900000);
        // Insert code into otps table
        const { data: user } = await supabase.from("profiles").select("id").eq("email", email).single();
        if (user) {
          await supabase.from("otps").insert([{
            user_id: user.id,
            code: code.toString(),
            type,
            expires_at: new Date(Date.now() + 10 * 60000).toISOString()
          }]);
        }
        // Send code to user email (implement your email logic here)
        await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: email,
            subject: `${type} Code`,
            html: `<h2>Your ${type} Code</h2><p>${code}</p>`
          })
        });
        showToast(`${type} code sent to ${email}`, "success");
      };
    }
  };
};
export default codes;