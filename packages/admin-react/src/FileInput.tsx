import { Input as BaseInput } from "@base-ui/react/input";
import type { ComponentProps } from "react";
import { cn } from "./cn";

export type FileInputVariant = "bordered" | "ghost" | "danger";
export type FileInputSize = "sm" | "md" | "lg";

type BaseInputProps = Omit<ComponentProps<typeof BaseInput>, "size" | "type">;

export interface FileInputProps extends BaseInputProps {
  variant?: FileInputVariant;
  size?: FileInputSize;
  /** @deprecated Use `size`; `size` wins when both are set. */
  inputSize?: FileInputSize;
}

export function FileInput({
  variant = "bordered",
  size,
  inputSize,
  className,
  ...rest
}: FileInputProps) {
  const resolvedSize = size ?? inputSize ?? "md";
  return (
    <BaseInput
      type="file"
      className={cn(
        [
          "file-input",
          variant !== "bordered" && `file-input-${variant}`,
          resolvedSize !== "md" && `file-input-${resolvedSize}`,
        ],
        className,
      )}
      {...rest}
    />
  );
}
