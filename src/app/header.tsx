'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/_Context/auth-context';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
export default function Header() {
	/* ==============================
	* Router 초기 설정.
	================================= */
	const router = useRouter();

	/* ==============================
	* 로그인 상태보기
	================================= */
	const { user, loading } = useAuth();
	if ( loading ) return <p>로그인 확인 중...</p>;
	if ( user ) {
		console.group( "로그인 정보 in Header" );
		console.log( 'UID:', user.uid );
		console.log( '이메일:', user.email );
		console.log( 'Live:', user.live );
		console.log( 'memberType:', user.memberType );
		console.groupEnd();
	}

	/* ==============================
	* 로그아웃
	================================= */
	const getLogout = async () => {
		try {
			await signOut( auth );
			console.log( '로그아웃 성공' );
			router.push( '/' );
		} catch ( error ) {
			console.error( '로그아웃 오류:', error );
		}
	};

	/* ==============================
	* 로그인 검증중
	================================= */
	if ( loading ) return <p>로그인 확인 중...</p>;

	return (
		<div id="Header">
			<h1 className="logo">
				<Link href="/">로고</Link>
			</h1>
			<nav className="navi">
				<ul>
					<li><Link href="/Pages/OpenApi/Facilities">OpenApi</Link></li>
					<li>
						{user ? (
							<button onClick={getLogout}>Logout</button>
						) : (
							<Link href="/Pages/Member/Login">Login</Link>
						)}
					</li>
					<li><Link href="/Pages/Member/Join">Join</Link></li>
				</ul>
			</nav>
		</div>
	);
}