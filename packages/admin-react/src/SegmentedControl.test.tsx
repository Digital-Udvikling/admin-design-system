import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { SegmentedControl } from "./SegmentedControl";

describe("SegmentedControl", () => {
  it("renders single-select with legend and radio inputs", () => {
    render(
      <SegmentedControl type="single" label="Feedback" name="fb" defaultValue="all">
        <SegmentedControl.Item value="all">All</SegmentedControl.Item>
        <SegmentedControl.Item value="pos">Positive</SegmentedControl.Item>
      </SegmentedControl>,
    );
    // Legend is the group's accessible name
    expect(screen.getByRole("group", { name: "Feedback" })).toBeInTheDocument();
    const all = screen.getByRole("radio", { name: "All" });
    const pos = screen.getByRole("radio", { name: "Positive" });
    expect(all).toBeChecked();
    expect(pos).not.toBeChecked();
  });

  it("renders multi-select with checkbox inputs", () => {
    render(
      <SegmentedControl type="multiple" label="Features" name="features" defaultValue={["auth"]}>
        <SegmentedControl.Item value="auth">Auth</SegmentedControl.Item>
        <SegmentedControl.Item value="oauth">OAuth</SegmentedControl.Item>
      </SegmentedControl>,
    );
    expect(screen.getByRole("checkbox", { name: "Auth" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "OAuth" })).not.toBeChecked();
  });

  it("applies _ao- prefixed classes and size + fullWidth modifiers", () => {
    const { container } = render(
      <SegmentedControl type="single" label="X" name="x" size="sm" fullWidth>
        <SegmentedControl.Item value="a">A</SegmentedControl.Item>
      </SegmentedControl>,
    );
    const fieldset = container.querySelector("fieldset");
    expect(fieldset).toHaveClass("_ao-segmented-control");
    expect(fieldset).toHaveClass("_ao-segmented-control-sm");
    expect(fieldset).toHaveClass("_ao-segmented-control-full-width");
    expect(container.querySelector(".\\_ao-segmented-control-track")).toBeInTheDocument();
    expect(container.querySelector(".\\_ao-segmented-control-item")).toBeInTheDocument();
  });

  it("disables every input when the group is disabled", () => {
    render(
      <SegmentedControl type="single" label="X" name="x" disabled>
        <SegmentedControl.Item value="a">A</SegmentedControl.Item>
        <SegmentedControl.Item value="b">B</SegmentedControl.Item>
      </SegmentedControl>,
    );
    expect(screen.getByRole("radio", { name: "A" })).toBeDisabled();
    expect(screen.getByRole("radio", { name: "B" })).toBeDisabled();
  });

  it("disables only the per-item input when item.disabled is set", () => {
    render(
      <SegmentedControl type="single" label="X" name="x">
        <SegmentedControl.Item value="a">A</SegmentedControl.Item>
        <SegmentedControl.Item value="b" disabled>
          B
        </SegmentedControl.Item>
      </SegmentedControl>,
    );
    expect(screen.getByRole("radio", { name: "A" })).not.toBeDisabled();
    expect(screen.getByRole("radio", { name: "B" })).toBeDisabled();
  });

  it("forwards aria-label to the input for icon-only items", () => {
    render(
      <SegmentedControl type="single" label="Align" name="align">
        <SegmentedControl.Item value="left" aria-label="Align left" />
        <SegmentedControl.Item value="center" aria-label="Align center" />
      </SegmentedControl>,
    );
    expect(screen.getByRole("radio", { name: "Align left" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Align center" })).toBeInTheDocument();
  });

  describe("single — interactions", () => {
    it("uncontrolled: clicking a segment selects it and fires onValueChange", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <SegmentedControl
          type="single"
          label="Feedback"
          name="fb"
          defaultValue="all"
          onValueChange={onValueChange}
        >
          <SegmentedControl.Item value="all">All</SegmentedControl.Item>
          <SegmentedControl.Item value="pos">Positive</SegmentedControl.Item>
        </SegmentedControl>,
      );
      const all = screen.getByRole("radio", { name: "All" });
      const pos = screen.getByRole("radio", { name: "Positive" });
      await user.click(pos);
      expect(all).not.toBeChecked();
      expect(pos).toBeChecked();
      expect(onValueChange).toHaveBeenLastCalledWith("pos");
    });

    it("controlled: value prop drives selection via onValueChange round-trip", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      function Controlled() {
        const [value, setValue] = useState<string>("all");
        return (
          <SegmentedControl
            type="single"
            label="Feedback"
            name="fb"
            value={value}
            onValueChange={(next) => {
              onValueChange(next);
              setValue(next);
            }}
          >
            <SegmentedControl.Item value="all">All</SegmentedControl.Item>
            <SegmentedControl.Item value="pos">Positive</SegmentedControl.Item>
          </SegmentedControl>
        );
      }

      render(<Controlled />);
      const pos = screen.getByRole("radio", { name: "Positive" });
      await user.click(pos);
      expect(pos).toBeChecked();
      expect(onValueChange).toHaveBeenCalledWith("pos");
    });

    it("controlled: stays put when parent ignores onValueChange", async () => {
      const user = userEvent.setup();
      render(
        <SegmentedControl
          type="single"
          label="Feedback"
          name="fb"
          value="all"
          onValueChange={() => {}}
        >
          <SegmentedControl.Item value="all">All</SegmentedControl.Item>
          <SegmentedControl.Item value="pos">Positive</SegmentedControl.Item>
        </SegmentedControl>,
      );
      const all = screen.getByRole("radio", { name: "All" });
      const pos = screen.getByRole("radio", { name: "Positive" });
      await user.click(pos);
      expect(all).toBeChecked();
      expect(pos).not.toBeChecked();
    });
  });

  describe("multiple — interactions", () => {
    it("uncontrolled: toggles values and fires onValueChange with the updated array", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <SegmentedControl
          type="multiple"
          label="Features"
          name="features"
          defaultValue={["auth"]}
          onValueChange={onValueChange}
        >
          <SegmentedControl.Item value="auth">Auth</SegmentedControl.Item>
          <SegmentedControl.Item value="oauth">OAuth</SegmentedControl.Item>
        </SegmentedControl>,
      );
      const auth = screen.getByRole("checkbox", { name: "Auth" });
      const oauth = screen.getByRole("checkbox", { name: "OAuth" });
      await user.click(oauth);
      expect(auth).toBeChecked();
      expect(oauth).toBeChecked();
      expect(onValueChange).toHaveBeenLastCalledWith(["auth", "oauth"]);
      await user.click(auth);
      expect(auth).not.toBeChecked();
      expect(oauth).toBeChecked();
      expect(onValueChange).toHaveBeenLastCalledWith(["oauth"]);
    });

    it("controlled: value prop drives selection", async () => {
      const user = userEvent.setup();

      function Controlled() {
        const [value, setValue] = useState<string[]>([]);
        return (
          <SegmentedControl
            type="multiple"
            label="Features"
            name="features"
            value={value}
            onValueChange={setValue}
          >
            <SegmentedControl.Item value="auth">Auth</SegmentedControl.Item>
            <SegmentedControl.Item value="oauth">OAuth</SegmentedControl.Item>
          </SegmentedControl>
        );
      }

      render(<Controlled />);
      const auth = screen.getByRole("checkbox", { name: "Auth" });
      const oauth = screen.getByRole("checkbox", { name: "OAuth" });
      await user.click(auth);
      await user.click(oauth);
      expect(auth).toBeChecked();
      expect(oauth).toBeChecked();
      await user.click(auth);
      expect(auth).not.toBeChecked();
      expect(oauth).toBeChecked();
    });

    it("controlled: stays put when parent ignores onValueChange", async () => {
      const user = userEvent.setup();
      render(
        <SegmentedControl
          type="multiple"
          label="Features"
          name="features"
          value={["auth"]}
          onValueChange={() => {}}
        >
          <SegmentedControl.Item value="auth">Auth</SegmentedControl.Item>
          <SegmentedControl.Item value="oauth">OAuth</SegmentedControl.Item>
        </SegmentedControl>,
      );
      const auth = screen.getByRole("checkbox", { name: "Auth" });
      const oauth = screen.getByRole("checkbox", { name: "OAuth" });
      await user.click(oauth);
      expect(auth).toBeChecked();
      expect(oauth).not.toBeChecked();
    });
  });
});
