'use client';
import { useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { viemToEthersSigner } from "@doma-protocol/orderbook-sdk";
import { client as sdkClient } from "../lib/domaSdk";
export default function OfferPage(){
  const { address } = useAccount(); const { data: walletClient } = useWalletClient();
  const [sld,setSld]=useState("panda"); const [tld,setTld]=useState(".ape"); const [price,setPrice]=useState("0.05");
  const [currency,setCurrency]=useState<"WETH"|"USDC">("WETH"); const [orderbook,setOrderbook]=useState<"DOMA"|"OPENSEA">("DOMA"); const [hours,setHours]=useState(24);
  const [draft,setDraft]=useState<any>(null); const [err,setErr]=useState<string|null>(null);
  async function handlePrepare(){ setErr(null); setDraft(null); const params=new URLSearchParams({ sld,tld,price,currency,orderbook,hours:String(hours), ...(address?{buyer:address}:{}) });
    const r=await fetch(`/api/offer/prepare?${params.toString()}`); const j=await r.json(); if(!r.ok){ setErr(j?.error||"prepare failed"); return; } setDraft(j); }
  return (<main className="mx-auto max-w-3xl p-6 space-y-4">
    <h1 className="text-2xl font-bold">Instant Offer (Helper)</h1>
    <div className="rounded-xl border p-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm">SLD <input value={sld} onChange={e=>setSld(e.target.value)} className="block w-full rounded-md border p-2" /></label>
        <label className="text-sm">TLD <input value={tld} onChange={e=>setTld(e.target.value)} className="block w-full rounded-md border p-2" /></label>
        <label className="text-sm">Price <input value={price} onChange={e=>setPrice(e.target.value)} className="block w-full rounded-md border p-2" /></label>
        <label className="text-sm">Currency <select value={currency} onChange={e=>setCurrency(e.target.value as any)} className="block w-full rounded-md border p-2"><option value="WETH">WETH</option><option value="USDC">USDC</option></select></label>
        <label className="text-sm">Orderbook <select value={orderbook} onChange={e=>setOrderbook(e.target.value as any)} className="block w-full rounded-md border p-2"><option value="DOMA">DOMA</option><option value="OPENSEA">OPENSEA</option></select></label>
        <label className="text-sm">Expires in (hours) <input type="number" min="1" max="720" value="24" className="block w-full rounded-md border p-2" /></label>
      </div>
      <button onClick={handlePrepare} className="px-4 py-2 rounded-lg border">Prepare Draft</button>
      {err && <p className="text-sm text-red-600">{err}</p>}
    </div>
    {draft && (<div className="rounded-xl border p-4 space-y-3">
      <h2 className="font-semibold">One-click: Sign & Submit via SDK</h2>
      <button className="px-4 py-2 rounded-lg border" disabled={!walletClient || !draft?.paramsDraft}
        onClick={async ()=>{ try{ if(!walletClient || !draft?.paramsDraft) return; const signer = viemToEthersSigner(walletClient, "eip155:97476"); const p = (draft as any).paramsDraft;
          await sdkClient.createOffer({ params: { items: p.items, orderbook: (p.orderbook || "DOMA") as any, expirationTime: p.expirationTime }, signer, chainId: "eip155:97476", onProgress: (s, prog) => console.log("[offer]", s, prog) });
          alert("Offer signed & submitted!"); }catch(e:any){ alert(e?.message || "SDK createOffer failed"); } }}>Sign & Submit via SDK</button>
      <div className="text-xs opacity-70">Or use manual submission via /api/offer/submit.</div>
    </div>)}
  </main>); }
