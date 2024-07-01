import React from "react";
// import { SessionProvider } from "next-auth/react"
import * as Sentry from "@sentry/nextjs";
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import "font-awesome/css/font-awesome.min.css";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import { SSRProvider } from 'react-bootstrap'
import { ToastContainer } from 'react-toastify';
import { parseCookies } from "nookies";
import Fetch from "../utils/Fetch";
import App, { AppContext, AppProps } from "next/app";
import LoadingScreen from "../components/Global/LoadingScreen";
import '../styles/globals.scss'
import Cookies from "js-cookie";
import ModalLogout from "@layout/Component/ModalLogout/ModalLogout";
import { useAppStore } from "src/stores/appStore";
import { cleanLocalStorage, cleanSessionStorage } from "src/selection";
import useWebSocketStore from "src/stores/webSocketStore";

config.autoAddCss = false

// config sentry
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
	Sentry.init ({
		enabled     : process.env.NODE_ENV == "production",
		dsn         : process.env.NEXT_PUBLIC_SENTRY_DSN,
		environment : process.env.NODE_ENV,
	});
}

function MyApp ({Component, pageProps : {session, ...pageProps}}: AppProps & { pageProps: { session: any } }) {
	const [loading, setLoading]                 = React.useState (false);
	const showModalLogout                       = useAppStore ((state: any) => state.showModalLogout)
	const {connectWebSocket, socket, connected} = useWebSocketStore ();
	
	React.useEffect (() => {
		if (!socket && !connected) {
			connectWebSocket ();
		}
		return () => {
		};
	}, [connectWebSocket, socket, connected]);
	
	React.useEffect (() => {
		
		global.showLoading = (_show) => {
			if (_show === false) {
				setLoading (false);
				return;
			}
			setLoading (true);
		};
	}, []);
	
	Fetch.checkNetwork ();
	const handleLogout = () => {
		cleanLocalStorage ();
		cleanSessionStorage ();
		window.location.href = "/sign-in";
	}
	return (
		<>
			{ !loading ? (
				// <SessionProvider session={session}>
				
				<>
					<ToastContainer
						position="top-right"
						autoClose={ 2000 }
						hideProgressBar={ false }
						newestOnTop
						closeOnClick
						rtl={ false }
						pauseOnFocusLoss
						draggable
						pauseOnHover
					/>
						<Component { ...pageProps } />
					<ModalLogout show={ showModalLogout } onSubmit={ handleLogout }/>
				
				</>
				
				// </SessionProvider>
			) : (
				<LoadingScreen/>
			) }
		</>
	);
}

// config init web
MyApp.getInitialProps = async (appContext: AppContext) => {
	global.ctx     = appContext.ctx;
	const {ctx}    = appContext;
	const cookies  = parseCookies (appContext.ctx);
	const appProps = await App.getInitialProps (appContext);
	
	const access_token = ctx.query.access_token as string;
	if (access_token) {
		Fetch.access_token = access_token;
	}
	
	let checkRedirect = true;
	// ignore check redirect route
	if (appContext.router.pathname.includes ("/sign-in")) checkRedirect = false;
	const accessToken: any = cookies['access_token'];
	if (accessToken) {
		checkRedirect = false;
	}
	
	// check authentication
	// if (checkRedirect) {
	//   ctx.res?.writeHead(302, {
	//     Location: `/dang-nhap`,
	//   });
	//   ctx.res?.end();
	//   return appProps;
	// }
	
	return {...appProps};
};

export default MyApp
