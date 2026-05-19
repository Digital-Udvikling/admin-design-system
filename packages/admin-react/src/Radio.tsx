import { Radio as BaseRadio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import { clsx } from "clsx";
import type { ComponentProps } from "react";

export type RadioProps = ComponentProps<typeof BaseRadio.Root>;

function RadioRoot({ className, children, ...rest }: RadioProps) {
  return (
    <BaseRadio.Root
      className={clsx("radio", typeof className === "string" ? className : undefined)}
      {...rest}
    >
      {children ?? <RadioIndicator />}
    </BaseRadio.Root>
  );
}

export type RadioIndicatorProps = ComponentProps<typeof BaseRadio.Indicator>;

function RadioIndicator({ className, ...rest }: RadioIndicatorProps) {
  return (
    <BaseRadio.Indicator
      className={clsx("radio-indicator", typeof className === "string" ? className : undefined)}
      {...rest}
    />
  );
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
      className={clsx(
        "radio-group",
        orientation === "vertical" && "radio-group-vertical",
        typeof className === "string" ? className : undefined,
      )}
      {...rest}
    />
  );
}
