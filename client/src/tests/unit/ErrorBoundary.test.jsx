import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";

// Mock console.error to avoid noise in test output
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (typeof args[0] === "string" && args[0].includes("Warning:")) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Component that throws an error
const ErrorComponent = () => {
  throw new Error("Test error");
};

// Component that doesn't throw
const NormalComponent = () => <div>Normal component</div>;

describe("ErrorBoundary", () => {
  test("renders children when no error occurs", () => {
    render(
      <ErrorBoundary>
        <NormalComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText("Normal component")).toBeInTheDocument();
  });

  test("renders error UI when error occurs", () => {
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText("Oops! Something went wrong")).toBeInTheDocument();
    expect(
      screen.getByText(
        "We're sorry, but something unexpected happened. Please try refreshing the page."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /refresh page/i })
    ).toBeInTheDocument();
  });

  test("refresh button calls window.location.reload", () => {
    // Mock window.location.reload
    const reloadMock = jest.fn();
    delete window.location;
    window.location = { reload: reloadMock };

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    const refreshButton = screen.getByRole("button", { name: /refresh page/i });
    fireEvent.click(refreshButton);

    expect(reloadMock).toHaveBeenCalledTimes(1);

    // Restore window.location
    delete window.location;
  });

  test("shows error details in development mode", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(
      screen.getByText("Error Details (Development Only)")
    ).toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });

  test("does not show error details in production mode", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(
      screen.queryByText("Error Details (Development Only)")
    ).not.toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });

  test("calls componentDidCatch when error occurs", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(spy).toHaveBeenCalled();

    spy.mockRestore();
  });
});
