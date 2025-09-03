# DomaSnipe-LiteTrack3

Track 3: **Bots & Subscriptions**. Polls Doma **Poll API** (with ACK), scores + filters events, writes alerts to `/data`, optional Telegram push, and deep-links to `/buy` and `/offer`.

## Quick start
```bash
cp .env.example .env
npm i
npm run dev      # web (http://localhost:3000)
npm run poll     # poller (separate terminal)
```
Open:
- http://localhost:3000/alerts
- http://localhost:3000/buy?sld=panda&tld=.ape
- http://localhost:3000/offer

---

## Submission Notes

### How we used Doma
- **Poll API (+ACK):** `scripts/poll.mjs` calls `/v1/poll` and the app acks with `/v1/poll/ack/{lastId}` inside `/api/poll/run`.
- **Orderbook:** `/buy` calls `/v1/orderbook/listing/{orderId}/{buyer}` for fulfillment; `/offer` prepares params and submits offers via `/v1/orderbook/offer` (or SDK).
- **Subgraph:** `/api/offer/prepare` queries tokens by name for `tokenId` and `tokenAddress`.
- **Fee endpoint:** `/api/offer/prepare` fetches marketplace fees per orderbook.
- **SDK:** Client uses `@doma-protocol/orderbook-sdk` for signing and submission (optional manual path included).

### Track 3 fit (Bots & Subscriptions)
- Continuous **poller** filters and **scores** events → pushes to **Telegram** + in-app **/alerts**.
- Alerts link straight into **/buy** (fast fulfill) or **/offer** (price discovery), driving on-chain activity.

### What to record in the demo
1. Start web (`npm run dev`) and poller (`npm run poll`).  
2. Open **/alerts**; show live entries (use `npm run demo` if quiet).  
3. Click an alert ➜ **/buy** prefilled; send tx from wallet.  
4. Show **/offer** ➜ `Prepare Draft` ➜ `Sign & Submit via SDK` (wallet pops).  
5. (Optional) Show Telegram alert on mobile/desktop.

### Metrics to call out (for judges)
- Alerts processed / min (from `/data/poll_state.json`).  
- Click-through from alert ➜ `/buy`.  
- Offer creation and completion count.  
- (Optional) Telegram delivery count.

### Security & keys
- Keep `.env` local; never commit real keys.  
- Server routes proxy upstream with `Api-Key` to avoid exposing secrets to the browser.

### Future work (roadmap)
- Multi-chain watchlists; richer rarity models; per-user webhooks; allowlist sell/buy rules; backtest module.

### Submission checklist
- [x] Public GitHub repo (push this code).  
- [x] Readme + **Submission Notes** (this section).  
- [x] “How we used Doma” specifics (above).  
- [x] Recorded demo video (use `docs/DEMO_SCRIPT.md`).  
