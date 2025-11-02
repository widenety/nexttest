'use client';
import React, { useState, useRef } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";	// ** fetchSignInMethodsForEmail, signOut
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp, collection, where, getDocs, query } from "firebase/firestore";
import { useNotice } from "@/app/_Context/notice-context";  // 👈 import

export default function Join() {
	/* ==============================
	* alert 대신 사용
	================================= */
	const notice = useNotice();		// ** console.log( "Notice 객체:", notice );

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

	/** -- E-mail 형식 유효성 검사 */
	const setMbMailChk = async ( e: React.ChangeEvent<HTMLInputElement> ) => {
		const inputedEmail = e.target.value;
		setEmailStr( inputedEmail );

		/** -- 이메일을 다시 입력하면 이전 중복확인 결과는 무효 처리 */
		setEmailIsDupl( false );
		setEmailOk( false );

		/** -- E mail 유효성 검사 먼저. */
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const getEmailValid = emailRegex.test( inputedEmail );
		setEmailTypeChk( getEmailValid );
	}

	/** -- Firebase에서 중복 검사 */
	const getDuplStatus = async () => {
		if ( !emailStr || !emailTypeChk ) {
			notice.failed( { header: "회원가입 실패", message: "올바른 이메일 형식을 입력해주세요." } );
			setEmailIsDupl( false );
			setEmailOk( false );
			return;
		}

		try {
			const q = query( collection( db, "tblMember" ), where( "email", "==", emailStr.trim() ) );
			const querySnapshot = await getDocs( q );
			if ( !querySnapshot.empty ) {
				notice.failed( { header: "이메일 사용불가", message: "이미 사용 중인 이메일입니다." } );
				setEmailIsDupl( false );
				setEmailOk( false );
			} else {
				notice.successed( { header: "이메일 사용가능", message: "사용 가능한 이메일입니다." } );
				setEmailIsDupl( true );
				setEmailOk( true );
			}
		} catch ( error: unknown ) {
			console.error( "Firestore 중복 확인 오류:", error );
			//alert( "중복 확인 중 오류가 발생했습니다: " + error.message );
			notice.failed( { header: "이메일 검증불가", message: "중복 확인 중 오류가 발생했습니다.\n잠시 후 다시 시도해주세요." } );
			setEmailIsDupl( false );
			setEmailOk( false );
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
		console.log( "membTypeOk  : ", membTypeOk );
		console.log( "emailOk  : ", refTypePersonal );
		console.log( "passOk  : ", passOk );

		if ( !membTypeOk ) {
			notice.failed( { header: "회원가입 실패", message: "회원유형(기업회원, 개인회원 중)을 선택해주세요. \n선택하지 않으시면 회원가입하실수 없습니다." } );

			setMembTypeStr( "" );
			refTypePersonal.current?.focus();
			return;
		}
		if ( !emailOk ) {
			notice.failed( { header: "회원가입 실패", message: "이메일을 올바르게 입력하고 중복확인을 해주세요." } );
			emailRef.current?.focus();
			return;
		}
		if ( !passOk ) {
			notice.failed( { header: "회원가입 실패", message: "비밀번호를 올바르게 입력해주세요." } );
			refPass.current?.focus();
			return;
		}

		try {
			const userCredential = await createUserWithEmailAndPassword( auth, emailStr, passStr );
			const user = userCredential.user;

			/** -- Firestore에 회원 정보 저장 */
			await setDoc( doc( db, "tblMember", user.uid ), {
				uid: user.uid,
				email: emailStr,
				memberType: membTypeStr,
				createdAt: serverTimestamp(),
			} );

			notice.successed( { header: "회원가입 성공", message: "회원가입이 완료되었습니다!" } );
			/** -- 리디렉션 또는 로그인 상태 전환 등 */
		} catch ( error ) {
			console.error( "회원가입 오류:", error );
			notice.failed( { header: "회원가입 실패", message: "회원가입 중 문제가 발생했습니다." } );
		}
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
								{/* <div>
									membTypeStr : {membTypeStr} <br />
									membTypeOk : <strong className="cred">{membTypeOk ? 'true' : 'false'}</strong><br />
								</div> */}
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
								{/* <div>
									emailStr : {emailStr} <br />
									emailTypeChk : {emailTypeChk ? 'true' : 'false'} <br />
									emailIsDupl : {emailIsDupl ? 'true' : 'false'} <br />
									emailOk : <strong className="cred">{emailOk ? 'true' : 'false'}</strong><br />
								</div> */}
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
								{/* <div>
									passStr: {passStr} <br />
									hasLim : {hasLim ? 'true' : 'false'}<br />
									hasSpecialChar : {hasSpecialChar ? 'true' : 'false'}<br />
									hasLetter : {hasLetter ? 'true' : 'false'}<br />
									hasNumber : {hasLetter ? 'true' : 'false'}<br />
									passOk : <strong className="cred">{passOk ? 'true' : 'false'}</strong><br />
								</div> */}
							</dd>
						</dl>
					</li>
				</ul>
			</form>
			<button type="button" className="cBtn cBtn1 joinBtn" onClick={setJoin}><span>회원가입</span></button>
		</div>
	);
}
