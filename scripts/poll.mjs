import "dotenv/config";
const base=process.env.DOMA_API_BASE||"https://api-testnet.doma.xyz";
const key=process.env.DOMA_API_KEY||"";
if(!key){ console.error("DOMA_API_KEY missing"); process.exit(1); }
const limit=process.env.POLL_LIMIT||"50";
const delayMs=Number(process.env.POLL_DELAY_MS||"4000");
async function runOnce(){
  const res=await fetch(`${base}/v1/poll?limit=${limit}`,{ headers:{ "Api-Key": key } });
  if(!res.ok){ console.error("poll error", res.status, await res.text()); return; }
  const ingest=await fetch(`http://localhost:${process.env.PORT||3000}/api/poll/run?limit=${limit}`,{ headers:{ "accept":"application/json" } });
  if(!ingest.ok){ console.error("ingest failed", ingest.status, await ingest.text()); }
}
async function loop(){ while(true){ try{ await runOnce(); }catch(e){ console.error("loop error", e); } await new Promise(r=>setTimeout(r, delayMs)); } }
loop();
