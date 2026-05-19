import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { FileInput } from "./FileInput";

describe("FileInput", () => {
  it("renders", () => {
    render(<FileInput aria-label="Upload file" />);
    expect(screen.getByLabelText("Upload file")).toBeInTheDocument();
  });

  describe("interactions", () => {
    it("accepts uploaded files", async () => {
      const user = userEvent.setup();
      render(<FileInput aria-label="Upload file" />);
      const input = screen.getByLabelText<HTMLInputElement>("Upload file");
      const file = new File(["hello"], "hello.txt", { type: "text/plain" });
      await user.upload(input, file);
      expect(input.files).toHaveLength(1);
      expect(input.files?.[0]?.name).toBe("hello.txt");
    });
  });
});
