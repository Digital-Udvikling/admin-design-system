import type { ComponentProps } from "react";
import { cn } from "./cn";
import { renderIcon, type IconProp } from "./icon";

export type AccordionProps = ComponentProps<"div">;

function AccordionRoot({ className, ...rest }: AccordionProps) {
  return <div className={cn("accordion", className)} {...rest} />;
}

export type AccordionItemProps = ComponentProps<"details">;

function AccordionItem({ className, ...rest }: AccordionItemProps) {
  return <details className={cn("accordion-item", className)} {...rest} />;
}

export interface AccordionSummaryProps extends ComponentProps<"summary"> {
  /** Leading icon. */
  icon?: IconProp;
}

function AccordionSummary({ icon, className, children, ...rest }: AccordionSummaryProps) {
  return (
    <summary className={cn("accordion-summary", className)} {...rest}>
      {renderIcon(icon)}
      {children}
    </summary>
  );
}

export type AccordionContentProps = ComponentProps<"div">;

function AccordionContent({ className, ...rest }: AccordionContentProps) {
  return <div className={cn("accordion-content", className)} {...rest} />;
}

export const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Summary: AccordionSummary,
  Content: AccordionContent,
});
