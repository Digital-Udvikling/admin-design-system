import { clsx } from "clsx";
import type { ComponentProps } from "react";

export type InputGroupProps = ComponentProps<"div">;

function InputGroupRoot({ className, ...rest }: InputGroupProps) {
  return <div className={clsx("input-group", className)} {...rest} />;
}

export type InputGroupAddonProps = ComponentProps<"span">;

function InputGroupAddon({ className, ...rest }: InputGroupAddonProps) {
  return <span className={clsx("input-group-addon", className)} {...rest} />;
}

export const InputGroup = Object.assign(InputGroupRoot, {
  Addon: InputGroupAddon,
});
