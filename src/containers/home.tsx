import React, { useState, useEffect, useCallback } from "react";
import { API } from "aws-amplify";
import { useFormik } from "formik";
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
  NumberInput,
  NumberInputField,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Spinner,
  Text,
  useToast
} from "@chakra-ui/core";
import { Link } from "../components/link";
import { AppProps } from "../types";

const validate = (values: { steps: number }) => {
  const errors: {
    steps?: string;
  } = {};
  if (!values.steps) {
    errors.steps = "Required";
  } else if (values.steps < 1) {
    errors.steps = "Steps must be a positive number";
  } else if (values.steps > 30000) {
    errors.steps = "Are you serious?! That's too many steps 😁";
  }
  return errors;
};

function AlertError({ message }: { message: string }) {
  return (
    <Alert mt="1rem" status="error">
      <AlertIcon />
      {message}
    </Alert>
  );
}

function AddSteps({
  appProps,
  locallyUpdateSteps
}: {
  appProps: AppProps;
  locallyUpdateSteps: (nextSteps: number) => void;
}) {
  const toast = useToast();
  const [errorMessage, setError] = useState("");
  const formik = useFormik({
    initialValues: {
      steps: 0
    },
    validate,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await API.post("steps", "/steps", {
          body: {
            steps: values.steps
          }
        });
        setSubmitting(false);

        setError("");
        toast({
          title: "Success!",
          description: "Your steps are added, see you tomorrow!",
          status: "success",
          duration: 9000,
          isClosable: true
        });
        locallyUpdateSteps(values.steps);
      } catch (e) {
        // Massive hack: I've hardcoded a 400 response to mean that you've already done your steps for the day.
        // It would be better for this message to come from API Gateway, but that's a faff
        if (e.message.includes("400")) {
          setError("You have already submitted your steps today.");
        } else {
          setError(e.message);
        }
      }
    }
  });

  const areStepsInvalid = Boolean(formik.errors.steps && formik.touched.steps);
  return (
    <form onSubmit={formik.handleSubmit}>
      <FormControl isInvalid={areStepsInvalid}>
        <FormLabel htmlFor="steps">Enter your steps</FormLabel>
        <NumberInput min={0} max={30000}>
          <NumberInputField
            id="steps"
            name="steps"
            type="number"
            placeholder="Steps"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.steps}
          />
        </NumberInput>
        <FormHelperText id="steps-helper-text">
          You can only enter your steps once a day.
        </FormHelperText>
        <FormErrorMessage>{formik.errors.steps}</FormErrorMessage>
        {errorMessage ? <AlertError message={errorMessage} /> : null}
      </FormControl>
      <Button
        mt={4}
        variantColor="teal"
        isLoading={formik.isSubmitting}
        type="submit"
      >
        Submit
      </Button>
    </form>
  );
}

async function getTotalSteps(
  setSteps: React.Dispatch<
    React.SetStateAction<{ steps: number; calculated_at: number }>
  >,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string>>
) {
  try {
    setIsLoading(true);
    const response = await API.get("steps", "/steps", {});
    setSteps({ steps: response.steps, calculated_at: response.calculated_at });
    setTimeout(() => setIsLoading(false), 1000);
  } catch (e) {
    setIsLoading(false);
    setError(e.message);
  }
}

export function Home(props: AppProps) {
  const [stepsData, setSteps] = useState({
    steps: 0,
    calculated_at: Date.now()
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorLoadingStepsMessage, setError] = useState("");

  const locallyUpdateSteps = useCallback(
    (nextSteps: number) => {
      setSteps({
        steps: stepsData.steps + nextSteps,
        calculated_at: Date.now()
      });
    },
    [stepsData.steps]
  );

  useEffect(() => {
    getTotalSteps(setSteps, setIsLoading, setError);
  }, []);
  return (
    <Flex align="center" justify="center">
      <Box width="500px" px="6">
        <Flex
          height="full"
          py="2rem"
          justify="space-between"
          direction="column"
        >
          <Box mb="2rem" height="100px">
            <Stat>
              {isLoading ? (
                <Spinner size="xl" />
              ) : errorLoadingStepsMessage ? (
                <AlertError message={errorLoadingStepsMessage} />
              ) : (
                <>
                  <StatLabel>Total steps</StatLabel>
                  <StatNumber fontSize="2rem">
                    {stepsData.steps.toLocaleString()}
                  </StatNumber>
                  <StatHelpText>
                    As of {new Date(stepsData.calculated_at).toLocaleString()}
                  </StatHelpText>
                </>
              )}
            </Stat>
          </Box>
          {!props.isAuthenticating && props.isAuthenticated ? (
            <AddSteps
              appProps={props}
              locallyUpdateSteps={locallyUpdateSteps}
            />
          ) : (
            <Text as="p">
              To add your steps you must have an account. If you already have an
              account, you can <Link to="/login" message="login here" />. Or you
              can <Link to="/signup" message="create an account here" />.
            </Text>
          )}
        </Flex>
      </Box>
    </Flex>
  );
}
