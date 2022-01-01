import Head from "next/head";
import { useState, useEffect, useContext, createContext } from "react";
import { useRouter } from "next/router";

import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.css";
import { userService } from "../services/user.service";
import { AppStore } from "../store";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const AppContext = createContext<AppStore>({
    username: '',
    isLoggedIn: false,
});

  useEffect(() => {
    // run auth check on initial load
    authCheck(router.asPath);

    // set authorized to false to hide page content while changing routes
    const hideContent = () => setAuthorized(false);
    router.events.on("routeChangeStart", hideContent);

    // run auth check on route change
    router.events.on("routeChangeComplete", authCheck);

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off("routeChangeStart", hideContent);
      router.events.off("routeChangeComplete", authCheck);
    };
  }, []);

  function authCheck(url) {
    // redirect to login page if accessing a private page and not logged in
    const publicPaths = ["/login"];
    const path = url.split("?")[0];
    if (!userService.userValue && !publicPaths.includes(path)) {
      setAuthorized(false);
      router.push({
        pathname: "/login",
        query: { returnUrl: router.asPath },
      });
    } else {
      setAuthorized(true);
    }
  }

  return (
    <>
      <Head>
        <title>Cloud Firewall</title>
      </Head>

      {authorized && <Component {...pageProps} />}
    </>
  );
}

export default MyApp;
