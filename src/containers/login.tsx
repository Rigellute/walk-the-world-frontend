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

export function LoginForm(
  props: {
    userHasAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  } & RouteComponentProps
) {
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
        alert(e.message);
      }
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
