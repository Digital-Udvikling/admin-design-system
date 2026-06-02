import { Field as BaseField } from "@base-ui/react/field";
import type { ComponentProps } from "react";
import { cn } from "./cn";

export type TextareaVariant = "bordered" | "ghost" | "danger" | "info" | "success" | "warning";
export type TextareaSize = "sm" | "md" | "lg";

export interface TextareaProps extends Omit<ComponentProps<"textarea">, "size"> {
  variant?: TextareaVariant;
  textareaSize?: TextareaSize;
  /**
   * Height tracks content via CSS `field-sizing` (Chromium-only today; other
   * browsers keep a fixed, resizable box). The floor is the larger of the base
   * min-height and `rows` — set `max-height` via `className`/`style` for a
   * ceiling.
   */
  autoResize?: boolean;
}

/**
 * Multi-line text input. Rendered through Base UI's `Field.Control` with a
 * `<textarea>` swapped in for the default `<input>`, so inside a `<Field>` it
 * gets the same wiring as `<Input>`: a generated id, label `htmlFor`
 * association, and validity-driven `:user-valid` / `<Field.Error>`. Works
 * standalone too — `Field.Control` falls back to a default context.
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
      // Field.Control is typed for <input>; swap the rendered element for a
      // <textarea>, spreading Base UI's merged props (id, ref, value, handlers)
      // onto it so it registers with the surrounding Field.
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
