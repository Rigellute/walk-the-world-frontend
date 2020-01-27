import React from "react";
import { Auth } from "aws-amplify";
import { useFormik } from "formik";
import { RouteComponentProps } from "react-router-dom";
import {
  Flex,
  Button,
  Box,
  Heading,
  FormHelperText,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input
} from "@chakra-ui/core";
import { AppProps } from "../types";
import { Link } from "../components/link";
import { AlertError } from "../components/alert-error";

const validate = (values: { email: string; password: string }) => {
  const errors: { email?: string; password?: string } = {};
  if (!values.email) {
    errors.email = "Required";
  }

  if (!values.password) {
    errors.password = "Required";
  } else if (values.password.length < 8) {
    errors.password = "Password must be 8 characters or more";
  }

  return errors;
};

export function LoginForm(props: AppProps & RouteComponentProps) {
  const [errorMessage, setError] = React.useState("");
  const formik = useFormik({
    initialValues: {
      email: "",
      password: ""
    },
    validate,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await Auth.signIn(values.email, values.password);
        setSubmitting(false);
        props.userHasAuthenticated(true);
        props.history.push("/");
      } catch (e) {
        setError(e.message);
      }
    }
  });

  const isEmailValid = formik.errors.email && formik.touched.email;
  const isPasswordValid = formik.errors.password && formik.touched.password;

  return (
    <Flex height="90vh" align="center" justify="center">
      <Box width="500px" px="6">
        <Heading pb="6">Login</Heading>
        <FormHelperText>
          Don't have an account? <Link to="/signup" message="Sign up here." />
        </FormHelperText>
        <form onSubmit={formik.handleSubmit}>
          <FormControl isInvalid={Boolean(isEmailValid && isPasswordValid)}>
            <FormLabel htmlFor="email">Email Address</FormLabel>
            <Input
              id="email"
              name="email"
              type="email"
              autoFocus
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
            <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
            {errorMessage ? <AlertError message={errorMessage} /> : null}
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
