/** @format */

import * as React from "react";
import { render, screen } from "@testing-library/react";

import ExtraInfo from "../ExtraInfo";

describe("Menu", () => {
  test("Show country based on call prefix", async () => {
    const info = {
      areacode: "CA",
      contactCall: "Canada",
      country: "Canada",
      prefix: "VO",
    };
    render(<ExtraInfo info={info} />);

    const findTimeZone = await screen.findByText("Canada");
    const checkForTimeZone = screen.queryByText("Time Zone");
    const checkForDistance = screen.queryByText("Distance");
    const checkForITU = screen.queryByText("ITU Zone");

    expect(findTimeZone).toBeInTheDocument();
    expect(checkForTimeZone).toBeNull();
    expect(checkForDistance).toBeNull();
    expect(checkForITU).toBeNull();
  });
});
