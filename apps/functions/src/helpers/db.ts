import * as admin from "firebase-admin";

const db = admin.firestore();

export const getUser = async (uid: string) => {
  return await db.collection("users").doc(uid).get();
};

export const getCask = async (tokenId: string) => {
  return await db.collection("casks").doc(tokenId).get();
};
