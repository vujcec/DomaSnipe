export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
export async function GET(){
  const p=path.join(process.cwd(), "data", "filters.json");
  try{ const raw=await fs.readFile(p,"utf-8"); return NextResponse.json(JSON.parse(raw)); }
  catch{ return NextResponse.json({ rules: [{ tlds: [".ape",".core"], maxPriceEth: 0.5, minScore: 0.5, maxHoursToExpiry: 72 }] }); }
}
