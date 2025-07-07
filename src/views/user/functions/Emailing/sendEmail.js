/**
 * Sends a custom email using Resend.
 * @param {Object} param0
 * @param {string|string[]} param0.to - Recipient email address(es)
 * @param {string} param0.subject - Email subject
 * @param {string} param0.html - HTML content of the email
 */
export async function sendEmail({ to, subject, html }) {
  const res = await fetch('http://localhost:3001/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, subject, html }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to send email');
  return data.result;
}