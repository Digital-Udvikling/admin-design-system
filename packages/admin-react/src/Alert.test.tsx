import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Alert } from "./Alert";

describe("Alert", () => {
  it("renders with title and description subparts", () => {
    render(
      <Alert variant="danger">
        <Alert.Title>Form has errors</Alert.Title>
        <Alert.Description>Please fix the issues below.</Alert.Description>
      </Alert>,
    );
    expect(screen.getByText("Form has errors")).toBeInTheDocument();
    expect(screen.getByText("Please fix the issues below.")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("renders title/description/icon props", () => {
    render(
      <Alert
        variant="danger"
        icon={<svg data-testid="icon" aria-hidden />}
        title="Connection failed"
        description="Retrying in 30s."
      />,
    );
    expect(screen.getByText("Connection failed")).toHaveClass("alert-title");
    expect(screen.getByText("Retrying in 30s.")).toHaveClass("alert-description");
    const alert = screen.getByRole("alert");
    expect(alert.firstElementChild).toBe(screen.getByTestId("icon"));
  });

  it("uses status role for non-urgent variants", () => {
    render(<Alert variant="info">Heads up</Alert>);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
