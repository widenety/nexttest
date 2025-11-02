"use client";
import { useEffect, useRef } from "react";
import { useNotice } from "../_Context/notice-context";
export default function Notice() {
	const notice = useNotice();
	const noticeRef = useRef<HTMLDivElement>( null );
	useEffect( () => {	// ** Notice가 나타날 때 포커스
		if ( notice.show && noticeRef.current ) {
			noticeRef.current.focus();
		}
	}, [ notice.show ] );
	if ( !notice.show ) return null;

	return (
		<div className={`notiPkg ${ notice.isSuccessed ? "successed" : "failed" }`} >
			<div className="box" ref={noticeRef} tabIndex={-1}>
				<div className="header">
					<h4 className="title">{notice.header}</h4>
					<button type="button" className="actionBtn" onClick={notice.close}><span className="blind">닫기</span></button>
				</div>
				<div className="contents">
					<p className="message">{notice.message}</p>
				</div>
			</div>
		</div>
	);
}