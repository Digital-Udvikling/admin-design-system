import type { IconProp } from "@aortl/admin-react";

/** An icon component or element, or a Tabler icon name (`"package"` renders `<i class="ti ti-package">`). */
export type CommandIcon = IconProp | string;

export interface Command {
  /** Unique among every command the palette holds; recents and `suggested` refer to it. */
  id: string;
  title: string;
  description?: string;
  /** Results heading. Commands without one fall under their layer's default ("This page", "Commands"). */
  group?: string;
  /** Extra terms the query matches, ranked below the title. */
  keywords?: readonly string[];
  icon?: CommandIcon;
  /** Chord in `useHotkey` syntax, shown on the row and bound while the palette is open. Needs a modifier: the input has focus. */
  shortcut?: string;
  /** Navigates; the row is a real link, so middle-click and Cmd/Ctrl+click open a new tab. */
  href?: string;
  /** Runs after the palette closes. Ignored when `href` is set. */
  perform?: () => void;
  /** Makes the row open a nested page: a static list, or a `Source` searched while the page is open. */
  children?: readonly Command[] | Source;
}

export interface SourceContext {
  /** Aborts when the query changes, the page closes, or the source times out. */
  signal: AbortSignal;
}

/**
 * Async results, searched as the user types. Its results keep the order `search` returns; a
 * result's own `group` splits them into groups, in order of first appearance.
 */
export interface Source {
  id: string;
  /** Results heading. Default: none inside a nested page, "Results" at the root. */
  group?: string;
  /**
   * Orders the group against matched commands, on their tier scale: 7 is a case-sensitive exact
   * title match, 5 a prefix match, 1 a fuzzy match. Default: 0, below every command match.
   */
  priority?: number;
  /** Shortest query searched. Default: 1 at the root, 0 in a nested page (lists on entry). */
  minQuery?: number;
  /** The query must match it to search. */
  pattern?: RegExp;
  /** Default: 150 ms. */
  debounce?: number;
  /** A search taking longer is aborted and shown as unavailable. Default: 3000 ms. */
  timeout?: number;
  search: (query: string, context: SourceContext) => Promise<readonly Command[]>;
}

export interface OpenOptions {
  /** Id of a command with `children`: opens straight into its page. */
  page?: string;
  query?: string;
}
