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

export const data = [
  {
    image:
      "https://cryptologos.cc/logos/versions/ethereum-eth-logo-animated.gif?v=022",
    label: "Ethereum Network",
    value: "ethereum",
    description:
      "Ethereum is a decentralized, open-source blockchain with smart contract functionality. Ether is the native cryptocurrency of the platform.",
  },

  {
    image: "https://cryptologos.cc/logos/avalanche-avax-logo.svg?v=022",
    label: "Avalanche Network",
    value: "avalanche",
    description:
      "Avalanche is a decentralized, open-source proof of stake blockchain with smart contract functionality. AVAX is the native cryptocurrency of the platform.",
  },
  {
    image: "https://img.icons8.com/clouds/256/000000/homer-simpson.png",
    label: "Homer Simpson",
    value: "Homer Simpson",
    description: "Overweight, lazy, and often ignorant",
  },
  {
    image: "https://img.icons8.com/clouds/256/000000/spongebob-squarepants.png",
    label: "Spongebob Squarepants",
    value: "Spongebob Squarepants",
    description: "Not just a sponge",
  },
];
