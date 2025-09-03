export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
export async function POST(req: NextRequest){
  try{ const body=await req.json(); const p=path.join(process.cwd(), "data", "filters.json"); await fs.writeFile(p, JSON.stringify(body, null, 2)); return NextResponse.json({ ok:true }); }
  catch(e:any){ return NextResponse.json({ error:e?.message||"bad json" },{ status:400 }); }
}
