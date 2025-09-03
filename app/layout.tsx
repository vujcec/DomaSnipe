import type { Metadata } from "next";
import "@rainbow-me/rainbowkit/styles.css";
import { WagmiProvider } from "wagmi";
import { config } from "./lib/wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
export const metadata: Metadata = { title: "DomaSnipe-LiteTrack3", description: "Bots & Subscriptions demo" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body><WagmiProvider config={config}><RainbowKitProvider theme={darkTheme()} modalSize="compact">{children}</RainbowKitProvider></WagmiProvider></body></html>);
}
