export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
const SUBGRAPH=process.env.DOMA_SUBGRAPH_URL||"https://api-testnet.doma.xyz/graphql";
const API_BASE=process.env.DOMA_API_BASE||"https://api-testnet.doma.xyz";
const API_KEY=process.env.DOMA_API_KEY||"";
const OWNER=process.env.OWNER_WALLET||"";
type Listing={ id:string; externalId:string; price:string; currency:{ symbol:string, decimals:number }; orderbook:string; };
async function findListing(sld:string,tld:string):Promise<Listing|null>{
  const q=`query Listings($sld:String,$tlds:[String!],$take:Float){ listings(sld:$sld,tlds:$tlds,take:$take){ items { id externalId price orderbook currency { symbol decimals } } } }`;
  const res=await fetch(SUBGRAPH,{ method:"POST", headers:{ "content-type":"application/json", ...(API_KEY?{ "Api-Key":API_KEY }: {}) }, body: JSON.stringify({ query:q, variables:{ sld, tlds:[tld.replace(/^\./,'')], take:10 } }) });
  if(!res.ok) throw new Error(`Subgraph error: ${res.status}`);
  const j=await res.json(); const items:Listing[]=j?.data?.listings?.items||[];
  if(!items.length) return null; items.sort((a,b)=>(Number(a.price)||0)-(Number(b.price)||0)); return items[0];
}
export async function GET(req:NextRequest){
  try{
    const sp=new URL(req.url).searchParams;
    const sld=sp.get("sld")||""; const tld=sp.get("tld")||""; const orderId=sp.get("orderId")||""; const buyer=sp.get("buyer")||OWNER;
    if(!sld && !orderId) return NextResponse.json({ error:"sld or orderId required" },{ status:400 });
    if(!buyer) return NextResponse.json({ error:"buyer is required (OWNER_WALLET or ?buyer=...)" },{ status:400 });
    if(!API_KEY) return NextResponse.json({ error:"DOMA_API_KEY not set" },{ status:400 });
    let chosen=orderId; let listing:Listing|null=null;
    if(!chosen){ if(!tld) return NextResponse.json({ error:"tld required when searching by sld" },{ status:400 }); listing=await findListing(sld,tld); if(!listing) return NextResponse.json({ error:"No active listings found" },{ status:404 }); chosen=listing.externalId||listing.id; }
    const url=`${API_BASE}/v1/orderbook/listing/${encodeURIComponent(chosen!)}/${buyer}`;
    const resp=await fetch(url,{ headers:{ "Api-Key":API_KEY } });
    if(!resp.ok) return NextResponse.json({ error:`Orderbook error ${resp.status}`, details: await resp.text() },{ status:502 });
    const data=await resp.json();
    return NextResponse.json({ ok:true, orderId: chosen, buyer, listing, fulfillment: data });
  }catch(e:any){ return NextResponse.json({ error:e?.message||"unknown error" },{ status:500 }); }
}
