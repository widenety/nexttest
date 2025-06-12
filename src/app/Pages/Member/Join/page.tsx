'use client';
import React, { useState, useRef } from "react";
import { fetchSignInMethodsForEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

/*
import { useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
// */
export default function Join() {
	/* ==============================
	* .env.local 테스트
	================================= */
	console.log( process.env.NEXT_PUBLIC_FIREBASE_API_KEY );

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
	* 회원타입 선택
	================================= */
	const [ membTypeStr, setMembTypeStr ] = useState<string>( "" );
	const [ membTypeOk, setMembTypeOk ] = useState( false );
	const refTypePersonal = useRef<HTMLInputElement>( null );
	const setMbTypeChk = ( e: React.ChangeEvent<HTMLInputElement> ) => {
		const selectedMembType = e.target.value;
		setMembTypeStr( selectedMembType );
		setMembTypeOk( true );
	};

	/* ==============================
	* E-mail 유효성 검사 / 중복확인
	================================= */
	const [ emailStr, setEmailStr ] = useState<string>( "" );
	const [ emailTypeChk, setEmailTypeChk ] = useState( false );
	const [ emailIsDupl, setEmailIsDupl ] = useState( false );
	const [ emailOk, setEmailOk ] = useState( false );
	const emailRef = useRef<HTMLInputElement>( null );
	const setMbMailChk = async ( e: React.ChangeEvent<HTMLInputElement> ) => {
		const inputedEmail = e.target.value;
		setEmailStr( inputedEmail );

		/** -- E mail 유효성 검사 먼저. */
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const getEmailValid = emailRegex.test( inputedEmail );
		setEmailTypeChk( getEmailValid );

		/** -- E mail 유효하면 Firemase 중복확인. */

		/** -- 위 조건 전부 통과시 ok Flag state OK 설정. */
	}

	/** -- Firebase에서 중복 검사 */
	const getDuplStatus = async () => {
		if ( !emailStr || !emailTypeChk ) {
			alert( "올바른 이메일 형식을 입력해주세요." );
			return;
		}
		try {
			const methods = await fetchSignInMethodsForEmail( auth, emailStr );
			if ( methods.length > 0 ) {
				alert( "이미 사용 중인 이메일입니다." );
				setEmailIsDupl( false );
				setEmailOk( false );
			} else {
				alert( "사용 가능한 이메일입니다." );
				setEmailIsDupl( true );
				setEmailOk( true );
			}
		} catch ( err ) {
			console.error( "이메일 중복 확인 오류:", err );
			alert( "이메일 중복 확인 중 오류가 발생했습니다." );
		}
	}

	/* ==============================
	* Paswword 유효성 검사
	================================= */
	const passLenLim = 5;
	const [ passStr, setPassStr ] = useState<string>( "" );
	const [ passOk, setPassOk ] = useState( false );
	const [ hasLim, setHasLim ] = useState( false );
	const [ hasSpecialChar, setHasSpecialChar ] = useState( false );
	const [ hasLetter, setHasLetter ] = useState( false );
	const [ hasNumber, setHasNumber ] = useState( false );
	const refPass = useRef<HTMLInputElement>( null );
	const setMbPassChk = async ( e: React.ChangeEvent<HTMLInputElement> ) => {
		const inputedPass = e.target.value;
		setPassStr( inputedPass );

		/** -- 최소 5글자, 특수문자 포함, 영문자포함, 숫자 포함 검사 */
		const isMinLenOk = inputedPass.length >= passLenLim;
		const hasSpecial = /[!@#$%^&*(),.?":{}|<>_\-\[\]\\\/+=~`]/.test( inputedPass );
		const hasAlpha = /[a-zA-Z]/.test( inputedPass );
		const hasNum = /[0-9]/.test( inputedPass );

		setHasLim( isMinLenOk );
		setHasSpecialChar( hasSpecial );
		setHasLetter( hasAlpha );
		setHasNumber( hasNum );

		setPassOk( isMinLenOk && hasSpecial && hasAlpha && hasNum );
	}

	/* ==============================
	* 회원가입
	================================= */
	const setJoin = async () => {
	}

	return (
		<div className="frm join">
			{/*
			<h3 className="frmTitLv1 cTit1">Firebase 출력</h3>
			<p>이름: {name ?? "불러오는 중..."}</p>
			*/}

			<h3 className="frmTitLv1 cTit1">회원가입폼 #2</h3>
			<form>
				<ul className="frmListLv1">
					<li>
						<dl className="frmItemLv1">
							<dt><span>회원유형</span></dt>
							<dd>
								<ul className="frmListLv2">
									<li>
										<div className="rdos">
											<input type="radio" name="membType" id="Personal" value="개인회원" onChange={setMbTypeChk} ref={refTypePersonal} />
											<label htmlFor="Personal">개인회원</label>
										</div>
									</li>
									<li>
										<div className="rdos">
											<input type="radio" name="membType" id="Corporate" value="기업회원" onChange={setMbTypeChk} />
											<label htmlFor="Corporate">기업회원</label>
										</div>
									</li>
								</ul>
								<div>
									membTypeStr : {membTypeStr} <br />
									membTypeOk : <strong className="cred">{membTypeOk ? 'true' : 'false'}</strong><br />
								</div>
							</dd>
						</dl>
					</li>
					<li>
						<dl className="frmItemLv1">
							<dt><label>이메일</label></dt>
							<dd className="hasEmail">
								<input type="email" name="email" id="email" placeholder="이메일을 입력하세요." ref={emailRef} onChange={setMbMailChk} value={emailStr} autoComplete="off" />
								<button type="button" className="cBtn cBtn2 mailCheck" onClick={getDuplStatus}><span>중복확인</span></button>
								<ul className="cList1 hasIcon guideMsg">
									<li className={emailTypeChk ? 'on' : ''}><i className={`ico ri-${ emailTypeChk ? 'check' : 'close' }-line`} /><p className="txt">이메일 형태로 입력해주세요.</p></li>
									<li className={emailIsDupl ? 'on' : ''}><i className={`ico ri-${ emailIsDupl ? 'check' : 'close' }-line`} /><p className="txt">중복확인을 실행해주세요.</p></li>
								</ul>
								<div>
									emailStr : {emailStr} <br />
									emailTypeChk : {emailTypeChk ? 'true' : 'false'} <br />
									emailIsDupl : {emailIsDupl ? 'true' : 'false'} <br />
									emailOk : <strong className="cred">{emailOk ? 'true' : 'false'}</strong><br />
								</div>
							</dd>
						</dl>
					</li>
					<li>
						<dl className="frmItemLv1">
							<dt><label>비밀번호</label></dt>
							<dd className="hasPassword">
								<input type="password" name="password" id="password" placeholder="비밀번호를 입력하세요." ref={refPass} onChange={setMbPassChk} autoComplete="off" />
								<ul className="cList1 hasIcon guideMsg">
									<li className={hasLim ? 'on' : ''}><i className={`ico ri-${ hasLim ? 'check' : 'close' }-line`} /><p className="txt">최소 {passLenLim}글자 이상 작성바랍니다.</p></li>
									<li className={hasSpecialChar ? 'on' : ''}><i className={`ico ri-${ hasSpecialChar ? 'check' : 'close' }-line`} /><p className="txt">특수문자를 포함해주세요.</p></li>
									<li className={hasLetter ? 'on' : ''}><i className={`ico ri-${ hasLetter ? 'check' : 'close' }-line`} /><p className="txt">영문자를 포함해 주세요.</p></li>
									<li className={hasNumber ? 'on' : ''}><i className={`ico ri-${ hasNumber ? 'check' : 'close' }-line`} /><p className="txt">숫자를 포함해 주세요.</p></li>
								</ul>
								<div>
									passStr: {passStr} <br />
									hasLim : {hasLim ? 'true' : 'false'}<br />
									hasSpecialChar : {hasSpecialChar ? 'true' : 'false'}<br />
									hasLetter : {hasLetter ? 'true' : 'false'}<br />
									hasNumber : {hasLetter ? 'true' : 'false'}<br />
									passOk : <strong className="cred">{passOk ? 'true' : 'false'}</strong><br />
								</div>
							</dd>
						</dl>
					</li>
				</ul>
			</form>
			<button type="button" className="cBtn cBtn1 joinBtn" onClick={setJoin}><span>회원가입</span></button>
		</div>
	);
}
