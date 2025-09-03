export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
const API_BASE=process.env.DOMA_API_BASE||"https://api-testnet.doma.xyz";
const API_KEY=process.env.DOMA_API_KEY||"";
export async function POST(req:NextRequest){
  try{
    if(!API_KEY) return NextResponse.json({ error:"DOMA_API_KEY not set on server" },{ status:400 });
    const body=await req.json();
    const res=await fetch(`${API_BASE}/v1/orderbook/offer`,{ method:"POST", headers:{ "content-type":"application/json", "Api-Key":API_KEY }, body: JSON.stringify(body) });
    const text=await res.text(); if(!res.ok) return NextResponse.json({ error:`Orderbook error ${res.status}`, details: text },{ status:502 });
    return new NextResponse(text,{ status:200, headers:{ "content-type":"application/json" } });
  }catch(e:any){ return NextResponse.json({ error:e?.message||"error" },{ status:500 }); }
}
