import Link from 'next/link';
import './_Css/common.scss';
import './_Css/layout/layout.scss';
import './_Css/styleGuide.scss';
import './_Css/contents.scss';
import type { Metadata } from 'next';
import '@fontsource/noto-sans-kr/400.css';
import '@fontsource/noto-sans-kr/700.css';
import "remixicon/fonts/remixicon.css";
import NoticeProvider from "./_Context/notice-context"; // 👈 Context import
import Notice from "./_Layout/Notice"; // 👈 알림창 UI 컴포넌트(직접 생성 예정)

// import { Geist, Geist_Mono } from 'next/font/google';

/*
const geistSans = Geist( {
	variable: '--font-geist-sans',
	subsets: [ 'latin' ],
} );
const geistMono = Geist_Mono( {
	variable: '--font-geist-mono',
	subsets: [ 'latin' ],
} );
 // */
export const metadata: Metadata = {
	title: "Widenety's Test app",
	description: "Widenety's Toy project",
	/*
	generator: "Next.js",
	applicationName: "앱 이름",
	referrer: "origin-when-cross-origin",
	keywords: [ "nextjs", "app", "widenety" ],
	authors: [ { name: "작성자", url: "https://..." } ],
	creator: "Widenety",
	publisher: "Widenety",
	robots: "index, follow",
	themeColor: "#ffffff",
	colorScheme: "light dark",
	category: "web app",
	// */
};

export default function RootLayout( {
	children,
}: Readonly<{
	children: React.ReactNode;
}> ) {
	return (
		<html lang="ko">
			<head>
				<meta name="format-detection" content="telephone=no" />
				<meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
				<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
				<meta httpEquiv="Content-Style-Type" content="text/css" />
				<meta httpEquiv="imagetoolbar" content="no" />
				<meta httpEquiv="Pragma" content="no-cache" />
				<meta httpEquiv="expries" content="0" />
			</head>
			{/* <body className={`${ geistSans.variable } ${ geistMono.variable } antialiased`}> */}
			<body>
				<NoticeProvider>
					<Notice /> {/* 전역 알림창 */}
					<div id="wrap">
						<div id="Header">
							<h1 className="logo">
								<Link href="/">로고</Link>
							</h1>
							<nav className="navi">
								<ul>
									<li><Link href="/Pages/Member/Login">Login</Link></li>
									<li><Link href="/Pages/Member/Join">Join</Link></li>
								</ul>
							</nav>
						</div>
						<div id="Contents">
							{children}
						</div>
						<div id="Footer">
							<div className="logo">로고</div>
							<div className="copy">Copyright widenety</div>
						</div>
					</div>
				</NoticeProvider>
			</body>
		</html>
	);
}
