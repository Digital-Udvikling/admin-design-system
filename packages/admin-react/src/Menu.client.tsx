"use client";

import { Menu as BaseMenu } from "@base-ui/react/menu";
import { useContext, useEffect, useState, type MouseEvent, type ReactNode, type Ref } from "react";
import { cn } from "./cn";
import { Kbd } from "./Kbd";
import type { MenuItemAsButton, MenuItemAsLink, MenuPopupProps } from "./Menu";
import { PortalContainerContext } from "./portal-context";
import { useHotkeyClick } from "./useHotkey";

export function MenuPopup({
  side,
  align = "start",
  sideOffset = 4,
  alignOffset,
  className,
  children,
  ...rest
}: MenuPopupProps) {
  const portalContainer = useContext(PortalContainerContext);
  // The kept-mounted portal resolves its container in a layout effect, before an ancestor's
  // ref is attached; read the element after commit instead. `null` makes Base UI wait for it.
  const [container, setContainer] = useState<HTMLElement | null>(null);
  useEffect(() => setContainer(portalContainer?.current ?? null), [portalContainer]);
  return (
    // keepMounted: closed items stay in the DOM so their hotkeys keep working, as they did
    // inside a closed <details>. Base UI skips positioning work while the popup is closed.
    <BaseMenu.Portal container={portalContainer === null ? undefined : container} keepMounted>
      <BaseMenu.Positioner
        className={cn("popup-layer", undefined)}
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
      >
        <BaseMenu.Popup
          className={cn(["menu-popup", align === "end" && "menu-popup-end"], className)}
          {...rest}
        >
          {children}
        </BaseMenu.Popup>
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
}

/** `Menu.Item` with its leading slot pre-rendered by Menu.tsx, so Server Components can pass `icon={IconCopy}`. */
export type MenuItemBaseProps =
  | (Omit<MenuItemAsButton, "icon"> & { leading?: ReactNode })
  | (Omit<MenuItemAsLink, "icon"> & { leading?: ReactNode });

export function MenuItemBase(props: MenuItemBaseProps) {
  // Anchors have no native `disabled`, hence the `aria-disabled` branch.
  const ariaDisabled = props["aria-disabled"];
  const isDisabled =
    ("disabled" in props && props.disabled === true) ||
    ariaDisabled === true ||
    ariaDisabled === "true";

  // React 19 passes `ref` as a prop; merge it so a consumer ref can't detach the hotkey target.
  const { ariaKeyShortcuts, primaryChord, setRef } = useHotkeyClick<HTMLElement>(
    props.hotkey,
    props.ref as Ref<HTMLElement> | undefined,
    { enabled: !isDisabled },
  );

  const content = (
    <>
      {props.leading}
      {props.children}
      {primaryChord !== undefined ? <Kbd keys={primaryChord} /> : null}
    </>
  );

  if (props.href !== undefined) {
    const {
      className,
      leading: _leading,
      danger,
      children: _children,
      hotkey: _hk,
      ref: _ref,
      closeOnClick = true,
      onClick,
      ...rest
    } = props;
    return (
      <BaseMenu.LinkItem
        ref={setRef}
        aria-keyshortcuts={ariaKeyShortcuts}
        closeOnClick={closeOnClick}
        className={cn(["menu-item", danger && "menu-item-danger"], className)}
        onClick={(event: MouseEvent<HTMLAnchorElement>) => {
          // `aria-disabled` elements still receive clicks — without this, the anchor would navigate.
          if (isDisabled) {
            event.preventDefault();
            return;
          }
          onClick?.(event);
        }}
        {...rest}
      >
        {content}
      </BaseMenu.LinkItem>
    );
  }

  const {
    className,
    type = "button",
    leading: _leading,
    danger,
    children: _children,
    hotkey: _hk,
    ref: _ref,
    disabled,
    closeOnClick,
    onClick,
    checked,
    defaultChecked,
    onCheckedChange,
    ...rest
  } = props;
  const itemClassName = cn(["menu-item", danger && "menu-item-danger"], className);
  // Native attributes (form, name, value, aria-*) ride on the rendered <button>.
  const render = <button type={type} {...rest} />;

  if (checked !== undefined || defaultChecked !== undefined) {
    return (
      <BaseMenu.CheckboxItem
        ref={setRef}
        render={render}
        nativeButton
        aria-keyshortcuts={ariaKeyShortcuts}
        disabled={disabled}
        closeOnClick={closeOnClick}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange}
        onClick={onClick}
        className={itemClassName}
      >
        {content}
      </BaseMenu.CheckboxItem>
    );
  }

  return (
    <BaseMenu.Item
      ref={setRef}
      render={render}
      nativeButton
      aria-keyshortcuts={ariaKeyShortcuts}
      disabled={disabled}
      closeOnClick={closeOnClick}
      onClick={onClick}
      className={itemClassName}
    >
      {content}
    </BaseMenu.Item>
  );
}
