import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Firebase 설정
const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDERID!,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
	measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
};

// Firebase App 초기화 (중복 방지)
const app = getApps().length === 0 ? initializeApp( firebaseConfig ) : getApp();

// 서비스 초기화
const db = getFirestore( app );
const auth = getAuth( app );

// Analytics (브라우저 환경에서만)
let analytics: ReturnType<typeof getAnalytics> | null = null;
if ( typeof window !== "undefined" ) {
	isSupported().then( ( supported ) => {
		if ( supported ) {
			analytics = getAnalytics( app );
		}
	} );
}

export { app, db, auth, analytics };