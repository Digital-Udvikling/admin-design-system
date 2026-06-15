import { NumberField } from "@base-ui/react/number-field";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "./cn";

export type NumberInputSize = "sm" | "md" | "lg";

function MinusIcon() {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export interface NumberInputProps extends ComponentProps<typeof NumberField.Root> {
  size?: NumberInputSize;
  /** Input placeholder. */
  placeholder?: string;
  /** aria-label for the field when there's no associated `<label>`. */
  inputAriaLabel?: string;
  /** aria-label for the decrement button. Default `"Decrease"`. */
  decrementLabel?: string;
  /** aria-label for the increment button. Default `"Increase"`. */
  incrementLabel?: string;
  /** Override the decrement button content. */
  decrementIcon?: ReactNode;
  /** Override the increment button content. */
  incrementIcon?: ReactNode;
}

/**
 * Numeric field with stepper buttons over Base UI NumberField (clamp-on-blur,
 * step, `Intl` formatting via `format`). The vanilla bundle styles a native
 * `<input type="number">` and steps with `stepUp()` / `stepDown()`.
 */
export function NumberInput({
  size = "md",
  placeholder,
  inputAriaLabel,
  decrementLabel = "Decrease",
  incrementLabel = "Increase",
  decrementIcon,
  incrementIcon,
  className,
  ...rootProps
}: NumberInputProps) {
  return (
    <NumberField.Root className={cn("number-input-root", className)} {...rootProps}>
      <NumberField.Group
        className={cn(["number-input", size !== "md" && `number-input-${size}`], undefined)}
      >
        <NumberField.Decrement
          className={cn("number-input-step", undefined)}
          aria-label={decrementLabel}
        >
          {decrementIcon ?? <MinusIcon />}
        </NumberField.Decrement>
        <NumberField.Input
          className={cn("number-input-field", undefined)}
          placeholder={placeholder}
          aria-label={inputAriaLabel}
        />
        <NumberField.Increment
          className={cn("number-input-step", undefined)}
          aria-label={incrementLabel}
        >
          {incrementIcon ?? <PlusIcon />}
        </NumberField.Increment>
      </NumberField.Group>
    </NumberField.Root>
  );
}
