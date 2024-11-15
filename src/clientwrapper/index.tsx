"use client";

import { AuthProvider } from "../context/AuthContext";
import { WorldCoinProvider } from "../context/WorldCoinContext";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import Headers from "../components/Headers";
import { createConfig, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "viem";
import { scrollSepolia } from 'viem/chains';

export const wagmiConfig = createConfig({
  chains: [scrollSepolia],
  multiInjectedProviderDiscovery: false,
  transports: {
    [scrollSepolia.id]: http(),
  },
});

const evmNetworks = [
  {
    blockExplorerUrls: ["https://sepolia.scrollscan.com"],
    chainId: 534351,
    chainName: "Scroll Sepolia",
    iconUrls: ["https://scroll.io/static/media/Scroll_Logomark.673577c8260b63ae56867bc9af6af514.svg"], // Replace with the official Scroll logo URL if different
    name: "Scroll",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    networkId: 534351,
    rpcUrls: ["https://sepolia-rpc.scroll.io/"], // Verify the RPC URL from official sources
    vanityName: "Scroll Sepolia",
  },
];

const queryClient = new QueryClient();

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID || "",
        walletConnectors: [EthereumWalletConnectors],
        overrides: { evmNetworks },
      }}
    >
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>
            <AuthProvider>
              <WorldCoinProvider>
                <Headers />
                {children}
              </WorldCoinProvider>
            </AuthProvider>
          </DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
}
