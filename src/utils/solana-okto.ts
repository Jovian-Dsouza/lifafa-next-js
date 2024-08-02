import type { ExecuteRawTransaction } from "okto-sdk-react";

export function solanaTransaction(
  transaction: any,
  signers: string[],
  network_name: string,
): ExecuteRawTransaction {
  return {
    network_name,
    transaction: {
      instructions: transaction.instructions,
      signers: signers,
    },
  };
}
