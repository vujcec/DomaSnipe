export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
const SUBGRAPH=process.env.DOMA_SUBGRAPH_URL||"https://api-testnet.doma.xyz/graphql";
const API_BASE=process.env.DOMA_API_BASE||"https://api-testnet.doma.xyz";
const API_KEY=process.env.DOMA_API_KEY||"";
const CHAIN_CAIP2="eip155:97476";
async function getTokenInfo(name:string){
  const q=`query T($name:String!){ tokens(name:$name, take:1){ items { tokenId tokenAddress } } }`;
  const res=await fetch(SUBGRAPH,{ method:"POST", headers:{ "content-type":"application/json", ...(API_KEY?{ "Api-Key":API_KEY }:{}) }, body: JSON.stringify({ query:q, variables:{ name } }) });
  if(!res.ok) throw new Error(`Subgraph error ${res.status}`);
  const j=await res.json(); const it=j?.data?.tokens?.items?.[0]; if(!it) return null;
  return { tokenId:String(it.tokenId), contract:String(it.tokenAddress) };
}
async function getFees(orderbook:string, contractAddress:string){
  const url=`${API_BASE}/v1/orderbook/fee/${orderbook}/${CHAIN_CAIP2}/${contractAddress}`;
  const res=await fetch(url,{ headers:{ "Api-Key": API_KEY } });
  if(!res.ok) throw new Error(`Fee API error ${res.status}`);
  const j=await res.json(); return j?.marketplaceFees||[];
}
function toUnits(amount:string, decimals:number){ const [i,fRaw]=String(amount).split('.'); const f=(fRaw||'').padEnd(decimals,'0').slice(0,decimals); return (i||'0') + (decimals?f:''); }
export async function GET(req:NextRequest){
  try{
    const sp=new URL(req.url).searchParams;
    const sld=sp.get("sld")||""; const tld=(sp.get("tld")||"").replace(/^\./,"");
    const price=sp.get("price")||"0.1"; const currency=(sp.get("currency")||"WETH").toUpperCase();
    const orderbook=(sp.get("orderbook")||"DOMA").toUpperCase(); const hours=Math.max(1, Math.min(720, Number(sp.get("hours")||24)));
    const buyer=sp.get("buyer")||"";
    if(!sld || !tld) return NextResponse.json({ error:"sld and tld required" },{ status:400 });
    if(!API_KEY) return NextResponse.json({ error:"DOMA_API_KEY not set on server" },{ status:400 });
    const name=`${sld}.${tld}`; const token=await getTokenInfo(name); if(!token) return NextResponse.json({ error:"Token not found for name" },{ status:404 });
    const currencies={ WETH:"0x6f898cd313dcEe4D28A87F675BD93C471868B0Ac", USDC:"0x2f3463756C59387D6Cd55b034100caf7ECfc757b" } as Record<string,string>;
    const currencyAddress=currencies[currency]||currencies.WETH; const decimals=currency==="USDC"?6:18;
    const fees=await getFees(orderbook, token.contract); const now=Math.floor(Date.now()/1000); const end=now + Math.floor(hours*3600);
    const paramsDraft={ offerer: buyer||"0x...", orderbook, chainId: CHAIN_CAIP2, expirationTime: end, items: [{ contract: token.contract, tokenId: token.tokenId, currencyContractAddress: currencyAddress, price: toUnits(price, decimals) }], marketplaceFees: fees };
    return NextResponse.json({ ok:true, name, token, paramsDraft, notes:["Sign EIP-712 order with these params","ETH->WETH handled by SDK","POST to /api/offer/submit"] });
  }catch(e:any){ return NextResponse.json({ error:e?.message||"error" },{ status:500 }); }
}
