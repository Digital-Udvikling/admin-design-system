import type { ComponentProps } from "react";
import { cn } from "./cn";

export type AccordionProps = ComponentProps<"div">;

function AccordionRoot({ className, ...rest }: AccordionProps) {
  return <div className={cn("accordion", className)} {...rest} />;
}

export type AccordionItemProps = ComponentProps<"details">;

function AccordionItem({ className, ...rest }: AccordionItemProps) {
  return <details className={cn("accordion-item", className)} {...rest} />;
}

export type AccordionSummaryProps = ComponentProps<"summary">;

function AccordionSummary({ className, ...rest }: AccordionSummaryProps) {
  return <summary className={cn("accordion-summary", className)} {...rest} />;
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
