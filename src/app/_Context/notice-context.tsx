"use client";

import { createContext, useContext } from 'react';
import React, { useState } from 'react';

// 알림창 Context의 State
interface State {
	show: boolean;
	isSuccessed: boolean;
	header: string;
	message: string;
	successed: ( info: Info ) => void;
	failed: ( info: Info ) => void;
	close: () => void;
}

export interface Info {
	header: string;
	message: string;
}

// 최초 useState에 들어가는 값
const defaultState: State = {
	show: false,
	isSuccessed: false,
	header: '',
	message: '',
	successed: () => { },	// ** successed: ( info: Info ) => { },
	failed: () => { },		// ** failed: ( info: Info ) => { },
	close: () => { },
};

// Provider에 들어갈 value를 생성한다.
const StateContext = createContext( defaultState );


const NoticeProvider: React.FC<{ children: React.ReactNode }> = ( {
	children,
} ) => {
	const [ state, setState ] = useState( defaultState );

	// 작업 성공 시 초록색 알림창을 띄우는 함수
	const successed = ( info: Info ) => {
		setState( ( prev ) => ( {
			...prev,
			show: true,
			isSuccessed: true,
			header: info.header,
			message: info.message,
		} ) );
	};

	// 작업 실패 시 빨간색 알림창을 띄우는 함수
	const failed = ( info: Info ) => {
		setState( ( prev ) => ( {
			...prev,
			show: true,
			isSuccessed: false,
			header: info.header,
			message: info.message,
		} ) );
	};

	// 알림창을 닫는 함수
	const close = () => {
		setState( defaultState );
	};

	const noticeCtx: State = {
		show: state.show,
		isSuccessed: state.isSuccessed,
		header: state.header,
		message: state.message,
		successed,
		failed,
		close,
	};

	return (
		<StateContext.Provider value={noticeCtx}>{children}</StateContext.Provider>
	);
};

// 사용하기 편하게 훅으로 만들어준다.
export const useNotice = () => {
	return useContext( StateContext );
};

export default NoticeProvider;