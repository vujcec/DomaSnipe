import Link from "next/link";
export default function Home(){
  return (<main className="mx-auto max-w-3xl p-6 space-y-3">
    <h1 className="text-3xl font-bold">DomaSnipe — Track 3</h1>
    <p>Alerts from Doma Poll API + buy/offer helpers.</p>
    <ul className="list-disc pl-6">
      <li><Link className="underline" href="/alerts">Alerts feed</Link></li>
      <li><Link className="underline" href="/buy?sld=panda&tld=.ape">Buy sample</Link></li>
      <li><Link className="underline" href="/offer">Make an offer</Link></li>
    </ul>
  </main>);
}
