export const shareOnX = (content: string) => {
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=Ask%20me%20anything%2C%20anonymously%21%20&url=${encodeURIComponent(
    content,
  )}`;
  window.open(twitterShareUrl, "_blank");
};

export const shareQuestionOnX = (content: string) => {
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=%5Byour%20answer%20here%5D%20&url=${encodeURIComponent(
    content,
  )}`;
  window.open(twitterShareUrl, "_blank");
};

export const openDailect = (id: string) => {
  const shareUrl = `https://dial.to/action=solana-action:https://www.lifafa.fun/api/actions/claim_lifafa/${id}`;
  window.open(shareUrl, "_blank");
};


export const copyToClipboard = (content: string) => {
  navigator.clipboard
    .writeText(content)
    .then(() => {
      alert("Link copied to clipboard"); //TODO replace with modal
    })
    .catch((err) => {
      console.error("Failed to copy the text to clipboard: ", err);
    });
};
