import Amplify from "aws-amplify";
import React from "react";
import { useFormik } from "formik";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import {
  Alert,
  AlertIcon,
  AlertDescription,
  AlertTitle,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  CSSReset,
  Flex,
  Button,
  ColorModeProvider,
  Box,
  Heading,
  FormHelperText,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  ThemeProvider
} from "@chakra-ui/core";
import config from "./config";

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

const validate = (values: { email: string; password: string }) => {
  const errors: { email?: string; password?: string } = {};
  if (!values.email) {
    errors.email = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }
  if (!values.password) {
    errors.password = "Required";
  } else if (values.password.length < 8) {
    errors.password = "Password must be 8 characters or more";
  }
  return errors;
};

function Nav() {
  return (
    <Box left="0" right="0" borderBottomWidth="1px" width="full" height="4rem">
      <Flex size="100%" px="6" align="center">
        <Link to="/">
          <Heading>UCL Walks</Heading>
        </Link>
      </Flex>
    </Box>
  );
}

function NotFound() {
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

function LoginForm() {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: ""
    },
    validate,
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2));
        setSubmitting(false);
      }, 400);
    }
  });

  const isEmailValid = formik.errors.email && formik.touched.email;
  const isPasswordValid = formik.errors.password && formik.touched.password;

  return (
    <Flex height="90vh" align="center" justify="center">
      <Box>
        <Heading>Login</Heading>
        <form onSubmit={formik.handleSubmit}>
          <FormControl isInvalid={Boolean(isEmailValid && isPasswordValid)}>
            <FormLabel htmlFor="email">Email Address</FormLabel>
            <Input
              id="email"
              name="email"
              type="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            <FormHelperText id="email-helper-text">
              We'll never share your email.
            </FormHelperText>
            <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              id="password"
              name="password"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {isPasswordValid ? (
              <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
            ) : null}
            <Button
              mt={4}
              variantColor="teal"
              isLoading={formik.isSubmitting}
              type="submit"
            >
              Submit
            </Button>
          </FormControl>
        </form>
      </Box>
    </Flex>
  );
}

function Home() {
  return (
    <Stat>
      <StatLabel>Total steps</StatLabel>
      <StatNumber>254343</StatNumber>
      <StatHelpText>Feb 12 - Feb 28</StatHelpText>
    </Stat>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ColorModeProvider value="dark">
        <CSSReset />
        <Router>
          <Nav />
          <Switch>
            <Route path="/login">
              <LoginForm />
            </Route>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </Router>
      </ColorModeProvider>
    </ThemeProvider>
  );
}

export default App;
