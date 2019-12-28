import { Auth } from "aws-amplify";
import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { Flex, Button, Box, Heading } from "@chakra-ui/core";
import { AppProps } from "../types";

// FIXME: This shoud be a container
export function Nav(props: { appProps: AppProps }) {
  const handleLogout = useCallback(async () => {
    await Auth.signOut();
    props.appProps.userHasAuthenticated(false);
  }, [props.appProps]);
  return (
    <Box
      as="header"
      left="0"
      right="0"
      borderBottomWidth="1px"
      width="full"
      height="4rem"
    >
      <Flex size="100%" px="6" align="center" justify="space-between">
        <Flex align="center" mr={5}>
          <Link to="/">
            <Heading>UCL Walks</Heading>
          </Link>
        </Flex>
        <Flex
          flex={{ sm: "1", md: "none" }}
          ml={5}
          align="center"
          justify="flex-end"
        >
          <Box>
            {props.appProps.isAuthenticated ? (
              <Link to="/">
                <Button onClick={handleLogout} variantColor="teal">
                  Logout
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variantColor="teal">Login</Button>
              </Link>
            )}
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}
