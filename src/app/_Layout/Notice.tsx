"use client";
import { useNotice } from "../_Context/notice-context";
// test #1
export default function Notice() {
	const notice = useNotice();

	if ( !notice.show ) return null;

	return (
		<div
			style={{ width: "100px", height: "100px", border: "3px solid #f00" }}
			className={`fixed top-4 right-4 p-4 rounded-xl shadow-lg text-white z-50 transition ${ notice.isSuccessed ? "bg-green-600" : "bg-red-600" }`} >
			<h4 className="font-bold">{notice.header}</h4>
			<p>{notice.message}</p>
			<button className="mt-2 underline text-sm" onClick={notice.close} > 닫기 </button>
		</div>
	);
}