# DomaSnipe — Track 3: Bots & Event Subscriptions

## Abstract
A lightweight alerting bot + UI that listens to Doma events, scores them for rarity/urgency, pushes to Telegram, and deep-links to instant buy/offer flows to maximize on-chain conversions.

## Track & Goals
- **Track:** 3 — Bots & Event Subscriptions
- **Goal:** Drive transactions via timely, filtered alerts and one-tap actions.

## Doma Integration
- **Poll API:** `/v1/poll` consumed by `scripts/poll.mjs`. App-side processing in `app/api/poll/run` and **ACK** via `/v1/poll/ack/{lastId}`.
- **Orderbook:** Fulfillment (`/buy`) via `/v1/orderbook/listing/{orderId}/{buyer}`. Offers (`/offer`) via `/v1/orderbook/offer` or SDK helper.
- **Subgraph:** Token lookup by name in `/api/offer/prepare` to resolve `tokenId` & `tokenAddress`.
- **Fees:** `/v1/orderbook/fee/{orderbook}/{chainId}/{contract}` for marketplace fees.
- **SDK:** `@doma-protocol/orderbook-sdk` to sign & submit orders (optional manual POST included).
- **Chain ID:** `eip155:97476` (Doma Testnet).

## Architecture
- **Next.js app** with server routes (no external DB).  
- **Poller** (`npm run poll`) → fetch events → score & filter → JSONL storage at `/data/alerts.jsonl` → optional Telegram push.
- **UI:** `/alerts` live feed; `/buy` and `/offer` helpers with authenticated server-side proxies.
- **Config:** `data/filters.json` editable via `/api/filters/*` routes.

## User Journeys
1. **Trader** receives Telegram ping → clicks → `/buy` → wallet fulfill.  
2. **Researcher** watches `/alerts`, tweaks filters, then makes an **offer** path.

## Metrics (judge-facing)
- Processed events, ACK id, alert hits, click-through, offer submissions.

## Setup
See repo `README.md`. Requires Node 20 (or Docker), `.env` with `DOMA_API_KEY` (EVENTS,SUBGRAPH,ORDERBOOK).

## Links
- **Demo Video:** <LINK>
