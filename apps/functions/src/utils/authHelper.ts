import * as admin from "firebase-admin";

// Initialize Firebase Admin if it hasn't been initialized yet
if (!admin.apps.length) {
  admin.initializeApp();
}

/**
 * Verifies the Firebase Authentication token.
 * @param {string} idToken - The Firebase ID token from the client.
 * @returns {Promise<admin.auth.DecodedIdToken>}
 * @throws {Error} Throws an error if the token is invalid or verification fails.
 */
async function verifyAuthToken(idToken: string) {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    throw new Error("Unauthorized - Token is invalid");
  }
}

export { verifyAuthToken };
