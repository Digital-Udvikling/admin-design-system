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
    expect(screen.getByText("Connection failed")).toHaveAdminClass("alert-title");
    expect(screen.getByText("Retrying in 30s.")).toHaveAdminClass("alert-description");
    const alert = screen.getByRole("alert");
    expect(alert.firstElementChild).toBe(screen.getByTestId("icon"));
  });

  it("uses status role for non-urgent variants", () => {
    render(<Alert variant="info">Heads up</Alert>);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders the action prop as a trailing wrapper", () => {
    render(
      <Alert
        variant="info"
        action={
          <a href="/x" className="link">
            Undo
          </a>
        }
      >
        Item archived.
      </Alert>,
    );
    const action = screen.getByText("Undo").closest("div");
    expect(action).toHaveAdminClass("alert-action");
    expect(screen.getByRole("status").lastElementChild).toBe(action);
  });

  it("composes Alert.Action with Title and Description", () => {
    render(
      <Alert variant="warning">
        <Alert.Title>Storage almost full</Alert.Title>
        <Alert.Description>Free up space soon.</Alert.Description>
        <Alert.Action>
          <a href="/x" className="link">
            Manage
          </a>
        </Alert.Action>
      </Alert>,
    );
    expect(screen.getByText("Manage").closest("div")).toHaveAdminClass("alert-action");
  });

  it("keeps icon first and action last across the full slot set", () => {
    render(
      <Alert
        variant="danger"
        icon={<svg data-testid="icon" aria-hidden />}
        title="Connection failed"
        description="Retrying in 30s."
        action={
          <a href="/x" className="link">
            Retry
          </a>
        }
      />,
    );
    const alert = screen.getByRole("alert");
    expect(alert.firstElementChild).toBe(screen.getByTestId("icon"));
    expect(alert.lastElementChild).toHaveAdminClass("alert-action");
  });
});
