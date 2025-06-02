'use client';
import { useEffect, useState, useRef } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";

export default function Join() {
	/* ==============================
	* .env.local 테스트
	================================= */
	// ** console.log( process.env.NEXT_PUBLIC_FIREBASE_API_KEY );

	/* ==============================
	* Firebase 데이터 불러오기 테스트
	================================= */
	/*
	const [ name, setName ] = useState<string | null>( null );
	const getMbMail = async () => {
		try {
			const docRef = doc( db, "tblMember", "JLjAD2mOaWjMtLNTCW4E" ); // 컬렉션 이름, 문서 ID
			const docSnap = await getDoc( docRef );
			if ( docSnap.exists() ) {
				const data = docSnap.data();
				setName( data.mbMail );
			} else {
				console.log( "문서를 찾을 수 없습니다." );
			}
		} catch ( err ) {
			console.error( "데이터 불러오기 오류:", err );
		}
	};
	useEffect( () => {
		getMbMail();
	}, [] );
	// */

	/* ==============================
	* 회원유형 선택용 state
	================================= */
	const [ membType, setMembType ] = useState<string>( "" );
	const typePersonalRef = useRef<HTMLInputElement>( null ); // 개인회원 라디오에 focus용

	/* ==============================
	* 회원가입
	================================= */
	const setJoin = async () => {
		/** -- 회원유형 선택여부 검증 */
		if ( !membType ) {
			alert( "회원 유형을 선택해주세요." );
			typePersonalRef.current?.focus(); // 개인회원 라디오에 focus
			return;
		}
	}

	/* ==============================
	* 중복확인
	================================= */
	const [ email, setEmail ] = useState<string>( "" );
	const [ emailCheck, setEmailCheck ] = useState( false );
	const emailRef = useRef<HTMLInputElement>( null );
	const getIsDupl = async () => {
		/** -- E mail 유효성 검사 */
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if ( !email ) {
			alert( "이메일을 입력해주세요." );
			setEmail( "" );
			emailRef.current?.focus();
			return;
		} else if ( !email || !emailRegex.test( email ) ) {
			alert( "올바른 이메일 형식을 입력해주세요." );
			setEmail( "" );
			emailRef.current?.focus();
			return;
		} else {
			alert( "올바른 이메일 형식입니다." );
			setEmailCheck( true );
		}

		/** -- Firebase에서 중복 검사 */

		/** -- 중복 검사 */
	}

	return (
		<div className="frm join">
			{/*
			<h3 className="frmTitLv1 cTit1">Firebase 출력</h3>
			<p>이름: {name ?? "불러오는 중..."}</p>
			*/}

			<h3 className="frmTitLv1 cTit1">회원가입폼</h3>
			<form>
				<ul className="frmListLv1">
					<li>
						<dl className="frmItemLv1">
							<dt><span>회원유형</span></dt>
							<dd>
								<ul className="frmListLv2">
									<li>
										<div className="rdos">
											<input type="radio" name="membType" id="Personal" value="개인회원" onChange={( e ) => setMembType( e.target.value )} ref={typePersonalRef} />
											<label htmlFor="Personal">개인회원</label>
										</div>
									</li>
									<li>
										<div className="rdos">
											<input type="radio" name="membType" id="Corporate" value="기업회원" onChange={( e ) => setMembType( e.target.value )} />
											<label htmlFor="Corporate">기업회원</label>
										</div>
									</li>
								</ul>
							</dd>
						</dl>
					</li>
					<li>
						<dl className="frmItemLv1">
							<dt><label>이메일</label></dt>
							<dd className="hasEmail">
								<input type="email" name="email" id="email" placeholder="이메일을 입력하세요." ref={emailRef} onChange={( e ) => setEmail( e.target.value )} value={email} autoComplete="off" />
								<button type="button" className="cBtn cBtn2 mailCheck" onClick={getIsDupl}><span>중복확인</span></button>
							</dd>
						</dl>
					</li>
					<li>
						<dl className="frmItemLv1">
							<dt><label>비밀번호</label></dt>
							<dd className="hasPassword">
								<input type="password" name="password" id="password" placeholder="비밀번호를 입력하세요." />
							</dd>
						</dl>
					</li>
				</ul>
			</form>
			<button type="button" className="cBtn cBtn1 joinBtn" onClick={setJoin}><span>회원가입</span></button>
		</div>
	);
}
