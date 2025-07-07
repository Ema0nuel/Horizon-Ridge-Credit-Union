// sendEmail.js
import dotenv from 'dotenv';
dotenv.config(); // ✅ ensure .env is loaded before using process.env

import express from 'express';
import { Resend } from 'resend';

const router = express.Router();
const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  throw new Error("Missing RESEND_API_KEY in environment.");
}

const resend = new Resend(apiKey);

router.post('/send-email', async (req, res) => {
  const { to, subject, html } = req.body;
  if (!to || !subject || !html) {
    return res.status(400).json({ success: false, error: "Missing required fields" });
  }

  try {
    const result = await resend.emails.send({
      from: 'Horizon Ridge <support@horizonridgecreditunion.com>',
      to,
      subject,
      html,
    });
    res.status(200).json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router; //Routing
