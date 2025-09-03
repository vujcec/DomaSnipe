'use client';
import { useEffect, useState } from "react";
type Alert = { id:number; type:string; name:string; tld?:string; score:number; time:string; link:string; };
export default function Alerts(){
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [auto, setAuto] = useState(true);
  const [last, setLast] = useState<number|undefined>(undefined);
  async function refresh(){ const res = await fetch('/api/events/recent'); const j = await res.json(); setAlerts(j.items||[]); setLast(j.meta?.lastId); }
  useEffect(()=>{ refresh(); },[]);
  useEffect(()=>{ if(!auto) return; const id=setInterval(refresh, 3000); return ()=>clearInterval(id); },[auto]);
  return (<main className="mx-auto max-w-4xl p-6 space-y-4">
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">Alerts</h1>
      <div className="flex items-center gap-2">
        <button onClick={refresh} className="px-3 py-1 rounded-md border">Refresh</button>
        <label className="text-sm flex items-center gap-2"><input type="checkbox" checked={auto} onChange={e=>setAuto(e.target.checked)} /> Auto</label>
      </div>
    </div>
    <div className="text-sm opacity-70">Last event id: {last ?? '—'}</div>
    <div className="grid gap-3">
      {alerts.map(a => <div key={a.id} className="rounded-xl border p-4">
        <div className="flex items-center justify-between">
          <div className="font-semibold">{a.type}</div><div className="text-xs opacity-70">{new Date(a.time).toLocaleString()}</div>
        </div>
        <div className="mt-1">{a.name} {a.tld}</div>
        <div className="text-sm opacity-80">Score: {a.score}</div>
        <a className="mt-2 inline-block underline" href={a.link}>Open</a>
      </div>)}
      {!alerts.length && <div className="rounded-xl border p-6 text-center opacity-70">No alerts yet — run <code>npm run poll</code>.</div>}
    </div>
  </main>);
}
