import { Switch as BaseSwitch } from "@base-ui/react/switch";
import type { ComponentProps } from "react";
import { cn } from "./cn";

export type SwitchProps = ComponentProps<typeof BaseSwitch.Root>;

function SwitchRoot({ className, children, ...rest }: SwitchProps) {
  return (
    <BaseSwitch.Root className={cn("switch", className)} {...rest}>
      {children ?? <SwitchThumb />}
    </BaseSwitch.Root>
  );
}

export type SwitchThumbProps = ComponentProps<typeof BaseSwitch.Thumb>;

function SwitchThumb({ className, ...rest }: SwitchThumbProps) {
  return <BaseSwitch.Thumb className={cn("switch-thumb", className)} {...rest} />;
}

export const Switch = Object.assign(SwitchRoot, {
  Thumb: SwitchThumb,
});
