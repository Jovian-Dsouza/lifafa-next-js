import { db } from "../lib/firebaseConfig";
import {
  collection,
  doc,
  setDoc,
  orderBy,
  query,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";

export async function storeLifafa(
  network: string,
  walletPublicKey: string,
  id: string,
  transaction_hash: string,
): Promise<void> {
  if (!walletPublicKey) {
    return;
  }
  id = String(id);
  try {
    await setDoc(doc(db, "lifafa", network, walletPublicKey, id), {
      id,
      transaction_hash,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("storeLifafa: ", error);
  }
}

export function retrieveLifafa(
  network: string,
  walletPublicKey: string,
  setData: (data: string[]) => void,
): (() => void) | null {
  if (!walletPublicKey) {
    return null;
  }
  try {
    const q = query(
      collection(db, "lifafa", network, walletPublicKey),
      orderBy("timestamp", "desc"),
    );

    return onSnapshot(q, (querySnapshot) => {
      const tmpData: string[] = [];
      querySnapshot.forEach((doc) => {
        tmpData.push(doc.data().id);
      });
      setData(tmpData);
    });
  } catch (error) {
    console.error("retrieveLifafa: ", error);
    return null;
  }
}

export async function deleteLifafaInStore(
  network: string,
  walletPublicKey: string,
  id: string,
): Promise<void> {
  if (!walletPublicKey || !id) {
    return;
  }
  id = String(id);
  try {
    await deleteDoc(doc(db, "lifafa", network, walletPublicKey, id));
  } catch (error) {
    console.error("deleteLifafa: ", error);
  }
}