// wagmi.ts

import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { celo } from "@reown/appkit/networks";

const projectId = "cd169b99d42633d1d81f5aee613d0eed"; // get from reown.com

export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks: [celo],
  ssr: true,
  connectors: [],
});

createAppKit({
  adapters: [wagmiAdapter],
  networks: [celo],
  projectId,
  metadata: {
    name: "CHSwap",
    description: "CHSwap on Celo",
    url: "https://swap.critterholes.xyz/",
    icons: ["https://swap.critterholes.xyz//logo.png"],
  },
  features: {
    history: false,
    send: true,
  },
  themeMode: "dark",
});

export const config = wagmiAdapter.wagmiConfig;