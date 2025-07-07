// sendEmail.js
import express from 'express';
import { Resend } from 'resend';

const router = express.Router();
const resend = new Resend("re_AdmF8KcG_45C3fe3KVLg5GmUWQHXDo2Kp");

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

export default router;
