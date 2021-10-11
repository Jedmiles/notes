import "../styles/globals.css";
import { AuthContext } from "../contexts/AuthContext";
import { Amplify, Auth } from "aws-amplify";
import config from "../config";
import React, { useState, useEffect } from "react";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  Amplify.configure({
    Auth: {
      mandatorySignIn: true,
      region: config.cognito.REGION,
      userPoolId: config.cognito.USER_POOL_ID,
      identityPoolId: config.cognito.IDENTITY_POOL_ID,
      userPoolWebClientId: config.cognito.APP_CLIENT_ID,
    },
    Storage: {
      region: config.s3.REGION,
      bucket: config.s3.BUCKET,
      identityPoolId: config.cognito.IDENTITY_POOL_ID,
    },
    API: {
      endpoints: [
        {
          name: "notes",
          endpoint: config.apiGateway.URL,
          region: config.apiGateway.REGION,
        },
      ],
    },
    ssr: true,
  });

  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    onLoad();
  }, []);
  async function onLoad() {
    try {
      await Auth.currentAuthenticatedUser();
      userHasAuthenticated(true);
    } catch (e) {
    }
    setIsAuthenticating(false);
  }

  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <title>Scratch</title>
      </Head>
      <AuthContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
        {!isAuthenticating && <Component {...pageProps} />}
      </AuthContext.Provider>
    </>
  );
}

export default MyApp;
