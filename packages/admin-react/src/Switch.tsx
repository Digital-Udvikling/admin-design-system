import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { clsx } from "clsx";
import type { ComponentProps } from "react";

export type SwitchProps = ComponentProps<typeof BaseSwitch.Root>;

function SwitchRoot({ className, children, ...rest }: SwitchProps) {
  return (
    <BaseSwitch.Root
      className={clsx("switch", typeof className === "string" ? className : undefined)}
      {...rest}
    >
      {children ?? <SwitchThumb />}
    </BaseSwitch.Root>
  );
}

export type SwitchThumbProps = ComponentProps<typeof BaseSwitch.Thumb>;

function SwitchThumb({ className, ...rest }: SwitchThumbProps) {
  return (
    <BaseSwitch.Thumb
      className={clsx("switch-thumb", typeof className === "string" ? className : undefined)}
      {...rest}
    />
  );
}

export const Switch = Object.assign(SwitchRoot, {
  Thumb: SwitchThumb,
});
