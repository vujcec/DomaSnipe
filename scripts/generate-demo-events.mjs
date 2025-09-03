import { appendFile, mkdir } from "fs/promises";
import { dirname, join } from "path";
const file=join(process.cwd(), "data", "alerts.jsonl");
await mkdir(dirname(file), { recursive: true });
const sample=(id,name,type="LISTING_CREATED")=>({ id, type, name, score: Number(Math.random().toFixed(3)), time: new Date().toISOString(), link: `http://localhost:3000/buy?sld=${name.split(".")[0]}&tld=.ape` });
for(let i=0;i<10;i++){ await appendFile(file, JSON.stringify(sample(Date.now()+i, `demo${i}.ape`))+"\n"); }
console.log("Demo alerts appended to data/alerts.jsonl");
