import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { FileInput } from "./FileInput";

describe("FileInput", () => {
  it("renders", () => {
    render(<FileInput aria-label="Upload file" />);
    expect(screen.getByLabelText("Upload file")).toBeInTheDocument();
  });

  it("applies the size modifier from size, falling back to the inputSize alias", () => {
    render(
      <>
        <FileInput aria-label="sm" size="sm" />
        <FileInput aria-label="lg" inputSize="lg" />
        <FileInput aria-label="both" size="sm" inputSize="lg" />
      </>,
    );
    expect(screen.getByLabelText("sm")).toHaveAdminClass("file-input-sm");
    expect(screen.getByLabelText("lg")).toHaveAdminClass("file-input-lg");
    expect(screen.getByLabelText("both")).toHaveAdminClass("file-input-sm");
    expect(screen.getByLabelText("both")).not.toHaveAdminClass("file-input-lg");
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
