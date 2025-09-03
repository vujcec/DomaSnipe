# Doma Integration Details

- **Authentication:** All upstream API calls are server-side via `Api-Key` in headers.
- **Poll Loop:** `scripts/poll.mjs` triggers `/api/poll/run` which fetches from `/v1/poll`, processes, **acks** `lastId`, and persists `/data/*.jsonl`.
- **Orderbook Fulfillment:** `/api/buy` resolves order → returns tx fields → wallet sends.
- **Offer Drafting:** `/api/offer/prepare` resolves token + fees → returns draft → client signs via SDK → `/api/offer/submit` POST.
- **Scoring:** `app/lib/scoring.ts` prioritizes by rarity + time-to-expiry.
- **Filters:** `data/filters.json` (editable via `/api/filters/*` endpoints).
