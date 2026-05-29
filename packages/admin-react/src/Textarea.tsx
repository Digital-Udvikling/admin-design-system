import { Field as BaseField } from "@base-ui/react/field";
import type { ComponentProps } from "react";
import { cn } from "./cn";

export type TextareaVariant = "bordered" | "ghost" | "danger";
export type TextareaSize = "sm" | "md" | "lg";

export interface TextareaProps extends Omit<ComponentProps<"textarea">, "size"> {
  variant?: TextareaVariant;
  textareaSize?: TextareaSize;
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
        ],
        className,
      )}
      {...(rest as ComponentProps<typeof BaseField.Control>)}
    />
  );
}
