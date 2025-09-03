# Demo Recording Script (2–3 mins)

**Scene 1 — Intro (10s)**
- “This is DomaSnipe for Track 3: a bot + UI that turns Doma events into instant buy/offer actions.”

**Scene 2 — Start services (20s)**
```bash
npm run dev        # web on http://localhost:3000
npm run poll       # poller in another terminal
```
- “The poller reads Doma’s Poll API and we ACK processed events.”

**Scene 3 — Alerts feed (30s)**
- Open http://localhost:3000/alerts  
- Show entries arriving; if quiet: `npm run demo` to seed sample alerts.
- Call out “score”, “type”, “deep link”.

**Scene 4 — One-tap buy (40s)**
- Click an alert → `/buy` prefilled → connect wallet → send tx.
- “Fulfillment payload comes from `/v1/orderbook/listing/{orderId}/{buyer}`.”

**Scene 5 — Offers (30s)**
- Go to `/offer` → Prepare Draft → Sign & Submit via SDK.
- “We look up token via Subgraph and fetch marketplace fees before drafting.”

**Scene 6 — Telegram (optional, 20s)**
- Show a new alert arriving in Telegram (if `TELEGRAM_BOT_TOKEN` & `TELEGRAM_CHAT_ID` set).

**Scene 7 — Close (10s)**
- “That’s DomaSnipe: alerts → action → on-chain volume.”
