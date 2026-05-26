import type { ComponentProps } from "react";
import { cn } from "./cn";

export type InputGroupProps = ComponentProps<"div">;

function InputGroupRoot({ className, ...rest }: InputGroupProps) {
  return <div className={cn("input-group", className)} {...rest} />;
}

export type InputGroupAddonProps = ComponentProps<"span">;

function InputGroupAddon({ className, ...rest }: InputGroupAddonProps) {
  return <span className={cn("input-group-addon", className)} {...rest} />;
}

export const InputGroup = Object.assign(InputGroupRoot, {
  Addon: InputGroupAddon,
});
