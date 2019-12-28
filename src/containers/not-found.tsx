import React from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  AlertIcon,
  AlertDescription,
  AlertTitle,
  Flex
} from "@chakra-ui/core";

export function NotFound() {
  return (
    <Flex height="90vh" align="center" justify="center">
      <Alert
        status="error"
        variant="subtle"
        flexDirection="column"
        justifyContent="center"
        textAlign="center"
        height="200px"
        width="600px"
      >
        <AlertIcon size="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Sorry, page not found!
        </AlertTitle>
        <AlertDescription maxWidth="sm">
          Try going back <Link to="/">Home</Link>
        </AlertDescription>
      </Alert>
    </Flex>
  );
}
