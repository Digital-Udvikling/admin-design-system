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
