export async function getTokenPrice(token: string): Promise<number> {
  const url = `https://price.jup.ag/v6/price?ids=${token}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching price: ${response.statusText}`);
    }

    const priceResponse: any = await response.json();
    return priceResponse.data[token].price;
  } catch (error) {
    console.error("Error fetching token price:", error);
    throw error;
  }
}
