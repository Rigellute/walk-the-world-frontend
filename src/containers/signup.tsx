import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { useFormik } from "formik";
import { RouteComponentProps } from "react-router-dom";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  useToast
} from "@chakra-ui/core";
import { AppProps } from "../types";

const validate = (
  values: {
    email: string;
    password: string;
    confirmPassword: string;
    confirmationCode: string;
  },
  isConfirmationStep: boolean
) => {
  const errors: {
    email?: string;
    password?: string;
    confirmPassword?: string;
    confirmationCode?: string;
  } = {};
  if (isConfirmationStep && !values.confirmationCode) {
    errors.confirmationCode = "You must enter the confirmation code";
  }
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
  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Please confirm your password is correct";
  }
  return errors;
};

function AuthError({ message }: { message: string }) {
  return (
    <Alert mt="1rem" status="error">
      <AlertIcon />
      {message}
    </Alert>
  );
}

export function SignupForm(props: AppProps & RouteComponentProps) {
  const [isConfirmationStep, setIsConfirmationStep] = useState(false);
  const [authErrorMessage, setAuthError] = useState("");
  const toast = useToast();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      confirmationCode: ""
    },
    validate: values => validate(values, isConfirmationStep),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (isConfirmationStep) {
          await Auth.confirmSignUp(values.email, values.confirmationCode);
          await Auth.signIn(values.email, values.password);
          setSubmitting(false);

          props.userHasAuthenticated(true);
          toast({
            title: "Account created.",
            description:
              "We've created your account. You can now add your steps!",
            status: "success",
            duration: 9000,
            isClosable: true
          });
          props.history.push("/");
        } else {
          await Auth.signUp({
            username: values.email,
            password: values.password
          });
          setAuthError("");
          setIsConfirmationStep(true);
          setSubmitting(false);
        }
      } catch (e) {
        setAuthError(e.message);
      }
    }
  });

  const isEmailInvalid = formik.errors.email && formik.touched.email;
  const isPasswordInvalid = formik.errors.password && formik.touched.password;
  const isConfirmPasswordInvalid =
    formik.errors.confirmPassword && formik.touched.confirmPassword;
  const isConfirmationCodeInvalid =
    formik.errors.confirmationCode && formik.touched.confirmationCode;

  return (
    <Flex height="90vh" align="center" justify="center">
      <Box width="500px" px="6">
        <Heading pb="6">Sign up</Heading>
        <form onSubmit={formik.handleSubmit}>
          {isConfirmationStep ? (
            <FormControl isInvalid={Boolean(isConfirmationCodeInvalid)}>
              <FormLabel htmlFor="confirmationCode">
                Confirmation code
              </FormLabel>
              <Input
                id="confirmationCode"
                name="confirmationCode"
                type="text"
                autoFocus
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmationCode}
              />
              <FormHelperText id="confirmationCode-helper-text">
                Check your email for the code
              </FormHelperText>
              <FormErrorMessage>
                {formik.errors.confirmationCode}
              </FormErrorMessage>
            </FormControl>
          ) : (
            <>
              <FormControl isInvalid={Boolean(isEmailInvalid)}>
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
              </FormControl>
              <FormControl isInvalid={Boolean(isPasswordInvalid)}>
                <FormLabel htmlFor="password">Password</FormLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
                <FormHelperText id="password-helper-text">
                  Must be 8 characters or more and contain uppercase letters,
                  lowercase letters and numbers.
                </FormHelperText>
                <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={Boolean(isConfirmPasswordInvalid)}>
                <FormLabel htmlFor="confirmPassword">
                  Confirm Password
                </FormLabel>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confirmPassword}
                />
                <FormErrorMessage>
                  {formik.errors.confirmPassword}
                </FormErrorMessage>
              </FormControl>
            </>
          )}
          {authErrorMessage ? <AuthError message={authErrorMessage} /> : null}
          <Button
            mt={4}
            variantColor="teal"
            isLoading={formik.isSubmitting}
            type="submit"
          >
            Submit
          </Button>
        </form>
      </Box>
    </Flex>
  );
}
