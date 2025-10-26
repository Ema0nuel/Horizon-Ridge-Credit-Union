// /**
//  * Sends a custom email using Resend.
//  * @param {Object} param0
//  * @param {string|string[]} param0.to - Recipient email address(es)
//  * @param {string} param0.subject - Email subject
//  * @param {string} param0.html - HTML content of the email
//  */
// export async function sendEmail({ to, subject, html }) {
//   const res = await fetch('http://localhost:3001/api/send-email', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ to, subject, html }),
//   });
//   const data = await res.json();
//   if (!data.success) throw new Error(data.error || 'Failed to send email');
//   return data.result;
// }

export async function sendEmail({ to, subject, html }) {
  try {
    console.log('Attempting to send email:', { to, subject });

    // Validate input
    if (!to || !subject || !html) {
      throw new Error('Missing required email parameters');
    }

    // Add timeout to fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ to, subject, html }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    console.log('Response status:', res.status);
    const data = await res.json();
    console.log('Response data:', data);

    if (!data.success) {
      throw new Error(data.error || 'Failed to send email');
    }

    return data.result;
  } catch (err) {
    console.error('Email send error:', err);
    // Add more specific error handling
    if (err.name === 'AbortError') {
      throw new Error('Request timed out - server might be down');
    }
    if (err.message.includes('Failed to fetch')) {
      throw new Error('Could not connect to email server - is it running?');
    }
    throw err;
  }
}