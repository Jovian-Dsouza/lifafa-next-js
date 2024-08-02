export const openDailect = (id: string, network: string) => {
  const url = `solana-action:https://www.lifafa.fun/claim_lifafa/${id}`;
  const shareUrl = network === "devnet" ? `https://dial.to/devnet?action=${url}` : `https://dial.to/?action=${url}`;
  window.open(shareUrl, "_blank");
};


export const openClaimPage = (id: string) => {
  const shareUrl = `https://www.lifafa.fun/claim_lifafa/${id}`;
  window.open(shareUrl, "_blank");
};


export const copyToClipboard = (id: string) => {
  const content = `https://www.lifafa.fun/claim_lifafa/${id}`
  navigator.clipboard
    .writeText(content)
    .then(() => {
      alert("Link copied to clipboard"); //TODO replace with modal
    })
    .catch((err) => {
      console.error("Failed to copy the text to clipboard: ", err);
    });
};