export default function Login() {
	return (
		<div className="frm login">
			<h3 className="frmTitLv1 cTit1">로그인 #1</h3>
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
		</div>
	);
}
