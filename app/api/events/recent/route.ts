export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
async function tailJsonl(filePath: string, n=50){
  try{ const data=await fs.readFile(filePath,"utf-8"); const lines=data.trim().split(/\r?\n/).filter(Boolean); return lines.slice(-n).map(l=>JSON.parse(l)); }
  catch{ return []; }
}
export async function GET(){
  const dir=path.join(process.cwd(), "data");
  const alerts=path.join(dir, "alerts.jsonl");
  const state=path.join(dir, "poll_state.json");
  const items=await tailJsonl(alerts,50);
  let lastId=null; try{ const s=JSON.parse(await fs.readFile(state,"utf-8")); lastId=s.lastId??null; }catch{}
  return NextResponse.json({ items, meta: { lastId } });
}
