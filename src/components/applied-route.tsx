import React from "react";
import { Route } from "react-router-dom";

export function AppliedRoute({ component: C, appProps, ...rest }: any) {
  return <Route {...rest} render={props => <C {...props} {...appProps} />} />;
}
