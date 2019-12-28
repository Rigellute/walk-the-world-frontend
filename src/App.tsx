import Amplify, { Auth } from "aws-amplify";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { CSSReset, ColorModeProvider, ThemeProvider } from "@chakra-ui/core";
import config from "./config";
import { Nav } from "./components/nav";
import { Routes } from "./containers/routes";

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
  },
  API: {
    endpoints: [
      {
        name: "steps",
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION
      }
    ]
  }
});

function App() {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    onLoad(userHasAuthenticated, setIsAuthenticating);
  }, []);

  return (
    <ThemeProvider>
      <ColorModeProvider value="dark">
        <CSSReset />
        <Router>
          <Nav appProps={{ isAuthenticated, userHasAuthenticated }} />
          <Routes appProps={{ isAuthenticated, userHasAuthenticated }} />
        </Router>
      </ColorModeProvider>
    </ThemeProvider>
  );
}

async function onLoad(
  userHasAuthenticated: React.Dispatch<React.SetStateAction<boolean>>,
  setIsAuthenticating: React.Dispatch<React.SetStateAction<boolean>>
) {
  try {
    await Auth.currentSession();
    userHasAuthenticated(true);
  } catch (e) {
    if (e !== "No current user") {
      alert(e);
    }
  }

  setIsAuthenticating(false);
}

export default App;
