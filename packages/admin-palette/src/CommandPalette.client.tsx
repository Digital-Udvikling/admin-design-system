"use client";

import { Dialog, Kbd, Spinner, renderIcon, useHotkey } from "@aortl/admin-react";
import { cn } from "@aortl/admin-react/internal";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { Layer, isStaticList, walkCommands, type CommandSet, type ResultItem } from "./rank";
import { readRecents, recordRecent, type Located } from "./recents";
import { registryCommands, type RegistryFilter } from "./registry";
import { buildResults, locate } from "./results";
import {
  closePalette,
  getOpenState,
  getPageCommands,
  openPalette,
  subscribe,
  togglePalette,
} from "./store";
import type { Command, CommandIcon, Source } from "./types";
import { useRegistry, type RegistryOption } from "./useRegistry";
import { useSources } from "./useSources";

export interface CommandPaletteProps {
  /** System-wide commands, under "Commands" unless they name a `group`. */
  commands?: readonly Command[];
  /** Async results searched from the root. */
  sources?: readonly Source[];
  /** Command ids listed under Suggested before anything is typed. */
  suggested?: readonly string[];
  /** Opens and closes the palette, in `useHotkey` syntax; `false` binds none. Default: `"mod+k"`. */
  hotkey?: string | readonly string[] | false;
  /** Follows a same-origin `href`; pass your router's navigate. Default: `location.assign`. */
  onNavigate?: (href: string) => void;
  /**
   * Other systems' commands and searches: a registry document, or `{ url, resource? }` to fetch
   * one on first open. A local command with the same id replaces a registry one. A document is
   * read again whenever its identity changes, so keep it stable.
   */
  registry?: RegistryOption;
  /**
   * Keeps a registry command or source, e.g. only those of systems the user can open. Pass a
   * stable function: a new one re-reads the registry.
   */
  filter?: RegistryFilter;
  /** Bearer token for a remote endpoint's `resource`; cached until a request answers 401. */
  token?: (resource: string) => Promise<string>;
  /** Default: `"Search or jump to…"`. */
  placeholder?: string;
  /** Names the dialog. Default: `"Command palette"`. */
  "aria-label"?: string;
  className?: string;
}

const NO_COMMANDS: readonly Command[] = [];
const NO_SOURCES: readonly Source[] = [];
const NO_IDS: readonly string[] = [];

const defaultNavigate = (href: string) => window.location.assign(href);

/** Another origin's link: a full navigation, never the router. */
function isExternal(href: string): boolean {
  try {
    return new URL(href, window.location.href).origin !== window.location.origin;
  } catch {
    return false;
  }
}
const getServerPageCommands = () => NO_COMMANDS;
const subscribeNever = () => () => {};
const getHydrated = () => true;
const getServerHydrated = () => false;

function CommandIconView({ icon }: { icon: CommandIcon | undefined }) {
  if (icon === undefined || icon === null) return null;
  return (
    <span className={cn("item-media", undefined)}>
      {typeof icon === "string" ? (
        <i className={`ti ti-${icon}`} aria-hidden="true" />
      ) : (
        renderIcon(icon)
      )}
    </span>
  );
}

function SearchIcon() {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="7" />
      <path d="m21 21-6-6" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="Other system"
      // eslint-disable-next-line jsx-a11y/prefer-tag-over-role -- an inline SVG named for the link it marks
      role="img"
    >
      <path d="M17 7 7 17" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

/** Binds a command's shortcut while the palette is open. */
function ShortcutBinding({ shortcut, onRun }: { shortcut: string; onRun: () => void }) {
  useHotkey(shortcut, onRun);
  return null;
}

/** The palette dialog. Render one per document, from a client component when commands carry functions. */
export function CommandPaletteRoot({
  commands = NO_COMMANDS,
  sources = NO_SOURCES,
  suggested = NO_IDS,
  hotkey = "mod+k",
  onNavigate = defaultNavigate,
  registry,
  filter,
  token,
  placeholder = "Search or jump to…",
  "aria-label": ariaLabel = "Command palette",
  className,
}: CommandPaletteProps) {
  const { open, options } = useSyncExternalStore(subscribe, getOpenState, getOpenState);
  // The server never has page commands; hydrating with them would mismatch its markup.
  const pageCommands = useSyncExternalStore(subscribe, getPageCommands, getServerPageCommands);

  const [query, setQuery] = useState("");
  const [stack, setStack] = useState<readonly Located[]>([]);
  // Unset, the highlight follows the top result; arrow keys pin it to an item by key.
  const [pinned, setPinned] = useState<string | null>(null);
  const [enterQueued, setEnterQueued] = useState<{ newTab: boolean } | null>(null);
  const [recents, setRecents] = useState<readonly Located[]>([]);
  const dialogRef = useRef<HTMLDialogElement>(null);
  // Origin checks need `window`; the server and the hydration pass render without them.
  const hydrated = useSyncExternalStore(subscribeNever, getHydrated, getServerHydrated);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const awaitedPage = useRef<string | undefined>(undefined);
  const id = useId();
  const listId = `${id}-list`;

  useHotkey(hotkey === false ? null : hotkey, togglePalette);

  // Any `[data-admin-palette]` element opens it, its value naming a page to open into.
  useEffect(() => {
    const onClick = (event: globalThis.MouseEvent) => {
      const trigger = (event.target as Element | null)?.closest?.("[data-admin-palette]");
      if (!trigger) return;
      event.preventDefault();
      const page = trigger.getAttribute("data-admin-palette");
      openPalette(page ? { page } : {});
    };
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      closePalette();
    };
  }, []);

  const remote = useRegistry(registry, token);
  const fromRegistry = useMemo(
    () =>
      remote.doc
        ? registryCommands(remote.doc, remote.token, filter)
        : { commands: [], sources: [] },
    [remote.doc, remote.token, filter],
  );

  const sets = useMemo<CommandSet[]>(() => {
    const local = new Set(
      [...walkCommands(pageCommands), ...walkCommands(commands)].map(({ command }) => command.id),
    );
    return [
      { layer: Layer.page, commands: pageCommands, defaultGroup: "This page" },
      { layer: Layer.system, commands, defaultGroup: "Commands" },
      {
        layer: Layer.registry,
        commands: fromRegistry.commands.filter((command) => !local.has(command.id)),
      },
    ];
  }, [pageCommands, commands, fromRegistry]);
  const rootSources = useMemo(
    () => (fromRegistry.sources.length > 0 ? [...sources, ...fromRegistry.sources] : sources),
    [sources, fromRegistry],
  );

  // Fetch the registry on open, or earlier on a sign the user is about to open the palette.
  const { load, fetches } = remote;
  useEffect(() => {
    if (open) load();
  }, [open, load]);
  useEffect(() => {
    if (!fetches) return;
    const onIntent = (event: Event) => {
      if (event instanceof globalThis.KeyboardEvent) {
        if ((event.key === "Control" || event.key === "Meta") && !event.repeat) load();
      } else if ((event.target as Element | null)?.closest?.("[data-admin-palette]")) load();
    };
    const events = ["keydown", "pointerover", "focusin"] as const;
    for (const type of events) document.addEventListener(type, onIntent);
    return () => {
      for (const type of events) document.removeEventListener(type, onIntent);
    };
  }, [load, fetches]);

  // Each open starts fresh, at the root or the requested page.
  useEffect(() => {
    // A queued Enter belongs to the open it was pressed in; closing cancels it.
    if (!open) {
      setEnterQueued(null);
      awaitedPage.current = undefined;
      return;
    }
    const page = options.page ? locate(sets, options.page) : undefined;
    // A registry command's page may not have loaded yet; it opens when the registry arrives.
    awaitedPage.current = options.page && !page ? options.page : undefined;
    setQuery(options.query ?? "");
    setStack(page && page.command.children ? [page] : []);
    setPinned(null);
    setEnterQueued(null);
    setRecents(readRecents((recentId) => locate(sets, recentId)));
    // Dialog.Container's effect, a child's, already called showModal().
    inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `sets` is read at open only; a later registration doesn't reset the page
  }, [open, options]);

  useEffect(() => {
    if (!awaitedPage.current) return;
    const page = locate(sets, awaitedPage.current);
    if (!page?.command.children) return;
    awaitedPage.current = undefined;
    setStack([page]);
  }, [sets]);

  const page = stack.at(-1)?.command;
  const pageSource = page && !isStaticList(page.children) ? page.children : undefined;
  const activeSources = useMemo(
    () => (page ? (pageSource ? [pageSource] : NO_SOURCES) : rootSources),
    [page, pageSource, rootSources],
  );
  const trimmed = query.trim();
  const sourceStates = useSources(activeSources, trimmed, {
    enabled: open,
    inPage: page !== undefined,
  });
  const pending = [...sourceStates.values()].some((s) => s.status === "pending");

  const groups = useMemo(
    () =>
      buildResults({
        sets,
        sources: activeSources,
        sourceStates,
        query: trimmed,
        page,
        recents,
        suggested,
      }),
    [sets, activeSources, sourceStates, trimmed, page, recents, suggested],
  );
  const items = useMemo(() => groups.flatMap((g) => g.items), [groups]);
  const highlighted =
    (pinned !== null && items.find((i) => i.key === pinned)) || items[0] || undefined;
  const optionId = (index: number) => `${id}-option-${index}`;
  const highlightedIndex = highlighted ? items.indexOf(highlighted) : -1;
  const highlightedId = highlightedIndex >= 0 ? optionId(highlightedIndex) : undefined;

  useEffect(() => {
    if (highlightedId === undefined) return;
    listRef.current
      ?.querySelector(`[id="${highlightedId}"]`)
      ?.scrollIntoView?.({ block: "nearest" });
  }, [highlightedId]);

  const stackTitles = stack.map((entry) => entry.command.title);

  // The dialog closes now, not in Dialog's effect, so `perform` and navigation see the page
  // behind it no longer inert.
  function close() {
    dialogRef.current?.close();
    closePalette();
  }

  function run(entry: Located, newTab: boolean) {
    const { command } = entry;
    awaitedPage.current = undefined;
    if (command.children) {
      setStack((s) => [...s, entry]);
      setQuery("");
      setPinned(null);
      return;
    }
    if (command.href) {
      recordRecent(entry);
      // A new tab keeps the palette open, so an operator can queue several.
      if (newTab) window.open(command.href, "_blank", "noopener");
      else {
        close();
        if (isExternal(command.href)) window.location.assign(command.href);
        else onNavigate(command.href);
      }
      return;
    }
    if (command.perform) {
      recordRecent(entry);
      close();
      command.perform();
    }
  }

  const located = (item: ResultItem): Located => ({
    command: item.command,
    path: [...stackTitles, ...item.path],
  });

  // Enter waits for the sources only while the highlight follows the top result.
  useEffect(() => {
    if (!enterQueued || pending || !open) return;
    setEnterQueued(null);
    if (highlighted) run(located(highlighted), enterQueued.newTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fires when the sources settle, with the results of that render
  }, [enterQueued, pending]);

  function leavePage(depth: number) {
    awaitedPage.current = undefined;
    setStack((s) => s.slice(0, depth));
    setQuery("");
    setPinned(null);
    setEnterQueued(null);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.nativeEvent.isComposing) return;
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp": {
        event.preventDefault();
        if (items.length === 0) return;
        const step = event.key === "ArrowDown" ? 1 : -1;
        const next = Math.min(Math.max(highlightedIndex + step, 0), items.length - 1);
        setPinned(items[next]?.key ?? null);
        setEnterQueued(null);
        return;
      }
      case "Enter": {
        event.preventDefault();
        const newTab = event.metaKey || event.ctrlKey;
        if (pinned === null && pending) setEnterQueued({ newTab });
        else if (highlighted) run(located(highlighted), newTab);
        return;
      }
      case "Escape":
        // Prevented, the keydown never becomes the dialog's close request.
        if (stack.length > 0) {
          event.preventDefault();
          leavePage(stack.length - 1);
        }
        return;
      case "Backspace":
        if (query === "" && stack.length > 0) {
          event.preventDefault();
          leavePage(stack.length - 1);
        }
        return;
    }
  }

  function onItemClick(event: MouseEvent, item: ResultItem) {
    // A modified click on a link opens a tab or window natively.
    if (item.command.href && (event.metaKey || event.ctrlKey || event.shiftKey)) {
      recordRecent(located(item));
      return;
    }
    event.preventDefault();
    run(located(item), false);
  }

  const shortcuts = useMemo(
    () =>
      sets.flatMap(({ commands: list }) =>
        [...walkCommands(list)].flatMap(({ command, path }) =>
          command.shortcut && !command.pattern
            ? [{ command, path: path.map((c) => c.title), shortcut: command.shortcut }]
            : [],
        ),
      ),
    [sets],
  );

  let index = 0;
  const empty = items.length === 0 && !pending && !groups.some((g) => g.status);

  return (
    <Dialog.Container
      ref={dialogRef}
      open={open}
      onOpenChange={(next) => (next ? openPalette() : closePalette())}
      className={cn("palette", className)}
      aria-label={ariaLabel}
    >
      {open
        ? shortcuts.map(({ command, path, shortcut }) => (
            <ShortcutBinding
              key={`${path.join("/")}/${command.id}`}
              shortcut={shortcut}
              onRun={() => run({ command, path }, false)}
            />
          ))
        : null}
      <div className={cn("palette-header", undefined)}>
        <SearchIcon />
        {stack.map((entry, depth) => (
          <button
            key={`${depth}-${entry.command.id}`}
            type="button"
            className={cn("palette-crumb", undefined)}
            onClick={() => leavePage(depth + 1)}
          >
            {entry.command.title}
          </button>
        ))}
        <input
          ref={inputRef}
          className={cn("palette-input", undefined)}
          type="text"
          // eslint-disable-next-line jsx-a11y/no-redundant-roles -- a text input is a textbox without `list`; the combobox role carries aria-activedescendant
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={highlightedId}
          aria-label={ariaLabel}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="go"
          value={query}
          onChange={(event) => {
            awaitedPage.current = undefined;
            setQuery(event.target.value);
            setPinned(null);
            setEnterQueued(null);
          }}
          onKeyDown={onKeyDown}
        />
        {pending ? <Spinner size="sm" aria-label="Searching" /> : null}
      </div>
      <div
        ref={listRef}
        id={listId}
        // eslint-disable-next-line jsx-a11y/prefer-tag-over-role -- an ARIA combobox popup; <select> can't hold groups of rich rows
        role="listbox"
        aria-label={ariaLabel}
        className={cn("palette-list", undefined)}
      >
        {groups.map((group, groupIndex) => {
          const labelId = `${id}-group-${groupIndex}`;
          return (
            <div
              key={group.key}
              // eslint-disable-next-line jsx-a11y/prefer-tag-over-role -- a group inside an ARIA listbox
              role="group"
              aria-labelledby={group.label ? labelId : undefined}
              className={cn("palette-group", undefined)}
            >
              {group.label ? (
                <div id={labelId} className={cn("palette-group-label", undefined)}>
                  {group.label}
                </div>
              ) : null}
              {group.items.map((item) => {
                const i = index++;
                const { command } = item;
                const Row = command.href ? "a" : "div";
                const external = hydrated && command.href !== undefined && isExternal(command.href);
                return (
                  // eslint-disable-next-line jsx-a11y/interactive-supports-focus -- the input keeps focus and points here with aria-activedescendant
                  <Row
                    key={item.key}
                    id={optionId(i)}
                    // eslint-disable-next-line jsx-a11y/prefer-tag-over-role -- an option in an ARIA listbox
                    role="option"
                    aria-selected={i === highlightedIndex}
                    data-highlighted={i === highlightedIndex ? "" : undefined}
                    className={cn("item palette-item", undefined)}
                    {...(command.href ? { href: command.href, tabIndex: -1 } : {})}
                    onClick={(event: MouseEvent) => onItemClick(event, item)}
                  >
                    <CommandIconView icon={command.icon} />
                    <span className={cn("item-content", undefined)}>
                      <span className={cn("item-title", undefined)}>
                        {item.path.length > 0 ? (
                          <span className={cn("palette-item-path", undefined)}>
                            {item.path.join(" › ")} ›{" "}
                          </span>
                        ) : null}
                        {command.title}
                      </span>
                      {command.description ? (
                        <span className={cn("item-description", undefined)}>
                          {command.description}
                        </span>
                      ) : null}
                    </span>
                    {command.shortcut || command.children || external ? (
                      <span className={cn("item-actions", undefined)}>
                        {command.shortcut ? <Kbd keys={command.shortcut} /> : null}
                        {command.children ? <ChevronIcon /> : null}
                        {external ? <ExternalIcon /> : null}
                      </span>
                    ) : null}
                  </Row>
                );
              })}
              {group.status === "pending" && group.items.length === 0 ? (
                <output className={cn("palette-status", undefined)}>Searching…</output>
              ) : null}
              {group.status === "error" ? (
                <output className={cn("palette-status", undefined)}>Unavailable</output>
              ) : null}
            </div>
          );
        })}
        {remote.failed && !page ? (
          <div className={cn("palette-status", undefined)}>Other systems unavailable</div>
        ) : null}
        <output className={cn("palette-status", undefined)}>
          {empty ? (trimmed ? `No results for “${trimmed}”` : "Type to search") : ""}
        </output>
      </div>
      <div className={cn("palette-footer", undefined)} aria-hidden="true">
        <span>
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd> Move
        </span>
        <span>
          <Kbd>↵</Kbd> Open
        </span>
        <span>
          <Kbd keys="mod+enter" /> New tab
        </span>
        <span>
          <Kbd>Esc</Kbd> {stack.length > 0 ? "Back" : "Close"}
        </span>
      </div>
    </Dialog.Container>
  );
}
