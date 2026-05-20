import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import type { ComponentProps } from "react";
import { cn } from "./cn";

export type CheckboxProps = ComponentProps<typeof BaseCheckbox.Root>;

function CheckboxRoot({ className, children, ...rest }: CheckboxProps) {
  return (
    <BaseCheckbox.Root className={cn("checkbox", className)} {...rest}>
      {children ?? (
        <CheckboxIndicator>
          <CheckIcon />
        </CheckboxIndicator>
      )}
    </BaseCheckbox.Root>
  );
}

export type CheckboxIndicatorProps = ComponentProps<typeof BaseCheckbox.Indicator>;

function CheckboxIndicator({ className, ...rest }: CheckboxIndicatorProps) {
  return <BaseCheckbox.Indicator className={cn("checkbox-indicator", className)} {...rest} />;
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      width="100%"
      height="100%"
      aria-hidden
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export const Checkbox = Object.assign(CheckboxRoot, {
  Indicator: CheckboxIndicator,
});
