// The site's Cmd+K palette: its pages, theme and example flavor as commands, and Pagefind search.
import { AdminRoot } from "@aortl/admin-react";
import { CommandPalette, type Command } from "@aortl/admin-palette";
import {
  IconBrandReact,
  IconCode,
  IconDeviceDesktop,
  IconMoon,
  IconSun,
} from "@tabler/icons-react";
import { useMemo } from "react";
import { pagefindSource } from "../search/pagefind";

export interface PageLink {
  title: string;
  href: string;
  description?: string;
  /** Sidebar section. */
  section?: string;
}

interface Props {
  pages: PageLink[];
  base: string;
}

// The navbar and drawer pickers own the state; a command drives one as a user would.
function setTheme(theme: "auto" | "light" | "dark") {
  const select = document.querySelector<HTMLSelectElement>(".theme-select");
  if (!select) return;
  select.value = theme;
  select.dispatchEvent(new Event("change"));
}

const commands = (pages: PageLink[]): Command[] => [
  ...pages.map((page) => ({
    id: `page:${page.href}`,
    title: page.title,
    description: page.description,
    group: page.section ?? "Pages",
    href: page.href,
  })),
  {
    id: "theme",
    title: "Change theme",
    group: "Settings",
    icon: IconSun,
    children: [
      { id: "theme-auto", title: "Auto", icon: IconDeviceDesktop, perform: () => setTheme("auto") },
      { id: "theme-light", title: "Light", icon: IconSun, perform: () => setTheme("light") },
      { id: "theme-dark", title: "Dark", icon: IconMoon, perform: () => setTheme("dark") },
    ],
  },
  {
    id: "flavor",
    title: "Show examples as",
    group: "Settings",
    icon: IconCode,
    children: [
      {
        id: "flavor-html",
        title: "Vanilla CSS",
        icon: IconCode,
        perform: () => document.getElementById("flavor-html")?.click(),
      },
      {
        id: "flavor-react",
        title: "React",
        icon: IconBrandReact,
        perform: () => document.getElementById("flavor-react")?.click(),
      },
    ],
  },
];

// The nav drawer is modal too; a hit on the current page must scroll it, not the page behind it.
function navigate(href: string) {
  for (const dialog of document.querySelectorAll<HTMLDialogElement>("dialog:modal")) {
    dialog.close();
  }
  window.location.assign(href);
}

export default function DocsPalette({ pages, base }: Props) {
  const list = useMemo(() => commands(pages), [pages]);
  const sources = useMemo(() => [pagefindSource(base)], [base]);
  return (
    <AdminRoot>
      <CommandPalette
        commands={list}
        sources={sources}
        hotkey={["mod+k", "/"]}
        onNavigate={navigate}
        placeholder="Search docs"
        aria-label="Search docs"
      />
    </AdminRoot>
  );
}
