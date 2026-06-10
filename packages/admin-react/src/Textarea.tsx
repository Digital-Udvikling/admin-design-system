import { Field as BaseField } from "@base-ui/react/field";
import type { ComponentProps } from "react";
import { cn } from "./cn";

export type TextareaVariant = "bordered" | "ghost" | "danger" | "info" | "success" | "warning";
export type TextareaSize = "sm" | "md" | "lg";

export interface TextareaProps extends Omit<ComponentProps<"textarea">, "size"> {
  variant?: TextareaVariant;
  textareaSize?: TextareaSize;
  /**
   * Height tracks content via CSS `field-sizing` (Chromium-only; others keep a
   * fixed, resizable box). Floor: max(base min-height, `rows`); cap with `max-height`.
   */
  autoResize?: boolean;
}

/**
 * Multi-line input via Base UI `Field.Control` with a `<textarea>` swapped in,
 * so inside a `<Field>` it gets the same wiring as `<Input>` (generated id,
 * label association, validity). Works standalone via the default context.
 */
export function Textarea({
  variant = "bordered",
  textareaSize = "md",
  autoResize,
  className,
  ...rest
}: TextareaProps) {
  return (
    <BaseField.Control
      // Field.Control is typed for <input>; render a <textarea> with Base UI's
      // merged props so it still registers with the surrounding Field.
      render={(props) => <textarea {...props} />}
      className={cn(
        [
          "textarea",
          variant !== "bordered" && `textarea-${variant}`,
          textareaSize !== "md" && `textarea-${textareaSize}`,
          autoResize && "textarea-autosize",
        ],
        className,
      )}
      {...(rest as ComponentProps<typeof BaseField.Control>)}
    />
  );
}
