import { NumberField } from "@base-ui/react/number-field";
import type { ComponentProps, ReactNode } from "react";
import { cn, type SlotClasses } from "./cn";

export type NumberInputVariant = "bordered" | "danger";
export type NumberInputSize = "sm" | "md" | "lg";

function joinClasses(...parts: Array<string | undefined>): string | undefined {
  return parts.filter(Boolean).join(" ") || undefined;
}

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
  variant?: NumberInputVariant;
  size?: NumberInputSize;
  /**
   * Per-slot class overrides. `className`, `style` and `group` target the visible
   * `.number-input` group, as does `ref`; `root` targets Base UI's `display: contents` Root.
   */
  classNames?: SlotClasses<"root" | "group" | "decrement" | "input" | "increment">;
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
  variant = "bordered",
  size = "md",
  classNames,
  placeholder,
  inputAriaLabel,
  decrementLabel = "Decrease",
  incrementLabel = "Increase",
  decrementIcon,
  incrementIcon,
  className,
  style,
  ref,
  ...rootProps
}: NumberInputProps) {
  const group = classNames?.group;
  // Group state extends Root state, so a Root className function applies unchanged.
  const groupClassName =
    typeof className === "function"
      ? (state: NumberField.Group.State) => joinClasses(className(state), group)
      : joinClasses(className, group);

  return (
    <NumberField.Root className={cn("number-input-root", classNames?.root)} {...rootProps}>
      <NumberField.Group
        className={cn(
          [
            "number-input",
            variant !== "bordered" && `number-input-${variant}`,
            size !== "md" && `number-input-${size}`,
          ],
          groupClassName,
        )}
        style={style}
        ref={ref}
      >
        <NumberField.Decrement
          className={cn("number-input-step", classNames?.decrement)}
          aria-label={decrementLabel}
        >
          {decrementIcon ?? <MinusIcon />}
        </NumberField.Decrement>
        <NumberField.Input
          className={cn("number-input-field", classNames?.input)}
          placeholder={placeholder}
          aria-label={inputAriaLabel}
        />
        <NumberField.Increment
          className={cn("number-input-step", classNames?.increment)}
          aria-label={incrementLabel}
        >
          {incrementIcon ?? <PlusIcon />}
        </NumberField.Increment>
      </NumberField.Group>
    </NumberField.Root>
  );
}
