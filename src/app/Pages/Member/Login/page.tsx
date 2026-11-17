'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNotice } from "@/app/_Context/notice-context";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import { auth, db } from "@/lib/firebase";
import { useAuth } from '@/app/_Context/auth-context';
import { cp } from 'fs';
export default function Login() {
	/* ==============================
	* alert 대신 사용.
	================================= */
	const notice = useNotice();		// ** console.log( "Notice 객체:", notice );

	/* ==============================
	* Router 초기 설정.
	================================= */
	const router = useRouter();

	/* ==============================
	* 아이디 찾기.
	================================= */
	const runFindId = async () => {
		notice.failed( { header: "준비중입니다.", message: "곧 서비스 하도록 하겠습니다." } );
	}

	// ==============================
	// 로그인 입력값 관리.
	// ==============================
	const [ idStr, setIdStr ] = useState( '' );
	const [ passwordStr, setPasswordStr ] = useState( '' );

	/* ==============================
	* 로그인 하기.
	================================= */
	const runLogin = async () => {
		/** -- 이메일, 비밀번호 입력값 확인 */
		if ( !idStr.trim() ) {
			notice.failed( { header: "아이디를 입력하세요.", message: "이메일을 입력해 주세요." } );
			return;
		}
		if ( !passwordStr ) {
			notice.failed( { header: "비밀번호를 입력하세요.", message: "비밀번호를 입력해 주세요." } );
			return;
		}

		try {
			/** ---- Firebase 로그인 */
			const userCredential = await signInWithEmailAndPassword( auth, idStr.trim(), passwordStr );
			const user = userCredential.user;

			/** ---- Firestore 회원 정보 조회 */
			const memberRef = doc( db, 'tblMember', user.uid );
			const memberSnap = await getDoc( memberRef );

			if ( !memberSnap.exists() ) {
				notice.failed( { header: "회원 정보 오류", message: "회원 정보를 찾을 수 없습니다." } );
				return;
			}
			const memberData = memberSnap.data();
			console.log( "로그인 성공:", user.uid );
			console.log( "회원 정보:", memberData );

			/** ---- 로그인 성공 후 이동 */
			router.push( '/' );

		} catch ( error ) {
			if ( error instanceof FirebaseError ) {
				if ( error.code === 'auth/invalid-credential' ) {
					notice.failed( { header: "로그인 실패", message: "아이디 또는 비밀번호가 일치하지 않습니다." } );
				} else if ( error.code === 'auth/user-disabled' ) {
					notice.failed( { header: "로그인 실패", message: "사용이 중지된 계정입니다." } );
				} else {
					notice.failed( { header: "로그인 오류", message: "로그인 중 오류가 발생했습니다." } );
				}
			} else {
				notice.failed( { header: "오류 발생", message: "잠시 후 다시 시도해 주세요." } );
			}
			console.error( "로그인 오류:", error );
		}
	}

	/* ==============================
	* 비밀번호 미리보기
	================================= */
	const [ showPassword, setShowPassword ] = useState( false );
	const runTogglePasswordVisibility = () => {
		setShowPassword( prev => !prev );
	}

	/* ==============================
	* 로그인 상태보기
	================================= */
	const { user, loading } = useAuth();
	if ( loading ) return <p>로그인 확인 중...</p>;
	if ( user ) {
		console.group( "로그인 정보" );
		console.log( 'UID:', user.uid );
		console.log( '이메일:', user.email );
		console.log( 'Live:', user.live );
		console.groupEnd();
	}

	return (
		<div className="frm login">
			<h3 className="frmTitLv1 cTit1">로그인 #4</h3>
			<form onSubmit={( e ) => { e.preventDefault(); runLogin(); }}>
				<ul className="frmListLv1">
					<li>
						<dl className="frmItemLv1">
							<dt><label htmlFor="idField">아이디</label></dt>
							<dd>
								<input type="text" name="idField" id="idField" placeholder="아이디를 입력하세요." autoComplete="off" value={idStr} onChange={( e ) => setIdStr( e.target.value )} />
							</dd>
						</dl>
					</li>
					<li>
						<dl className="frmItemLv1">
							<dt><label htmlFor="passwordField">비밀번호</label></dt>
							<dd className="hasBtn">
								<input type={showPassword ? "text" : "password"} name="passwordField" id="passwordField" placeholder="비밀번호를 입력하세요." autoComplete="off" value={passwordStr} onChange={( e ) => setPasswordStr( e.target.value )} />
								<button type="button" onClick={runTogglePasswordVisibility}>
									{
										!showPassword ? (
											<i className="ri-eye-close-line"></i>
										) : (
											<i className="ri-eye-line"></i>
										)
									}
								</button>
							</dd>
						</dl>
					</li>
				</ul>
				<ul className="cList2">
					<li>
						<Link href="/Pages/Member/Join" className="cLink cBtn1"><span>회원가입</span></Link>
					</li>
					<li>
						<button type="button" className="cLink cBtn1" onClick={runFindId}><span>아이디 찾기</span></button>
					</li>
				</ul>
				<button type="submit" className="cBtn cBtn1 joinBtn" ><span>로그인</span></button>
			</form>
		</div>
	);
}
