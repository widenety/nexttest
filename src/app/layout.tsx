import Link from 'next/link';
import './_Css/layout/layout.scss';
import './_Css/common.scss';
//import CustomHead from './_Layout/CustomHead';
//import type { Metadata } from 'next';
//import { Geist, Geist_Mono } from 'next/font/google';

/*
const geistSans = Geist( {
	variable: '--font-geist-sans',
	subsets: [ 'latin' ],
} );
const geistMono = Geist_Mono( {
	variable: '--font-geist-mono',
	subsets: [ 'latin' ],
} );
export const metadata: Metadata = {
	title: 'Widenety\'s Test App',
	description: 'Widenety\'s Toy Project',
};
// */
export default function RootLayout( {
	children,
}: Readonly<{
	children: React.ReactNode;
}> ) {
	return (
		<html lang="ko">
			<head>
				{/* <CustomHead /> */}
				<title>Widenety&apos;s Test App</title>
				<meta name="description" content="Widenety&apos;s Toy Project" />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
				<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR&display=swap" rel="stylesheet" />
			</head>
			{/* <body className={`${ geistSans.variable } ${ geistMono.variable } antialiased`}> */}
			<body>
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
			</body>
		</html>
	);
}
