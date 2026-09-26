import { render, screen } from "@testing-library/react";
import { useEffect, useState } from "react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
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

  it("renders a dismiss button that fires onDismiss once", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(
      <Alert variant="info" onDismiss={onDismiss}>
        Saved.
      </Alert>,
    );
    const button = screen.getByRole("button", { name: "Dismiss" });
    expect(button).toHaveAdminClass("alert-dismiss");

    await user.click(button);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("forwards classNames to slots", () => {
    render(
      <Alert
        variant="info"
        title="Heads up"
        description="Details here."
        classNames={{ title: "x-custom" }}
      />,
    );
    expect(screen.getByText("Heads up")).toHaveClass("x-custom");
  });

  it("keeps children with inline markup in one element beside an icon", () => {
    render(
      <Alert variant="info" icon={<svg data-testid="icon" aria-hidden />}>
        Deploy <code>v1.2.0</code> done
      </Alert>,
    );
    const alert = screen.getByRole("status");
    const text = screen.getByText("v1.2.0").parentElement;
    expect(text?.tagName).toBe("DIV");
    expect(text?.parentElement).toBe(alert);
    expect(text).toHaveTextContent("Deploy v1.2.0 done");
    expect(alert.children).toHaveLength(2);
  });

  it("leaves Alert.Action a direct child when grouping text", () => {
    render(
      <Alert variant="info" icon={<svg aria-hidden />}>
        Item <code>42</code> archived.
        <Alert.Action>
          <a href="/x" className="link">
            Undo
          </a>
        </Alert.Action>
      </Alert>,
    );
    const alert = screen.getByRole("status");
    const action = screen.getByText("Undo").parentElement;
    expect(action).toHaveAdminClass("alert-action");
    expect(action?.parentElement).toBe(alert);
    expect(screen.getByText("42").parentElement?.parentElement).toBe(alert);
  });

  it("keeps an icon passed as the first child in the icon column", () => {
    render(
      <Alert variant="success" onDismiss={() => {}}>
        <svg data-testid="icon" aria-hidden />
        Saved <code>draft</code>.
      </Alert>,
    );
    const alert = screen.getByRole("status");
    expect(alert.firstElementChild).toBe(screen.getByTestId("icon"));
    expect(screen.getByText("draft").parentElement?.parentElement).toBe(alert);
  });

  it("groups a leading component child with the text instead of treating it as an icon", () => {
    const When = () => <>2 minutes ago</>;
    render(
      <Alert variant="info" onDismiss={() => {}}>
        <When /> since last sync. <a href="#x">Details</a>
      </Alert>,
    );
    const alert = screen.getByRole("status");
    const text = screen.getByText("Details").parentElement;
    expect(text?.parentElement).toBe(alert);
    expect(text).toHaveTextContent("2 minutes ago since last sync. Details");
    expect(alert.children).toHaveLength(2);
  });

  it("keeps block children as direct children so the stacking gap applies", () => {
    render(
      <Alert variant="info" icon={<svg data-testid="icon" aria-hidden />}>
        <p>First</p>
        <p>Second</p>
      </Alert>,
    );
    const alert = screen.getByRole("status");
    expect(screen.getByText("First").parentElement).toBe(alert);
    expect(screen.getByText("Second").parentElement).toBe(alert);
  });

  it("finds parts inside a fragment", () => {
    render(
      <Alert variant="danger" icon={<svg aria-hidden />}>
        <>
          <Alert.Title>Form has errors</Alert.Title>
          <Alert.Description>Fix them.</Alert.Description>
        </>
      </Alert>,
    );
    const alert = screen.getByRole("alert");
    expect(screen.getByText("Form has errors").parentElement).toBe(alert);
    expect(screen.getByText("Fix them.").parentElement).toBe(alert);
  });

  it("keeps grouped children mounted when a part before them toggles", async () => {
    const user = userEvent.setup();
    const mounted = vi.fn();
    function Draft() {
      useEffect(mounted, []);
      return <input aria-label="Draft" />;
    }
    function Harness() {
      const [titled, setTitled] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setTitled((t) => !t)}>
            Toggle
          </button>
          <Alert variant="info" onDismiss={() => {}}>
            {titled && <Alert.Title>Title</Alert.Title>}
            Note <Draft />
          </Alert>
        </>
      );
    }
    render(<Harness />);
    await user.click(screen.getByRole("button", { name: "Toggle" }));
    expect(screen.getByText("Title")).toHaveAdminClass("alert-title");
    expect(mounted).toHaveBeenCalledTimes(1);
  });

  it("renders children alone without a wrapper", () => {
    render(<Alert variant="info">Heads up</Alert>);
    expect(screen.getByRole("status").children).toHaveLength(0);
  });

  it("renders the description as a div so block content nests", () => {
    render(
      <Alert
        variant="danger"
        title="Form has errors"
        description={
          <ul>
            <li>Name is required</li>
          </ul>
        }
      />,
    );
    const description = screen.getByRole("list").parentElement;
    expect(description?.tagName).toBe("DIV");
    expect(description).toHaveAdminClass("alert-description");
  });

  it("renders nothing for empty shorthand props", () => {
    render(<Alert variant="info" title={null} description="" action={false} />);
    expect(screen.getByRole("status").children).toHaveLength(0);
  });

  it("keeps the dismiss trailing alongside an icon, title, and action", () => {
    render(
      <Alert
        variant="warning"
        icon={<svg data-testid="icon" aria-hidden />}
        title="Storage almost full"
        action={
          <a href="/x" className="link">
            Manage
          </a>
        }
        onDismiss={() => {}}
        dismissLabel="Dismiss warning"
      />,
    );
    const alert = screen.getByRole("alert");
    expect(alert.firstElementChild).toBe(screen.getByTestId("icon"));
    expect(alert.lastElementChild).toHaveAdminClass("alert-dismiss");
    expect(screen.getByRole("button", { name: "Dismiss warning" })).toBeInTheDocument();
  });
});
