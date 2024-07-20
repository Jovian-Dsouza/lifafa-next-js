import { images } from "./assets";

export const tokens: Token[] = [
  {
    name: "SEND",
    symbol: "SEND",
    icon: images.tokens.send,
    blockchain: "Send",
    blockchainIcon: images.tokens.send,
  },
  {
    name: "SEND",
    symbol: "SEND",
    icon: images.tokens.send,
    blockchain: "Send",
    blockchainIcon: images.tokens.send,
  },
];

export interface Token {
  name: string;
  symbol: string;
  icon: string;
  blockchain: string;
  blockchainIcon: string;
}
