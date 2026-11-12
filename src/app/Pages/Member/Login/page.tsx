'use client';
import Link from 'next/link';
import { useNotice } from "@/app/_Context/notice-context";  // 👈 import
export default function Login() {
	/* ==============================
	* alert 대신 사용
	================================= */
	const notice = useNotice();		// ** console.log( "Notice 객체:", notice );

	/* ==============================
	* 아이디 찾기
	================================= */
	const getFindId = async () => {
		notice.failed( { header: "준비중입니다.", message: "곧 서비스 하도록 하겠습니다." } );
	}
	return (
		<div className="frm login">
			<h3 className="frmTitLv1 cTit1">로그인 #2</h3>
			<form>
				<ul className="frmListLv1">
					<li>
						<dl className="frmItemLv1">
							<dt><label htmlFor="idField">아이디</label></dt>
							<dd>
								<input type="text" name="idField" id="idField" placeholder="아이디를 입력하세요." autoComplete="off" />
							</dd>
						</dl>
					</li>
					<li>
						<dl className="frmItemLv1">
							<dt><label htmlFor="passwordField">비밀번호</label></dt>
							<dd>
								<input type="password" name="passwordField" id="passwordField" placeholder="비밀번호를 입력하세요." autoComplete="off" />
							</dd>
						</dl>
					</li>
				</ul>
			</form>
			<ul className="cList2">
				<li>
					<Link href="/Pages/Member/Join" className="cLink cBtn1"><span>회원가입</span></Link>
				</li>
				<li>
					<button type="button" className="cLink cBtn1" onClick={getFindId}><span>아이디 찾기</span></button>
				</li>
			</ul>
			<button type="button" className="cBtn cBtn1 joinBtn"><span>로그인</span></button>
		</div>
	);
}
