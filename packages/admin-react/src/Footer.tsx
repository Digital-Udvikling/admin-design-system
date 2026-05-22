import type { ComponentProps } from "react";
import { cn } from "./cn";

export type FooterProps = ComponentProps<"footer">;

function FooterRoot({ className, ...rest }: FooterProps) {
  return <footer className={cn("footer", className)} {...rest} />;
}

export type FooterLinksProps = ComponentProps<"div">;

function FooterLinks({ className, ...rest }: FooterLinksProps) {
  return <div className={cn("footer-links", className)} {...rest} />;
}

export type FooterLinkProps = ComponentProps<"a">;

function FooterLink({ className, children, ...rest }: FooterLinkProps) {
  return (
    <a className={cn("footer-link", className)} {...rest}>
      {children}
    </a>
  );
}

export type FooterMetaProps = ComponentProps<"div">;

function FooterMeta({ className, ...rest }: FooterMetaProps) {
  return <div className={cn("footer-meta", className)} {...rest} />;
}

export const Footer = Object.assign(FooterRoot, {
  Links: FooterLinks,
  Link: FooterLink,
  Meta: FooterMeta,
});
