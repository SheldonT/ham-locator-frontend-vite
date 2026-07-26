/** @format */

import * as React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";

import InputBar from "../InputBar";

vi.mock("callsign", () => ({
  getAmateurRadioInfoByCallsign: vi.fn(() => ({})),
}));

describe("Input Bar", () => {
  test("Checking input", async () => {
    render(<InputBar />);

    const nameField = screen.queryByPlaceholderText("Name");

    expect(nameField).toBeInTheDocument();
  });
});
