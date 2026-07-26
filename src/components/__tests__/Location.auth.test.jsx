/** @format */

import * as React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";

import Location from "../Location";
import { UserContext } from "../../contexts/UserContext";
import { SettingsContext } from "../../contexts/SettingsContext";
import { LogContext } from "../../contexts/LogContext";
import serverInstance from "../../api/client";

const EMPTY_CALLDATA = {};
const VALID_CALLDATA = { anchor: [1, 2], country: "USA", itu: "8", utc: "0" };

vi.mock("../InfoBar", () => ({ default: (props) => (
  <div data-testid="info-length">{props.info?.length || 0}</div>
)}));

vi.mock("../CallMap", () => ({ default: () => <div data-testid="map" /> }));

vi.mock("../SaveLog", () => ({ default: () => null }));

vi.mock("../ClearTable", () => ({ default: () => null }));

vi.mock("../InputBar", () => ({ default: (props) => (
  <button
    data-testid="add-contact"
    onClick={() =>
      props.setInfo({
        contactCall: "K1ABC",
        freq: "14.1",
        sigRepSent: "59",
        sigRepRecv: "59",
        serialSent: "",
        serialRecv: "",
        utc: "",
      })
    }
  >
    Add
  </button>
)}));

vi.mock("../../hooks/useCallData", () => ({
  __esModule: true,
  default: vi.fn((call) =>
    call
      ? VALID_CALLDATA
      : EMPTY_CALLDATA
  ),
}));

vi.mock("../../api/client", () => ({
  __esModule: true,
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

function TestHarness({ removeAuthenticated }) {
  const [log, setLog] = React.useState([]);

  return (
    <UserContext.Provider
      value={{
        isAuthenticated: "123",
        authUserHome: {},
        removeAuthenticated,
      }}
    >
      <SettingsContext.Provider value={{ optionalFields: {}, lines: false }}>
        <LogContext.Provider value={{ log, setLog }}>
          <Location />
        </LogContext.Provider>
      </SettingsContext.Provider>
    </UserContext.Provider>
  );
}

describe("Location auth expiry behavior", () => {
  let logSpy;

  beforeEach(() => {
    vi.clearAllMocks();
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  test("does not keep optimistic entry when addrecord returns 401", async () => {
    const removeAuthenticated = vi.fn();

    serverInstance.get.mockResolvedValue({ data: { data: { records: [] } } });
    serverInstance.post.mockRejectedValue({ response: { status: 401 } });

    render(<TestHarness removeAuthenticated={removeAuthenticated} />);

    fireEvent.click(screen.getByTestId("add-contact"));

    await waitFor(() => {
      expect(removeAuthenticated).toHaveBeenCalled();
    });

    const infoBars = screen.getAllByTestId("info-length");
    expect(infoBars[0]).toHaveTextContent("0");
  });
});
