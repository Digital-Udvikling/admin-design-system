import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Accordion } from "./Accordion";

describe("Accordion", () => {
  it("renders with summary and content", () => {
    render(
      <Accordion>
        <Accordion.Item>
          <Accordion.Summary>Settings</Accordion.Summary>
          <Accordion.Content>Theme, language, accessibility.</Accordion.Content>
        </Accordion.Item>
      </Accordion>,
    );
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Theme, language, accessibility.")).toBeInTheDocument();
  });

  it("renders a summary icon before the label", () => {
    function IconLead(props: {
      size?: number | string;
      "aria-hidden"?: boolean | "true" | "false";
    }) {
      return <svg data-testid="lead" {...props} />;
    }
    render(
      <Accordion>
        <Accordion.Item>
          <Accordion.Summary icon={IconLead}>Account</Accordion.Summary>
          <Accordion.Content>Name, email, password.</Accordion.Content>
        </Accordion.Item>
      </Accordion>,
    );
    const icon = screen.getByTestId("lead");
    expect(screen.getByText("Account").firstElementChild).toBe(icon);
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });

  describe("interactions", () => {
    it("toggles open when summary is clicked", async () => {
      const user = userEvent.setup();
      render(
        <Accordion>
          <Accordion.Item>
            <Accordion.Summary>Toggle</Accordion.Summary>
            <Accordion.Content>Inner</Accordion.Content>
          </Accordion.Item>
        </Accordion>,
      );
      const summary = screen.getByText("Toggle");
      const details = summary.closest("details");
      expect(details).not.toHaveAttribute("open");
      await user.click(summary);
      expect(details).toHaveAttribute("open");
      await user.click(summary);
      expect(details).not.toHaveAttribute("open");
    });
  });
});
