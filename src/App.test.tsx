import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("Test that the Nav title is there", () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/OVPA Walk the World/i);
  expect(linkElement).toBeInTheDocument();
});
