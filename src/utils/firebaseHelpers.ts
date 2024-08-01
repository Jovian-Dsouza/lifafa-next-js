
import { db } from "../lib/firebaseConfig";
import {
  collection,
  doc,
  setDoc,
  orderBy,
  query,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

export type LifafaType = "created" | "sent";

export async function storeLifafa(
  walletPublicKey: string,
  id: string,
  transaction_hash: string,
  lifafaType: LifafaType,
): Promise<void> {
  if (!walletPublicKey) {
    return;
  }
  id = String(id);
  try {
    await setDoc(doc(db, "users", walletPublicKey, lifafaType, id), {
      id,
      transaction_hash,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("storeLifafa: ", error);
  }
}

export function retrieveLifafa(
  walletPublicKey: string,
  setData: (data: string[]) => void,
  lifafaType: LifafaType,
): (() => void) | null {
  if (!walletPublicKey) {
    return null;
  }
  try {
    const q = query(
      collection(db, "users", walletPublicKey, lifafaType),
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
