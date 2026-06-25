import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

const CODES_POOL = [
  "E9876567", "G0876578", "8767898H", "K2387651", "456L7890", "1M234567",
  "987654N3", "O2345678", "98765P43", "Q1987654", "R7654321", "567S1234",
  "T3456789", "U8765432", "V2345678", "W9876543", "X3456789", "Y8765432",
  "Z2345678", "A9876543", "B3456789", "C8765432", "D2345678", "E9876543",
  "F3456789", "G8765432", "H2345678", "I9876543", "J3456789", "K8765432",
];

function randomCode() {
  return CODES_POOL[Math.floor(Math.random() * CODES_POOL.length)];
}

function randomAmount(min = 50, max = 50000) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

function randomDate(from: Date, to: Date) {
  return new Date(from.getTime() + Math.random() * (to.getTime() - from.getTime()));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json({ error: "Action required" }, { status: 400 });
    }

    const supabase = getAdminClient();

    switch (action) {
      // Approve transaction - updates balance
      case "approve": {
        const { transactionId } = body;
        if (!transactionId) return NextResponse.json({ error: "transactionId required" }, { status: 400 });

        // Get transaction
        const { data: tx, error: txErr } = await supabase.from("transactions").select("*").eq("id", transactionId).single();
        if (txErr || !tx) return NextResponse.json({ error: "Transaction not found" }, { status: 404 });

        // Update account balance
        const { data: acc } = await supabase.from("accounts").select("*").eq("id", tx.account_id).single();
        if (acc) {
          let newBal = parseFloat(acc.balance);
          if (tx.type === "deposit" || tx.type === "transfer" || tx.type === "manual") newBal += parseFloat(tx.amount);
          if (tx.type === "withdrawal") newBal -= parseFloat(tx.amount);
          await supabase.from("accounts").update({ balance: newBal }).eq("id", tx.account_id);
          await supabase.from("transactions").update({ status: "completed", balance_after: newBal }).eq("id", transactionId);
        } else {
          await supabase.from("transactions").update({ status: "completed" }).eq("id", transactionId);
        }

        return NextResponse.json({ success: true });
      }

      // Reverse transaction - create reversal
      case "reverse": {
        const { transactionId } = body;
        if (!transactionId) return NextResponse.json({ error: "transactionId required" }, { status: 400 });

        const { data: tx, error: txErr } = await supabase.from("transactions").select("*").eq("id", transactionId).single();
        if (txErr || !tx) return NextResponse.json({ error: "Transaction not found" }, { status: 404 });

        // Update current transaction status
        await supabase.from("transactions").update({ status: "reversed" }).eq("id", transactionId);

        // Create reversal transaction
        await supabase.from("transactions").insert([{
          user_id: tx.user_id,
          account_id: tx.account_id,
          type: "reversal",
          amount: tx.amount,
          description: `Reversal of ${tx.id}`,
          status: "completed",
          created_at: new Date().toISOString(),
        }]);

        // Reverse balance
        const { data: acc } = await supabase.from("accounts").select("*").eq("id", tx.account_id).single();
        if (acc) {
          let newBal = parseFloat(acc.balance);
          if (tx.type === "deposit" || tx.type === "manual" || tx.type === "transfer") newBal -= parseFloat(tx.amount);
          if (tx.type === "withdrawal") newBal += parseFloat(tx.amount);
          await supabase.from("accounts").update({ balance: newBal }).eq("id", tx.account_id);
        }

        return NextResponse.json({ success: true });
      }

      // Update transaction fields directly
      case "update": {
        const { transactionId, fields } = body;
        if (!transactionId || !fields) return NextResponse.json({ error: "transactionId and fields required" }, { status: 400 });

        const updateData: Record<string, any> = {};
        if (fields.type !== undefined) updateData.type = fields.type;
        if (fields.amount !== undefined) updateData.amount = fields.amount;
        if (fields.status !== undefined) updateData.status = fields.status;
        if (fields.description !== undefined) updateData.description = fields.description;
        if (fields.balance_before !== undefined) updateData.balance_before = fields.balance_before;
        if (fields.balance_after !== undefined) updateData.balance_after = fields.balance_after;
        if (fields.created_at !== undefined) updateData.created_at = fields.created_at;
        if (fields.user_id !== undefined) updateData.user_id = fields.user_id;
        if (fields.account_id !== undefined) updateData.account_id = fields.account_id;

        const { error } = await supabase.from("transactions").update(updateData).eq("id", transactionId);
        if (error) throw error;
        return NextResponse.json({ success: true });
      }

      // Delete transaction
      case "delete": {
        const { transactionId } = body;
        if (!transactionId) return NextResponse.json({ error: "transactionId required" }, { status: 400 });
        await supabase.from("transactions").delete().eq("id", transactionId);
        return NextResponse.json({ success: true });
      }

      // Generate random OTP codes
      case "generate-otp": {
        const { userId } = body;
        const codes = {
          cot: randomCode(),
          imf: randomCode(),
          vat: randomCode(),
          timestamp: new Date().toISOString(),
        };

        // Store codes if userId provided
        if (userId) {
          await supabase.from("login_otps").insert([{
            user_id: userId,
            otp: `${codes.cot}-${codes.imf}-${codes.vat}`,
            created_at: new Date().toISOString(),
          }]);
        }

        return NextResponse.json({ success: true, codes });
      }

      // Generate batch of random transactions between dates
      case "generate-batch": {
        const { fromDate, toDate, count = 10, minAmount = 50, maxAmount = 50000 } = body;
        if (!fromDate || !toDate) return NextResponse.json({ error: "fromDate and toDate required" }, { status: 400 });

        // Get active users with accounts
        const { data: profiles } = await supabase.from("profiles").select("id,full_name");
        const { data: accounts } = await supabase.from("accounts").select("*");

        if (!profiles || !accounts || profiles.length === 0 || accounts.length === 0) {
          return NextResponse.json({ error: "No users or accounts found" }, { status: 400 });
        }

        const from = new Date(fromDate);
        const to = new Date(toDate);
        const txTypes = ["deposit", "withdrawal", "transfer"];
        const txCount = Math.min(count, 200);

        // Realistic descriptions per type
        const DESCRIPTIONS: Record<string, string[]> = {
          deposit: ["Direct deposit", "Wire transfer credit", "Check deposit", "ACH credit", "Mobile check deposit", "Payroll deposit", "Online transfer credit", "ATM deposit"],
          withdrawal: ["ATM withdrawal", "POS purchase", "Online payment", "Bill payment", "Wire transfer debit", "ACH debit", "Debit card purchase", "Check withdrawal"],
          transfer: ["Internal transfer", "Account transfer", "Savings transfer", "Funds transfer between accounts", "Transfer to linked account"],
        };

        const transactions = [];

        for (let i = 0; i < txCount; i++) {
          const acc = accounts[Math.floor(Math.random() * accounts.length)];
          const user = profiles.find(p => p.id === acc.user_id);
          if (!user) continue; // skip accounts without matching profile

          const type = txTypes[Math.floor(Math.random() * txTypes.length)];
          const amount = randomAmount(minAmount, maxAmount);
          const descriptions = DESCRIPTIONS[type] || ["Transaction"];
          const description = descriptions[Math.floor(Math.random() * descriptions.length)];

          const statuses = ["completed", "pending", "failed"];
          const statusWeights = [0.7, 0.2, 0.1];
          let r = Math.random(), status = statuses[0];
          for (let s = 0; s < statuses.length; s++) {
            if (r < statusWeights[s]) { status = statuses[s]; break; }
            r -= statusWeights[s];
          }

          const createdAt = randomDate(from, to).toISOString();
          const balanceBefore = parseFloat(acc.balance.toString());
          let balanceAfter = balanceBefore;
          if (type === "deposit") balanceAfter += amount;
          if (type === "withdrawal") balanceAfter -= amount;

          transactions.push({
            user_id: user.id,
            account_id: acc.id,
            type,
            amount,
            description,
            status: status === "completed" ? "completed" : status,
            balance_before: status === "completed" ? balanceBefore : null,
            balance_after: status === "completed" ? balanceAfter : null,
            created_at: createdAt,
          });

          if (status === "completed") {
            await supabase.from("accounts").update({ balance: balanceAfter }).eq("id", acc.id);
          }
        }

        if (transactions.length === 0) {
          return NextResponse.json({ error: "No valid user-account pairs found" }, { status: 400 });
        }

        const { data: inserted, error: insErr } = await supabase.from("transactions").insert(transactions).select();
        if (insErr) throw insErr;

        return NextResponse.json({ success: true, count: transactions.length, transactions: inserted });
      }

      // Send OTP codes email
      case "send-otp-email": {
        const { to, cot, imf, vat } = body;
        if (!to || !cot || !imf || !vat) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

        // The email API exists separately; just return the data ready to send
        return NextResponse.json({
          success: true,
          emailPayload: {
            to,
            subject: "Transaction Codes - Horizon Ridge Credit Union",
            html: `...`, // handled client side
          },
        });
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (err: any) {
    console.error("Admin transactions API error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
