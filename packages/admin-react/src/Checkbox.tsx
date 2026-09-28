import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import type { ComponentProps } from "react";
import { cn } from "./cn";

export type CheckboxProps = ComponentProps<typeof BaseCheckbox.Root>;

function CheckboxRoot({ className, children, ...rest }: CheckboxProps) {
  return (
    <BaseCheckbox.Root className={cn("checkbox", className)} {...rest}>
      {children ?? <CheckboxIndicator />}
    </BaseCheckbox.Root>
  );
}

export type CheckboxIndicatorProps = ComponentProps<typeof BaseCheckbox.Indicator>;

function CheckboxIndicator({ className, ...rest }: CheckboxIndicatorProps) {
  return <BaseCheckbox.Indicator className={cn("checkbox-indicator", className)} {...rest} />;
}

export const Checkbox = Object.assign(CheckboxRoot, {
  Indicator: CheckboxIndicator,
});
