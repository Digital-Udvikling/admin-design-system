import { Field as BaseField } from "@base-ui/react/field";
import type { ComponentProps } from "react";
import { cn } from "./cn";

export type TextareaVariant = "bordered" | "ghost" | "danger" | "info" | "success" | "warning";
export type TextareaSize = "sm" | "md" | "lg";

export interface TextareaProps extends Omit<ComponentProps<"textarea">, "size"> {
  variant?: TextareaVariant;
  /** Default `"md"`. */
  size?: TextareaSize;
  /**
   * Height tracks content via CSS `field-sizing`; browsers without it keep a fixed, resizable
   * box. Floor: max(base min-height, `rows`); cap with `max-height`.
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
  size = "md",
  autoResize,
  className,
  ...rest
}: TextareaProps) {
  return (
    <BaseField.Control
      // Field.Control is typed for <input>; Base UI merges its props into this
      // <textarea> so it still registers with the surrounding Field. The element
      // form (not a function) keeps Textarea usable from Server Components.
      // eslint-disable-next-line jsx-a11y/control-has-associated-label -- labelled via the merged Field props
      render={<textarea />}
      className={cn(
        [
          "textarea",
          variant !== "bordered" && `textarea-${variant}`,
          size !== "md" && `textarea-${size}`,
          autoResize && "textarea-autosize",
        ],
        className,
      )}
      {...(rest as ComponentProps<typeof BaseField.Control>)}
    />
  );
}
