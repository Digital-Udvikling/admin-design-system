import { Input as BaseInput } from "@base-ui/react/input";
import { clsx } from "clsx";
import type { ComponentProps } from "react";

export type FileInputVariant = "bordered" | "ghost" | "danger";
export type FileInputSize = "sm" | "md" | "lg";

type BaseInputProps = Omit<ComponentProps<typeof BaseInput>, "size" | "type">;

export interface FileInputProps extends BaseInputProps {
  variant?: FileInputVariant;
  inputSize?: FileInputSize;
}

export function FileInput({
  variant = "bordered",
  inputSize = "md",
  className,
  ...rest
}: FileInputProps) {
  return (
    <BaseInput
      type="file"
      className={clsx(
        "file-input",
        `file-input-${variant}`,
        inputSize !== "md" && `file-input-${inputSize}`,
        typeof className === "string" ? className : undefined,
      )}
      {...rest}
    />
  );
}
