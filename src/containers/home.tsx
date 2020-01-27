import React, { useState, useEffect, useCallback } from "react";
import { API } from "aws-amplify";
import { useFormik } from "formik";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Link as ExternalLink,
  List,
  ListItem,
  ListIcon,
  Icon,
  IconProps,
  Image,
  NumberInput,
  NumberInputField,
  SimpleGrid,
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
import bearImage from "../bear.jpg";
import { AlertError } from "../components/alert-error";

const countryProgress = [
  { name: "Europe", isComplete: false, isCurrent: true },
  { name: "Africa", isComplete: false, isCurrent: false },
  { name: "Asia", isComplete: false, isCurrent: false },
  { name: "Australia", isComplete: false, isCurrent: false },
  { name: "Antarctica", isComplete: false, isCurrent: false },
  { name: "South America", isComplete: false, isCurrent: false },
  { name: "North America", isComplete: false, isCurrent: false },
  { name: "Russia", isComplete: false, isCurrent: false }
];

const validate = (values: { steps: number }) => {
  const errors: {
    steps?: string;
  } = {};
  if (!values.steps) {
    errors.steps = "Required";
  } else if (values.steps < 1) {
    errors.steps = "Steps must be a positive number";
  }
  return errors;
};

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
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await API.post("steps", "/steps", {
          body: {
            steps: values.steps
          }
        });
        setSubmitting(false);

        setError("");
        resetForm();
        toast({
          title: "Success!",
          description: "Your steps are added! 🎉",
          status: "success",
          duration: 9000,
          isClosable: true
        });
        locallyUpdateSteps(values.steps);
      } catch (e) {
        setError(e.message);
      }
    }
  });

  const areStepsInvalid = Boolean(formik.errors.steps && formik.touched.steps);
  return (
    <form onSubmit={formik.handleSubmit}>
      <FormControl isInvalid={areStepsInvalid}>
        <FormLabel htmlFor="steps">Enter your steps</FormLabel>
        <NumberInput min={0}>
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
    setIsLoading(false);
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

  const gridGap = "2rem";
  return (
    <Flex align="center" justify="center">
      <Box p="1rem" maxW="64rem" width="full">
        <Heading size="xl" mb="1rem" as="h1">
          Walk the World
        </Heading>
        <SimpleGrid columns={[1, 2]} spacing={gridGap}>
          <Image src={bearImage} width="500px" rounded="0.3rem" />
          <Box alignSelf="center">
            <Box height="100px">
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
                To add your steps you must have an account. If you already have
                an account, you can <Link to="/login" message="login here" />.
                Or you can{" "}
                <Link to="/signup" message="create an account here" />.
              </Text>
            )}
          </Box>
        </SimpleGrid>
        <Heading my="1rem" size="lg" as="h2">
          About
        </Heading>
        <SimpleGrid mt="1rem" columns={[1, 2]} spacing={gridGap}>
          <Text as="p">
            Walk the World is an innovative project that aims to educate us all
            on the cause and effect of climate change around the world through
            the medium of our roving representative – Jeremy Beartham. Jeremy
            will be reporting back from different areas of the globe on what he
            has seen and learnt about the problems caused by climate change and
            the innovative solutions and practical actions that are taking
            place.
          </Text>
          <Text as="p">
            It is hoped that this initiative will encourage us all to increase
            our physical wellbeing through exercise, to forego public transport
            and walk where we can instead, and to consider our own personal
            impact on the world and to rethink actions that might
            collaboratively contribute to climate change.
            <ExternalLink
              href="https://www.instagram.com/jeremybeartham/"
              isExternal
              color="teal.500"
            >
              {" "}
              Instagram <Icon name="external-link" mx="2px" />
            </ExternalLink>
          </Text>
        </SimpleGrid>
        <Heading size="lg" my="1rem" as="h2">
          {" "}
          Progress
        </Heading>
        <List spacing={3}>
          {countryProgress.map(country => {
            const { icon, color } = getCountryProgressIconProps(country);
            return (
              <ListItem key={country.name}>
                <ListIcon icon={icon} color={color} />
                {country.name}
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Flex>
  );
}

function getCountryProgressIconProps(country: {
  name: string;
  isCurrent: boolean;
  isComplete: boolean;
}): { icon: IconProps["name"]; color: string } {
  if (country.isComplete) {
    return {
      icon: "check",
      color: "green.500"
    };
  }

  if (country.isCurrent) {
    return {
      icon: "arrow-forward",
      color: "teal.500"
    };
  }

  return {
    icon: "chevron-right",
    color: "gray.500"
  };
}
