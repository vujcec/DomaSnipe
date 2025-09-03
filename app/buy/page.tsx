'use client';
import { useEffect, useMemo, useState } from "react";
import { useAccount, useSendTransaction } from "wagmi";
function toHexValue(v:any){ if(v==null) return undefined; try{ const n=BigInt(v); if(n===0n) return undefined; return `0x${n.toString(16)}`; }catch{ return undefined; } }
export default function BuyPage(){
  const { isConnected } = useAccount();
  const [data,setData]=useState<any>(null); const [err,setErr]=useState<string|null>(null); const [loading,setLoading]=useState(true);
  const { sendTransactionAsync, isPending: sending } = useSendTransaction();
  useEffect(()=>{ const p=new URLSearchParams(window.location.search); const sld=p.get("sld")||""; const tld=p.get("tld")||""; const orderId=p.get("orderId")||""; const buyer=p.get("buyer")||"";
    const qs=new URLSearchParams({ ...(sld?{sld}:{}) , ...(tld?{tld}:{}) , ...(orderId?{orderId}:{}) , ...(buyer?{buyer}:{}) });
    fetch(`/api/buy?${qs.toString()}`).then(async r=>{ const b=await r.json(); if(!r.ok) throw new Error(b.error||r.statusText); return b; }).then(j=>setData(j)).catch(e=>setErr(e.message||"failed")).finally(()=>setLoading(false)); },[]);
  const tx = useMemo(()=>{ const f:any=data?.fulfillment; if(!f) return null; const inner=(f.tx||f); if(!inner?.to||!inner?.data) return null; return { to: inner.to as `0x${string}`, data: inner.data as `0x${string}`, value: toHexValue(inner.value) }; },[data]);
  const canSend = isConnected && tx?.to && tx?.data;
  async function handleFulfill(){ if(!canSend) return; try{ await sendTransactionAsync({ to: tx!.to, data: tx!.data, value: tx!.value as any }); alert("Transaction sent!"); }catch(e:any){ alert(e?.message||"Failed to send"); } }
  return (<main className="mx-auto max-w-3xl p-6 space-y-4">
    <h1 className="text-2xl font-bold">Buy via Orderbook</h1>
    {loading && <p>Loading…</p>}{err && <p className="text-red-600">{err}</p>}{data && (<div className="space-y-3">
      <div className="rounded-xl border p-4"><h2 className="font-semibold">Listing</h2>{data.listing ? (<div className="text-sm opacity-90"><div>ID: {data.listing.externalId || data.listing.id}</div><div>Price: {data.listing.price} {data.listing.currency?.symbol}</div><div>Orderbook: {data.listing.orderbook}</div><div>Buyer: {data.buyer}</div></div>) : (<div className="text-sm opacity-90">Order ID: {data.orderId}</div>)}</div>
      <div className="rounded-xl border p-4"><h2 className="font-semibold">Fulfillment</h2><pre className="mt-2 text-xs overflow-x-auto p-3 rounded-md bg-black/5">{JSON.stringify(data.fulfillment, null, 2)}</pre>
        <button disabled={!canSend || sending} onClick={handleFulfill} className="mt-3 px-4 py-2 rounded-lg border disabled:opacity-50">{sending?"Sending…":(isConnected?"Fulfill with Wallet":"Connect wallet to buy")}</button>
      </div></div>)}
  </main>); }
