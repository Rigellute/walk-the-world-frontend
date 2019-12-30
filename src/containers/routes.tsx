import React from "react";
import { Switch } from "react-router-dom";
import { LoginForm } from "./login";
import { SignupForm } from "./signup";
import { NotFound } from "./not-found";
import { Home } from "./home";
import { AppliedRoute } from "../components/applied-route";
import { AppProps } from "../types";

export function Routes({ appProps }: { appProps: AppProps }) {
  return (
    <Switch>
      <AppliedRoute path="/" exact component={Home} appProps={appProps} />
      <AppliedRoute
        path="/login"
        exact
        component={LoginForm}
        appProps={appProps}
      />
      <AppliedRoute
        path="/signup"
        exact
        component={SignupForm}
        appProps={appProps}
      />
      <AppliedRoute path="/*" component={NotFound} appProps={appProps} />
    </Switch>
  );
}
