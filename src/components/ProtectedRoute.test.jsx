import { act, render, screen } from "@testing-library/react";
import ProtectedRoute from "./ProtectedRoute";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("ProtectedRoute component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("renders children when condition is true", () => {
    render(
      <ProtectedRoute condition={true}>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("renders toast and redirects when condition is false", () => {
    render(
      <ProtectedRoute
        condition={false}
        redirectTo="/login"
        message="Please log in first"
      >
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    expect(screen.getByText("Please log in first")).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(mockNavigate).toHaveBeenCalledWith("/login", { replace: true });
  });

  test("uses default message and default redirect path when omitted", () => {
    render(
      <ProtectedRoute condition={false}>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText("Access not allowed. Redirecting…")).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
  });
});
