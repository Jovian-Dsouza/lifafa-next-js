import { images } from "./assets";

export const tokens: Token[] = [
  // {
  //   name: "SOL",
  //   symbol: "SOL",
  //   icon: images.tokens.sol,
  //   blockchain: "SOL",
  //   blockchainIcon: images.tokens.sol,
  //   decimals: 9,
  //   address: "",
  // },
  {
    name: "SEND",
    symbol: "SEND",
    icon: images.tokens.send,
    blockchain: "SOL",
    blockchainIcon: images.tokens.sol,
    decimals: 6,
    address: "SENDdRQtYMWaQrBroBrJ2Q53fgVuq95CV9UPGEvpCxa",
  },
  {
    name: "SEND",
    symbol: "SEND",
    icon: images.tokens.send,
    blockchain: "SOL_DEVNET",
    blockchainIcon: images.tokens.sol,
    decimals: 6,
    address: "DXYqm3CbM5W6iYA6vDmn35m3LCYhkwKFCZtv2J3q726r",
  },
];

export interface Token {
  name: string;
  symbol: string;
  icon: string;
  blockchain: string;
  blockchainIcon: string;
  decimals: number;
  address: string;
}
