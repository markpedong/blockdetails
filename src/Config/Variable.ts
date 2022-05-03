export const HEADER_HEIGHT = 60;
export const chartDays = [
  { label: "1D", value: 1 },
  { label: "30D", value: 30 },
  { label: "60D", value: 60 },
  { label: "90D", value: 90 },
  { label: "1Y", value: 365 },
  { label: "MAX", value: "max" },
];

export const LineOptions = {
  elements: {
    point: {
      radius: 1,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        display: false,
      },
    },
  },
};

export const PROJECT_ECOSYSTEM = [
  {
    image: "https://cryptologos.cc/logos/avalanche-avax-logo.svg?v=022",
    label: "Avalanche Network",
    value: "avalanche-ecosystem",
    description:
      "Avalanche is a decentralized, open-source proof of stake blockchain with smart contract functionality.",
  },
  {
    image: "https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=022",
    label: "Binance Smart Chain",
    value: "binance-smart-chain",
    description:
      "Binance Smart Chain (BSC) is a blockchain network built for running smart contract-based applications.",
  },

  {
    image:
      "https://cryptologos.cc/logos/versions/ethereum-eth-logo-animated.gif?v=022",
    label: "Ethereum Network",
    value: "smart-contract-platform",
    description:
      "Ethereum is a decentralized, open-source blockchain with smart contract functionality.",
  },

  {
    image: "https://cryptologos.cc/logos/fantom-ftm-logo.svg?v=022",
    label: "Fantom Network",
    value: "fantom-ecosystem",
    description:
      "Fantom is a layer-1 blockchain aiming to provide an alternative to the high costs and low speeds about which users of Ethereum often complain.",
  },
  {
    image: "https://cryptologos.cc/logos/gnosis-gno-gno-logo.svg?v=022",
    label: "Gnosis Chain Ecosystem",
    value: "xdai-ecosystem",
    description:
      "The Gnosis cryptocurrency, GNO, is an Ethereum-based token sold during the Gnosis ICO.",
  },
  {
    image: "https://cryptologos.cc/logos/harmony-one-logo.svg?v=022",
    label: "Harmony Ecosystem",
    value: "harmony-ecosystem",
    description:
      "Harmony's native token ONE had been one of the fastest-growing cryptocurrencies.",
  },
  {
    image: "https://cryptologos.cc/logos/polygon-matic-logo.svg?v=022",
    label: "Polygon Ecosystem",
    value: "polygon-ecosystem",
    description:
      "Polygon is a cryptocurrency, with the symbol MATIC, and also a technology platform that enables blockchain networks to connect and scale.",
  },
  {
    image: "https://cryptologos.cc/logos/solana-sol-logo.svg?v=022",
    label: "Solana Network",
    value: "solana-ecosystem",
    description:
      "Solana is a high-performance blockchain supporting builders around the world creating crypto apps that scale today.",
  },
];
