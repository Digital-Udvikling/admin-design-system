import type { ComponentProps } from "react";
import { cn } from "./cn";

export type TextareaVariant = "bordered" | "ghost" | "danger";
export type TextareaSize = "sm" | "md" | "lg";

export interface TextareaProps extends Omit<ComponentProps<"textarea">, "size"> {
  variant?: TextareaVariant;
  textareaSize?: TextareaSize;
}

export function Textarea({
  variant = "bordered",
  textareaSize = "md",
  className,
  ...rest
}: TextareaProps) {
  return (
    <textarea
      className={cn(
        ["textarea", `textarea-${variant}`, textareaSize !== "md" && `textarea-${textareaSize}`],
        className,
      )}
      {...rest}
    />
  );
}
