import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import type { ComponentProps } from "react";
import { cn } from "./cn";

export type TabsVariant = "bordered" | "boxed";
export type TabsSize = "sm" | "md" | "lg";

export interface TabsProps extends ComponentProps<typeof BaseTabs.Root> {
  variant?: TabsVariant;
  size?: TabsSize;
  fullWidth?: boolean;
}

function TabsRoot({
  variant = "bordered",
  size = "md",
  fullWidth = false,
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

export type TabsTabProps = ComponentProps<typeof BaseTabs.Tab>;

function TabsTab({ className, ...rest }: TabsTabProps) {
  return <BaseTabs.Tab className={cn("tab", className)} {...rest} />;
}

export type TabsPanelProps = ComponentProps<typeof BaseTabs.Panel>;

function TabsPanel({ className, ...rest }: TabsPanelProps) {
  return <BaseTabs.Panel className={cn("tab-panel", className)} {...rest} />;
}

export type TabsIndicatorProps = ComponentProps<typeof BaseTabs.Indicator>;

function TabsIndicator({ className, ...rest }: TabsIndicatorProps) {
  return <BaseTabs.Indicator className={cn("tab-indicator", className)} {...rest} />;
}

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Tab: TabsTab,
  Panel: TabsPanel,
  Indicator: TabsIndicator,
});
