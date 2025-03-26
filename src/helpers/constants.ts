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
  }
> = {
  BTC: {
    name: "Bitcoin",
    logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
  },
  ETH: {
    name: "Ethereum",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  },
  BNB: {
    name: "Binance Coin",
    logo: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png",
  },
  SOL: {
    name: "Solana",
    logo: "https://cryptologos.cc/logos/solana-sol-logo.png",
  },
  USDT: {
    name: "Tether",
    logo: "https://cryptologos.cc/logos/tether-usdt-logo.png",
  },
  USDC: {
    name: "USD Coin",
    logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
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
