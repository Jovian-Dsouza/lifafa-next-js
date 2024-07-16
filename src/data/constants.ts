import { images } from "./assets";

export const tokens: Token[] = [
  {
    name: "SOL",
    symbol: "SOL",
    icon: images.tokens.sol,
    blockchain: "Solana",
    blockchainIcon: images.tokens.sol,
  },
  {
    name: "USDC",
    symbol: "USDC",
    icon: images.tokens.usdc,
    blockchain: "Solana",
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