
'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

// 회원정보 타입
interface MemberInfo {
	live?: boolean;
	memberType?: string;
}

// Firebase User + Firestore 회원정보
interface AuthUser extends User, MemberInfo { }

interface AuthContextType {
	user: AuthUser | null;
	loading: boolean;
}

const AuthContext = createContext<AuthContextType>( {
	user: null,
	loading: true
} );

export function AuthProvider( { children }: { children: ReactNode } ) {
	const [ user, setUser ] = useState<AuthUser | null>( null );
	const [ loading, setLoading ] = useState( true );

	useEffect( () => {
		const unsubscribe = onAuthStateChanged( auth, async ( currentUser ) => {
			try {
				if ( currentUser ) {
					// Firestore 회원정보 조회
					const memberRef = doc( db, 'tblMember', currentUser.uid );
					const memberSnap = await getDoc( memberRef );

					const memberInfo: MemberInfo = memberSnap.exists()
						? memberSnap.data() as MemberInfo
						: {};

					setUser( Object.assign(
						Object.create( Object.getPrototypeOf( currentUser ) ),
						currentUser,
						memberInfo
					) as AuthUser );

				} else {
					setUser( null );
				}
			} catch ( error ) {
				console.error( '회원정보 조회 오류:', error );
				setUser( currentUser as AuthUser | null );
			} finally {
				setLoading( false );
			}
		} );

		return () => unsubscribe();
	}, [] );

	return (
		<AuthContext.Provider value={{ user, loading }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext( AuthContext );
}