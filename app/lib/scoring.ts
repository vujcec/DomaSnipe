export function scoreEvent(input: { name?: string; expiresAt?: string | null; eventType?: string }){
  const sld = (input.name||"").split(".")[0];
  const rarity = sld ? Math.min(1, 6/Math.max(1, sld.length)) : 0.3;
  let urgency = 0; if (input.expiresAt){ const hrs=(new Date(input.expiresAt).getTime()-Date.now())/3.6e6; urgency = Math.max(0, Math.min(1, (72 - Math.min(72, hrs))/72)); }
  return Number((0.4*rarity + 0.6*urgency).toFixed(3));
}
