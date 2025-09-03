export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
const UPSTREAM=(process.env.DOMA_API_BASE||"https://api-testnet.doma.xyz").replace(/\/+$/,"") + "/v1/orderbook";
const API_KEY=process.env.DOMA_API_KEY||"";
async function pass(req:NextRequest, method:"GET"|"POST"|"DELETE"){
  if(!API_KEY) return NextResponse.json({ error:"Server missing DOMA_API_KEY" },{ status:500 });
  const url=new URL(req.url);
  const seg=url.pathname.split("/api/proxy/orderbook/")[1]||"";
  const upstream=`${UPSTREAM}/${seg}${url.search}`;
  const init:any={ method, headers:{ "Api-Key":API_KEY, "content-type":"application/json" } };
  if(method!=="GET") init.body=await req.text();
  const r=await fetch(upstream, init);
  const t=await r.text();
  return new NextResponse(t,{ status:r.status, headers:{ "content-type": r.headers.get("content-type")||"application/json" } });
}
export async function GET(req:NextRequest){ return pass(req,"GET"); }
export async function POST(req:NextRequest){ return pass(req,"POST"); }
export async function DELETE(req:NextRequest){ return pass(req,"DELETE"); }
