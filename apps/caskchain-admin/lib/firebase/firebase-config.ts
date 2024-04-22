const config = {
  apiKey: 'AIzaSyB8HP7rr0y2AZ0Bhp4ErRtm5xkeF9h-Shg',
  authDomain: 'cask-chain.firebaseapp.com',
  projectId: 'cask-chain',
  storageBucket: 'cask-chain.appspot.com',
  messagingSenderId: '238553895266',
  appId: '1:238553895266:web:1cc09e257c987b190a9c3b',
  measurementId: 'G-C0EZEYX8RE',
}

export function getFirebaseConfig() {
  if (!config || !config.apiKey) {
    throw new Error(
      'No Firebase configuration object provided.' +
        '\n' +
        "Add your web app's configuration object to firebase-config.ts"
    )
  } else {
    return config
  }
}
