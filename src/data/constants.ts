import { images } from "./assets";

export const tokens: Token[] = [
  {
    name: "SOL",
    symbol: "SOL",
    icon: images.tokens.sol,
    blockchain: "SOL",
    blockchainIcon: images.tokens.sol,
  },
  {
    name: "SEND",
    symbol: "SEND",
    icon: images.tokens.send,
    blockchain: "SOL",
    blockchainIcon: images.tokens.sol,
  },
];

export interface Token {
  name: string;
  symbol: string;
  icon: string;
  blockchain: string;
  blockchainIcon: string;
}
