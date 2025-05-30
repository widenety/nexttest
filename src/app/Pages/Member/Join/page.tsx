export default function Join() {
	return (
		<div className="frm join">
			<h3 className="frmTitLv1 cTit1">회원가입폼</h3>
			<ul className="frmListLv1">
				<li>
					<dl className="frmItemLv1">
						<dt><span>회원유형</span></dt>
						<dd>
							<ul className="frmListLv2">
								<li>
									<div className="rdos">
										<input type="radio" name="memberType" id="memberType1" value="일반회원" defaultChecked />
										<label htmlFor="memberType1">일반회원</label>
									</div>
								</li>
								<li>
									<div className="rdos">
										<input type="radio" name="memberType" id="memberType2" value="기업회원" />
										<label htmlFor="memberType2">기업회원</label>
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
							<input type="email" name="email" id="email" placeholder="이메일을 입력하세요." />
							<button type="button" className="cBtn cBtn2 mailCheck"><span>중복확인</span></button>
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
			<button type="button" className="cBtn cBtn1 joinBtn"><span>회원가입</span></button>
		</div>
	);
}
