import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Alert } from "./Alert";

describe("Alert", () => {
  it("renders with title and description", () => {
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

  it("uses status role for non-urgent variants", () => {
    render(<Alert variant="info">Heads up</Alert>);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
