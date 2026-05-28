import { Input as BaseInput } from "@base-ui/react/input";
import type { ComponentProps } from "react";
import { cn } from "./cn";

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
      className={cn(
        [
          "file-input",
          variant !== "bordered" && `file-input-${variant}`,
          inputSize !== "md" && `file-input-${inputSize}`,
        ],
        className,
      )}
      {...rest}
    />
  );
}
