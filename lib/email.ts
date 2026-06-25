export async function sendWelcomeEmail({
  name,
  email,
  accountNumber,
  ip,
}: {
  name: string;
  email: string;
  accountNumber: string;
  ip: string;
}) {
  const html = `
    <div style="font-family: 'Segoe UI', sans-serif; padding: 24px; background-color: #f4f4f4; color: #333;">
      <div style="max-width: 600px; margin: auto; background: white; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); overflow: hidden;">
        <div style="padding: 24px; text-align: center; background-color: #003865;">
          <h1 style="color: white; margin: 0;">Welcome to Horizon Ridge</h1>
        </div>
        <div style="padding: 24px;">
          <p>Hi <strong>${name}</strong>,</p>
          <p>Thank you for choosing <strong>Horizon Ridge Credit Union</strong>. Your account has been successfully created.</p>
          <h3 style="margin-top: 24px;">Account Details:</h3>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Account Number:</strong> ${accountNumber}</li>
            <li><strong>Registered IP:</strong> ${ip}</li>
            <li><strong>Created On:</strong> ${new Date().toLocaleString("en-US", { timeZone: "Africa/Lagos" })}</li>
          </ul>
          <p style="margin-top: 24px;">
            You can access your dashboard anytime at:<br>
            <a href="https://horizonridge.cc" style="color: #003865;">https://horizonridge.cc</a>
          </p>
          <p style="font-size: 0.9rem; color: #777; margin-top: 32px;">
            If this wasn't you, please contact our support immediately.<br>
            Horizon Ridge Credit Union, proudly serving you with security and trust.
          </p>
        </div>
        <div style="padding: 16px; background: #003865; color: white; text-align: center;">
          &copy; ${new Date().getFullYear()} Horizon Ridge Credit Union
        </div>
      </div>
    </div>
  `;

  const res = await fetch("/api/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: email,
      subject: "Welcome to Horizon Ridge Credit Union",
      html,
    }),
  });

  const data = await res.json();
  if (!data.success) {
    console.warn("Welcome email send failed (non-blocking):", data.error);
  }
}
