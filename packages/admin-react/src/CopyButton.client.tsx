"use client";

import type { ReactNode } from "react";
import { ButtonBase } from "./Button.client";
import type { CopyButtonProps } from "./CopyButton";
import { CopyStatus, useCopy } from "./useCopy";

export interface CopyButtonBaseProps extends Omit<CopyButtonProps, "icon"> {
  /** Pre-rendered idle icon; CopyButton.tsx renders it so Server Components can pass `icon={IconLink}`. */
  idleIcon: ReactNode;
  copiedIcon: ReactNode;
}

export function CopyButtonBase({
  value,
  copiedLabel = "Copied",
  timeout,
  idleIcon,
  copiedIcon,
  variant = "ghost",
  children,
  onClick,
  "aria-label": ariaLabel,
  ...rest
}: CopyButtonBaseProps) {
  const { copied, copy } = useCopy({ timeout });
  return (
    <>
      <ButtonBase
        variant={variant}
        square={children == null}
        aria-label={ariaLabel ?? (children == null ? "Copy" : undefined)}
        data-copied={copied ? "" : undefined}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) void copy(value);
        }}
        {...rest}
      >
        {copied ? copiedIcon : idleIcon}
        {children}
      </ButtonBase>
      <CopyStatus copied={copied} label={copiedLabel} />
    </>
  );
}
