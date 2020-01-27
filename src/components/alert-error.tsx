import React from "react";
import { Alert, AlertIcon } from "@chakra-ui/core";

export function AlertError({ message }: { message: string }) {
  return (
    <Alert mt="1rem" status="error">
      <AlertIcon />
      {message}
    </Alert>
  );
}
