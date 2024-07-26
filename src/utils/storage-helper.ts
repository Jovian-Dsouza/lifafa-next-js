export const storeJSONLocalStorage = async (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Error storing JSON data in local storage", e);
  }
};

export const getJSONLocalStorage = async (key: string) => {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const jsonValue = localStorage.getItem(key);
    if (jsonValue !== null && jsonValue !== "undefined") {
      const value = JSON.parse(jsonValue);
      return value;
    }
    return null;
  } catch (e) {
    console.error("Error getting JSON data from local storage", e);
  }
  return null;
};

export interface AuthDetails {
    token: string,
    wallet_address: string,
}
export const AUTH_DETAILS_LOCAL_STORAGE_KEY = "token";
export const storeAuthDetails = async (value: AuthDetails) => {
    await storeJSONLocalStorage(AUTH_DETAILS_LOCAL_STORAGE_KEY, value);
}
export const getAuthDetails = async () : Promise<AuthDetails | null> => {
    return await getJSONLocalStorage(AUTH_DETAILS_LOCAL_STORAGE_KEY);
}

export const clearLocalStorage = async () => {
  try {
    localStorage.clear();
  } catch (e) {
    console.error("Error clearing local storage", e);
  }
};