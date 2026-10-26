import nodemailer from 'nodemailer'

let transporter

function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null
  if (!transporter) {
    const port = Number(SMTP_PORT) || 587
    transporter = nodemailer.createTransport({ host: SMTP_HOST, port, secure: port === 465, auth: { user: SMTP_USER, pass: SMTP_PASS } })
  }
  return transporter
}

export async function sendCode(to, code) {
  const t = getTransporter()
  if (!t) {
    // Development fallback: no SMTP configured, so print the code here.
    console.log(`[dev mail] verification code for ${to}: ${code}`)
    return
  }
  await t.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to,
    subject: 'Your WWE Arena Unlocked verification code',
    text: `Your verification code is ${code}. It expires in 10 minutes. If you did not sign up, ignore this email.`,
    html: `<p>Your verification code is</p><p style="font-size:28px;font-weight:700;letter-spacing:4px">${code}</p><p>It expires in 10 minutes. If you did not sign up, ignore this email.</p>`,
  })
}
