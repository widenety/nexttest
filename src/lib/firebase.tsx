// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDERID!,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
	measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp( firebaseConfig ) : getApp();
// const analytics = getAnalytics( app );
const db = getFirestore( app );
const auth = getAuth( app );

// Analytics는 브라우저 환경에서만 가능
let analytics: ReturnType<typeof getAnalytics> | null = null;
if ( typeof window !== "undefined" ) {
	isSupported().then( ( supported ) => {
		if ( supported ) {
			analytics = getAnalytics( app );
		}
	} );
}

export { app, db, auth, analytics };