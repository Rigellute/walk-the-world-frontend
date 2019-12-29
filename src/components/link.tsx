import React from "react";
import { Link as UILink } from "@chakra-ui/core";
import { Link as RouterLink } from "react-router-dom";

export function Link(props: { message: string; to: string }) {
  return (
    /* TypeScript does not like the `as` prop, ignore it with this weird syntax
// @ts-ignore */
    <UILink color="teal.500" as={RouterLink} to={props.to}>
      {props.message}
    </UILink>
  );
}
