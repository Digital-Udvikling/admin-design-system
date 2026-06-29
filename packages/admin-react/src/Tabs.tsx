import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import type { ComponentProps } from "react";
import { cn } from "./cn";
import { renderIcon, type IconProp } from "./icon";

export type TabsVariant = "bordered" | "boxed";
export type TabsSize = "sm" | "md" | "lg";

export interface TabsProps extends ComponentProps<typeof BaseTabs.Root> {
  variant?: TabsVariant;
  size?: TabsSize;
  fullWidth?: boolean;
  /** Let the list wrap to multiple rows instead of overflowing; each tab stays on one line. */
  wrap?: boolean;
  /** Fill the active segment with the primary color. Only affects `variant="boxed"`. */
  primary?: boolean;
}

function TabsRoot({
  variant = "bordered",
  size = "md",
  fullWidth = false,
  wrap = false,
  primary = false,
  className,
  ...rest
}: TabsProps) {
  return (
    <BaseTabs.Root
      className={cn(
        [
          "tabs",
          variant !== "bordered" && `tabs-${variant}`,
          size !== "md" && `tabs-${size}`,
          fullWidth && "tabs-full-width",
          wrap && "tabs-wrap",
          primary && "tabs-primary",
        ],
        className,
      )}
      {...rest}
    />
  );
}

export type TabsListProps = ComponentProps<typeof BaseTabs.List>;

function TabsList({ className, ...rest }: TabsListProps) {
  return <BaseTabs.List className={cn("tab-list", className)} {...rest} />;
}

export interface TabsTabProps extends ComponentProps<typeof BaseTabs.Tab> {
  /** Leading icon. Pass a component (`icon={IconLock}`) or an element. */
  icon?: IconProp;
}

function TabsTab({ icon, className, children, ...rest }: TabsTabProps) {
  return (
    <BaseTabs.Tab className={cn("tab", className)} {...rest}>
      {renderIcon(icon)}
      {children}
    </BaseTabs.Tab>
  );
}

export type TabsPanelProps = ComponentProps<typeof BaseTabs.Panel>;

function TabsPanel({ className, ...rest }: TabsPanelProps) {
  return <BaseTabs.Panel className={cn("tab-panel", className)} {...rest} />;
}

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Tab: TabsTab,
  Panel: TabsPanel,
});
