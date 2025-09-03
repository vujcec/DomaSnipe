export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { scoreEvent } from "../../../lib/scoring";
const API_BASE=process.env.DOMA_API_BASE||"https://api-testnet.doma.xyz";
const API_KEY=process.env.DOMA_API_KEY||"";
const OWNER=process.env.OWNER_WALLET||"";
const TG_TOKEN=process.env.TELEGRAM_BOT_TOKEN||"";
const TG_CHAT=process.env.TELEGRAM_CHAT_ID||"";
type E = { id:number; type:string; name?:string; eventData?: any; };
function splitName(n?:string){ if(!n) return { sld:"", tld:"" }; const parts=n.split('.'); return { sld: parts[0], tld: (parts.slice(1).join('.') ? '.'+parts.slice(1).join('.') : '') }; }
async function readFilters(){ try{ const raw=await fs.readFile(path.join(process.cwd(),"data","filters.json"),"utf-8"); return JSON.parse(raw); } catch { return { rules:[{ tlds:[".ape",".core"], maxPriceEth:0.5, minScore:0.5, maxHoursToExpiry:72 }] }; } }
async function appendJsonl(rel:string, obj:any){ const p=path.join(process.cwd(),"data",rel); await fs.mkdir(path.dirname(p),{recursive:true}); await fs.appendFile(p, JSON.stringify(obj)+"\n"); }
async function sendTelegram(text:string){ if(!TG_TOKEN||!TG_CHAT) return; const url=`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`; await fetch(url,{ method:"POST", headers:{ "content-type":"application/json" }, body: JSON.stringify({ chat_id: TG_CHAT, text, disable_web_page_preview: true }) }).catch(()=>{}); }
function passes(name:string, score:number, hours:number|null, cfg:any){ const { tld }=splitName(name); for(const r of (cfg.rules||[])){ if(r.tlds && !r.tlds.includes(tld||"")) continue; if(typeof r.minScore==="number" && score<r.minScore) continue; if(typeof r.maxHoursToExpiry==="number" && hours!=null && hours>r.maxHoursToExpiry) continue; return true; } return false; }
export async function GET(req: NextRequest){
  try{
    if(!API_KEY) return NextResponse.json({ error:"DOMA_API_KEY not set" }, { status:400 });
    const url=new URL(req.url);
    const limit=Number(url.searchParams.get("limit")||"50");
    const finalizedOnly=url.searchParams.get("finalizedOnly")!=="false";
    const r=await fetch(`${API_BASE}/v1/poll?limit=${limit}&finalizedOnly=${finalizedOnly}`, { headers:{ "Api-Key": API_KEY } });
    if(!r.ok) return NextResponse.json({ error:`Poll error ${r.status}`, details: await r.text() },{ status:502 });
    const data=await r.json() as { events:E[], lastId:number, hasMoreEvents:boolean };
    const cfg=await readFilters(); const now=Date.now();
    for(const ev of data.events){
      const name=ev.name || ev.eventData?.name || ""; const expiresAt=ev.eventData?.expiresAt || null;
      const score=scoreEvent({ name, expiresAt, eventType: ev.type });
      const hrs=expiresAt? Math.max(0,(new Date(expiresAt).getTime()-now)/3.6e6):null;
      const { sld, tld } = splitName(name);
      const link=`${process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000"}/buy?sld=${encodeURIComponent(sld)}&tld=${encodeURIComponent(tld)}&buyer=${encodeURIComponent(OWNER||"")}`;
      const alert={ id: ev.id, type: ev.type, name, tld, score, time: new Date().toISOString(), link };
      if(name && passes(name, score, hrs, cfg)){ await appendJsonl("alerts.jsonl", alert); await sendTelegram(`🔥 ${ev.type} ${name}\nscore ${score} — ${link}`); }
      await appendJsonl("events.jsonl", { ...alert, raw: ev });
    }
    await fs.writeFile(path.join(process.cwd(),"data","poll_state.json"), JSON.stringify({ lastId: data.lastId, hasMore: data.hasMoreEvents }, null, 2));
    if(typeof data.lastId === "number"){ await fetch(`${API_BASE}/v1/poll/ack/${data.lastId}`, { method:"POST", headers:{ "Api-Key": API_KEY } }).catch(()=>{}); }
    return NextResponse.json({ ok:true, processed: data.events.length, lastId: data.lastId, hasMore: data.hasMoreEvents });
  }catch(e:any){ return NextResponse.json({ error:e?.message||"poll failed" },{ status:500 }); }
}
