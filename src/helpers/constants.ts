export const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const FALLBACK_LOGO =
  "https://www.svgrepo.com/show/508699/landscape-placeholder.svg";
export const FALLBACK_COVER_IMAGE =
  "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";

export const AUTH_USER_KEY = "user";
export const AUTH_TOKENS_KEY = "tokens";

export const CRYPTO_CURRENCY: Record<
  string,
  {
    name: string;
    logo: string;
    wallet_address: string;
  }
> = {
  BTC: {
    name: "Bitcoin",
    logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
    wallet_address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
  },
  ETH: {
    name: "Ethereum",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    wallet_address: "0xeBec795c9c8bBD61FFc14A6662944748F299cAcf",
  },
  BNB: {
    name: "Binance Coin",
    logo: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png",
    wallet_address: "0xBA401CdaC1A3b6AEeDe21c9C4a483be6C29F88C5",
  },
  SOL: {
    name: "Solana",
    logo: "https://cryptologos.cc/logos/solana-sol-logo.png",
    wallet_address:
      "2SJx8HzqAy9qp66Yyw94AQgyvK6NFVsAWDpnHEQmCHAtdKJC8q6eUsFkBeTfYv2aw9yp85bdoEnnpRchVcxWnkmF",
  },
  USDT: {
    name: "Tether",
    logo: "https://cryptologos.cc/logos/tether-usdt-logo.png",
    wallet_address: "0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97",
  },
  USDC: {
    name: "USD Coin",
    logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
    wallet_address: "0x2bf916f8169Ed2a77324d3E168284FC252aE4087",
  },
};

export const FIAT_CURRENCY: Record<
  string,
  {
    name: string;
    icon: string;
  }
> = {
  USD: {
    name: "United States Dollar",
    icon: "$",
  },
  EUR: {
    name: "Euro",
    icon: "€",
  },
  GBP: {
    name: "British Pound",
    icon: "£",
  },
};
