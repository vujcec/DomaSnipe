import { http, createConfig } from "wagmi";
import { injected, walletConnect } from "wagmi/connectors";
export const domaTestnet = {
  id: 97476,
  name: "Doma Testnet",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: [process.env.NEXT_PUBLIC_DOMA_RPC || "https://rpc-testnet.doma.xyz"] } },
} as const;
export const config = createConfig({
  chains: [domaTestnet],
  transports: { [domaTestnet.id]: http(process.env.NEXT_PUBLIC_DOMA_RPC || "https://rpc-testnet.doma.xyz") },
  connectors: [ injected(), walletConnect({ projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID || "demo" }) ],
});
