import { supabase } from "../../utils/supabaseClient";
import navbar from "./components/Navbar";
import { showToast } from "../../components/toast";
import { reset } from "../../utils/reset";

// Helper: Generate Card Number, CVV, Expiry
function generateCardNumber() {
  let n = "";
  for (let i = 0; i < 16; i++) n += Math.floor(Math.random() * 10);
  return n.replace(/(.{4})/g, "$1 ").trim();
}
function generateCVV() {
  return ("" + Math.floor(100 + Math.random() * 900));
}
function generateExpiry() {
  const now = new Date();
  const year = now.getFullYear() + 4;
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  return `${month}/${year.toString().slice(-2)}`;
}
function cardSVG({ card_number, card_type, card_holder, expiry, cvv }) {
  // Card type logo
  const logo = card_type === "visa"
    ? `<span class="font-bold italic text-white text-2xl drop-shadow-lg">VISA</span>`
    : `<span class="font-bold text-yellow-400 text-2xl drop-shadow-lg">MasterCard</span>`;
  return `
  <div class="flex justify-center items-center py-6">
    <div class="relative card-container group" style="width:340px;height:210px;perspective:1000px;">
      <div class="card transition-transform duration-500 group-hover:rotate-y-180" style="width:100%;height:100%;position:relative;transform-style:preserve-3d;">
        <div class="card-face card-front absolute w-full h-full rounded-2xl shadow-xl bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 text-white flex flex-col justify-between p-6" style="backface-visibility:hidden;">
          <div class="flex justify-between items-center">
            <div class="w-10 h-7 rounded bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-inner"></div>
            ${logo}
          </div>
          <div class="text-lg font-mono tracking-widest mt-4 mb-2">${card_number}</div>
          <div class="flex justify-between items-end">
            <div>
              <div class="uppercase text-xs opacity-70">Card Holder</div>
              <div class="font-bold text-base">${card_holder}</div>
            </div>
            <div class="text-right">
              <div class="uppercase text-xs opacity-70">Expires</div>
              <div class="font-bold text-base">${expiry}</div>
            </div>
          </div>
        </div>
        <div class="card-face card-back absolute w-full h-full rounded-2xl shadow-xl bg-gradient-to-br from-blue-700 via-blue-900 to-blue-500 text-white flex flex-col justify-between p-6 rotate-y-180" style="backface-visibility:hidden;">
          <div class="w-full h-8 bg-black rounded mt-2 mb-4"></div>
          <div class="flex flex-col">
            <div class="flex items-center mb-2">
              <span class="bg-white text-black px-3 py-1 rounded text-xs font-mono mr-2">CVV</span>
              <span class="font-mono text-lg">${cvv}</span>
            </div>
            <div class="bg-white text-black px-3 py-1 rounded text-xs font-mono w-32 mb-2">${card_holder}</div>
            <div class="text-xs opacity-60">This card is property of Horizon Ridge Credit Union.</div>
          </div>
          <div class="flex justify-center mt-2">${logo}</div>
        </div>
      </div>
    </div>
  </div>
  `;
}

// Helper: Format date
function fmtDate(date) {
  if (!date) return "";
  const d = new Date(date);
  return `${d.getMonth() + 1}/${d.getFullYear().toString().slice(-2)}`;
}

// Main UI
const cards = async () => {
  reset("Horizon | Cards");
  const nav = navbar();

  // Fetch session, profile, account, cards
  const session = await supabase.auth.getSession();
  if (!session.data.session) {
    window.location.href = "/login";
    return;
  }
  const { user } = session.data.session;
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  let { data: account } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_id", user.id)
    .single();
  let { data: cardsList } = await supabase
    .from("cards")
    .select("*")
    .eq("user_id", user.id)
    .order("issued_at", { ascending: false });

  // State for generated card
  let generatedCard = null;

  // Card Table Rows
  const cardRows = (cardsList || []).length
    ? cardsList
        .map(
          (c, i) => `
      <tr class="hover:bg-blue-50 dark:hover:bg-blue-900 cursor-pointer js-card-row" data-idx="${i}">
        <td class="px-2 py-1 text-xs">${c.card_type?.toUpperCase() || "-"}</td>
        <td class="px-2 py-1 text-xs font-mono">${c.card_number}</td>
        <td class="px-2 py-1 text-xs">${c.is_active ? "Active" : "Inactive"}</td>
        <td class="px-2 py-1 text-xs">${fmtDate(c.expiry_date)}</td>
        <td class="px-2 py-1 text-xs">${c.issued_at?.slice(0, 16).replace("T", " ")}</td>
      </tr>
    `
        )
        .join("")
    : `<tr><td colspan="5" class="text-center text-gray-400 dark:text-gray-500 py-2 text-xs">No cards requested yet.</td></tr>`;

  function pageEvents() {
    nav.pageEvents?.();

    // Card type select
    const cardTypeSelect = document.getElementById("card-type");
    const cardNameInput = document.getElementById("card-name");
    const generateBtn = document.getElementById("generate-card-btn");
    const cardPreview = document.getElementById("card-preview");
    const regenerateBtn = document.getElementById("regenerate-card-btn");
    const saveBtn = document.getElementById("save-card-btn");
    const spinner = document.getElementById("card-spinner");
    let cardData = null;

    // Generate card
    generateBtn.onclick = () => {
      const card_type = cardTypeSelect.value;
      const card_holder = cardNameInput.value.trim().toUpperCase();
      if (!card_type || !card_holder) {
        showToast("Select card type and enter your name.", "error");
        return;
      }
      spinner.classList.remove("hidden");
      setTimeout(() => {
        cardData = {
          card_type,
          card_holder,
          card_number: generateCardNumber(),
          expiry: generateExpiry(),
          cvv: generateCVV(),
        };
        cardPreview.innerHTML = cardSVG(cardData);
        spinner.classList.add("hidden");
        regenerateBtn.classList.remove("hidden");
        saveBtn.classList.remove("hidden");
      }, 1200);
    };

    // Regenerate card
    regenerateBtn.onclick = () => {
      generateBtn.onclick();
    };

    // Save card
    saveBtn.onclick = async () => {
      if (!cardData) return;
      spinner.classList.remove("hidden");
      saveBtn.disabled = true;
      try {
        // Insert card into DB (inactive by default)
        const { data: cardRow, error } = await supabase.from("cards").insert([
          {
            user_id: user.id,
            account_id: account.id,
            card_number: cardData.card_number,
            card_type: cardData.card_type,
            expiry_date: `20${cardData.expiry.split("/")[1]}-${cardData.expiry.split("/")[0]}-01`,
            cvv: cardData.cvv,
            is_active: false,
          },
        ]).select().single();
        if (error) throw error;

        // Notification
        await supabase.from("notifications").insert([
          {
            user_id: user.id,
            title: "Card Request Submitted",
            message: `Your ${cardData.card_type.toUpperCase()} card request is pending approval.`,
            type: "info",
            read: false,
          },
        ]);

        // Email
        fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: profile.email,
            subject: "Card Request Submitted",
            html: `
              <h2>Your Card Request is Pending</h2>
              <p>Dear ${profile.full_name},</p>
              <p>Your ${cardData.card_type.toUpperCase()} card request has been received and is pending approval.</p>
              <ul>
                <li>Card Number: ${cardData.card_number}</li>
                <li>Card Holder: ${cardData.card_holder}</li>
                <li>Expiry: ${cardData.expiry}</li>
                <li>Type: ${cardData.card_type.toUpperCase()}</li>
              </ul>
              <p>We will notify you once your card is approved and ready for use.</p>
              <br>
              <b>Horizon Ridge Credit Union</b>
            `,
          }),
        });

        showToast("Card request submitted. Await approval.", "success");
        setTimeout(() => window.location.reload(), 1800);
      } catch (err) {
        showToast("Failed to save card. Try again.", "error");
        spinner.classList.add("hidden");
        saveBtn.disabled = false;
      }
    };

    // Card table row click: show card animation
    document.querySelectorAll(".js-card-row").forEach((row) => {
      row.onclick = () => {
        const idx = row.getAttribute("data-idx");
        const c = cardsList[idx];
        if (!c) return;
        cardPreview.innerHTML = cardSVG({
          card_number: c.card_number,
          card_type: c.card_type,
          card_holder: profile.full_name.toUpperCase(),
          expiry: fmtDate(c.expiry_date),
          cvv: c.cvv,
        });
        regenerateBtn.classList.add("hidden");
        saveBtn.classList.add("hidden");
      };
    });
  }

  return {
    html: /*html*/ `
      <div class="relative">
        ${nav.html}
        <div class="bg-gray-50 dark:bg-gray-900 font-sans min-h-screen pt-12">
          <div id="main-content" class="ml-56 pt-14 transition-all duration-300 font-sans min-h-screen">
            <div class="p-4">
              <div class="mb-4">
                <nav class="flex items-center space-x-2 text-xs">
                  <i class="fa fa-home text-gray-500 text-xs"></i>
                  <span class="text-gray-500">/</span>
                  <span class="text-gray-700 dark:text-gray-300">Cards</span>
                </nav>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4"><i class="fa fa-credit-card mr-2"></i> Request a New Card</h3>
                  <form id="card-request-form" class="space-y-4">
                    <div>
                      <label class="block text-xs font-semibold mb-1">Card Type</label>
                      <select id="card-type" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring" required>
                        <option value="">Select Card Type</option>
                        <option value="visa">Visa Debit</option>
                        <option value="mastercard">MasterCard Credit</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-xs font-semibold mb-1">Card Holder Name</label>
                      <input type="text" id="card-name" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring" placeholder="Your Name" value="${profile.full_name || ""}" required />
                    </div>
                    <div class="flex space-x-2">
                      <button type="button" id="generate-card-btn" class="btn btn-primary bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"><i class="fa fa-magic"></i> Generate Card</button>
                      <button type="button" id="regenerate-card-btn" class="btn btn-default bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition hidden"><i class="fa fa-refresh"></i> Regenerate</button>
                      <button type="button" id="save-card-btn" class="btn btn-success bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition hidden"><i class="fa fa-save"></i> Save Card</button>
                    </div>
                    <div id="card-spinner" class="hidden flex items-center space-x-2 mt-2">
                      <span class="animate-spin rounded-full h-5 w-5 border-t-2 border-blue-600"></span>
                      <span class="text-xs text-gray-600 dark:text-gray-300">Processing...</span>
                    </div>
                  </form>
                  <div id="card-preview" class="mt-8"></div>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4"><i class="fa fa-list mr-2"></i> Your Card Requests</h3>
                  <div class="overflow-x-auto rounded shadow bg-white dark:bg-gray-800">
                    <table class="min-w-full text-xs">
                      <thead>
                        <tr class="bg-blue-100 dark:bg-blue-900/30">
                          <th class="px-2 py-1 text-left">Type</th>
                          <th class="px-2 py-1 text-left">Number</th>
                          <th class="px-2 py-1 text-left">Status</th>
                          <th class="px-2 py-1 text-left">Expiry</th>
                          <th class="px-2 py-1 text-left">Issued</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${cardRows}
                      </tbody>
                    </table>
                  </div>
                  <div class="text-xs text-gray-400 mt-2">Click a row to view card details.</div>
                </div>
              </div>
            </div>
            <footer class="p-4 text-center text-gray-600 dark:text-gray-400 text-xs">
              <p>
                <strong>Copyright © ${new Date().getFullYear()}</strong> All rights reserved | Horizon Ridge Credit Union.
              </p>
            </footer>
          </div>
        </div>
      </div>
    `,
    pageEvents,
  };
};

export default cards;