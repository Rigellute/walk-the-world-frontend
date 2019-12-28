import React from "react";
import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Flex,
  Box
} from "@chakra-ui/core";

export function Home() {
  return (
    <Flex mt="5rem" align="center" justify="center">
      <Box>
        <Stat>
          <StatLabel>Total steps</StatLabel>
          <StatNumber fontSize="5rem">{(254343).toLocaleString()}</StatNumber>
          <StatHelpText>As of {new Date().toLocaleString()}</StatHelpText>
        </Stat>
      </Box>
    </Flex>
  );
}
