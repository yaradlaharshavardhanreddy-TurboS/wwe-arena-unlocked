# WWE Arena Unlocked Studio

Fan-made trivia game. Answer WWE trivia to unlock arenas, earn tokens, and spend them on superstars.

- **client/**: React (Vite) website
- **server/**: Node + Express API, MongoDB database, emailed verification codes

## What you need
- Node.js 18+
- MongoDB: local install, or a free MongoDB Atlas cluster (copy its connection string)
- An email account that can send SMTP mail (see "Email" below), or skip it in development

## Run it
1. Server
   ```
   cd server
   cp .env.example .env     # Windows: copy .env.example .env
   ```
   Edit `.env`: set `MONGODB_URI`, and `JWT_SECRET` to a long random string.
   ```
   npm install
   npm run dev
   ```
2. Client (second terminal)
   ```
   cd client
   npm install
   npm run dev
   ```
3. Open the address Vite prints (usually http://localhost:5173).

## Email
Sign-up sends a 6-digit code (valid 10 minutes, 5 tries). Fill the `SMTP_*` and `MAIL_FROM` values in `server/.env`.
- **Gmail:** turn on 2-step verification, create an App Password, use it as `SMTP_PASS` (host `smtp.gmail.com`, port 587).
- **Other options:** Brevo, Resend or Mailgun all give you SMTP credentials with a free tier.
- **No SMTP set?** In development the code is printed in the server terminal instead of emailed.

## How the game works
- Start with 50 tokens. Entering an arena costs tokens, paid up front and never refunded.
- Each challenge is 3 questions, 15 seconds each, one try per question. Get 2 of 3 right to unlock and earn the reward.
- The server holds the answers, grades every pick, enforces the timer and does all token maths, so the browser cannot cheat.
- Reloading mid-challenge counts as a forfeit.
- Spend tokens on superstars (Rising 30-45, Main Event 50-70, Icon 80-100). Claim a daily +20 bonus.
- Pages: The vault, My collection, Leaderboard (top 10 by arenas plus superstars unlocked).

## Edit content
- Arenas, questions, superstars, costs: `server/data.js`
- Superstar portraits: put image files in `client/public/players/` (names match the `image` paths in `server/data.js`). Missing images fall back to a monogram. Use images you have rights to.

## Going live
- Never commit `server/.env`.
- Build the site with `cd client && npm run build`; the server then serves `client/dist` itself, so one host (Render, Railway, a VPS) runs everything.
- Use HTTPS, a strong `JWT_SECRET`, and an Atlas database.
