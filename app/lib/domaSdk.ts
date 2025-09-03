'use client';
import { createDomaOrderbookClient } from "@doma-protocol/orderbook-sdk";
const base = process.env.NEXT_PUBLIC_DOMA_SDK_BASE || "/api/proxy";
export const client = createDomaOrderbookClient({ apiClientOptions: { baseUrl: base } });
