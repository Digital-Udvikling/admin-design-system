import { Radio as BaseRadio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import type { ComponentProps } from "react";
import { cn } from "./cn";

export type RadioProps = ComponentProps<typeof BaseRadio.Root>;

function RadioRoot({ className, children, ...rest }: RadioProps) {
  return (
    <BaseRadio.Root className={cn("radio", className)} {...rest}>
      {children ?? <RadioIndicator />}
    </BaseRadio.Root>
  );
}

export type RadioIndicatorProps = ComponentProps<typeof BaseRadio.Indicator>;

function RadioIndicator({ className, ...rest }: RadioIndicatorProps) {
  return <BaseRadio.Indicator className={cn("radio-indicator", className)} {...rest} />;
}

export const Radio = Object.assign(RadioRoot, {
  Indicator: RadioIndicator,
});

export type RadioGroupOrientation = "horizontal" | "vertical";

export interface RadioGroupProps extends ComponentProps<typeof BaseRadioGroup> {
  orientation?: RadioGroupOrientation;
}

export function RadioGroup({ orientation = "horizontal", className, ...rest }: RadioGroupProps) {
  return (
    <BaseRadioGroup
      className={cn(
        ["radio-group", orientation === "vertical" && "radio-group-vertical"],
        className,
      )}
      {...rest}
    />
  );
}
