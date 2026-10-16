import { describe, expect, it } from "vitest";
import { Layer, type CommandSet } from "./rank";
import { buildResults, type ResultsInput } from "./results";
import type { Command, Source } from "./types";

const input = (overrides: Partial<ResultsInput>): ResultsInput => ({
  sets: [],
  sources: [],
  sourceStates: new Map(),
  query: "",
  page: undefined,
  recents: [],
  suggested: [],
  ...overrides,
});

const system = (commands: Command[]): CommandSet => ({
  layer: Layer.system,
  commands,
  defaultGroup: "Commands",
});
const page = (commands: Command[]): CommandSet => ({
  layer: Layer.page,
  commands,
  defaultGroup: "This page",
});

const titles = (groups: ReturnType<typeof buildResults>) =>
  groups.map((g) => [g.label, g.items.map((i) => [...i.path, i.command.title].join(" › "))]);

describe("buildResults", () => {
  it("ranks a title prefix above a description match", () => {
    const sets = [
      system([
        { id: "rules", title: "Reorder rules", description: "Order thresholds" },
        { id: "orders", title: "Orders" },
      ]),
    ];
    expect(titles(buildResults(input({ sets, query: "ord" })))).toEqual([
      ["Commands", ["Orders", "Reorder rules"]],
    ]);
  });

  it("matches static children from the root, with their path", () => {
    const theme: Command = {
      id: "theme",
      title: "Change theme",
      children: [
        { id: "dark", title: "Dark" },
        { id: "light", title: "Light" },
      ],
    };
    expect(titles(buildResults(input({ sets: [system([theme])], query: "dark" })))).toEqual([
      ["Commands", ["Change theme › Dark"]],
    ]);
  });

  it("orders groups by their best match, page commands first on a tie", () => {
    const sets = [
      page([{ id: "export", title: "Export orders" }]),
      system([
        { id: "orders", title: "Orders", group: "Navigate" },
        { id: "export-all", title: "Export all" },
      ]),
    ];
    expect(titles(buildResults(input({ sets, query: "export" })))).toEqual([
      ["This page", ["Export orders"]],
      ["Commands", ["Export all"]],
    ]);
    expect(titles(buildResults(input({ sets, query: "orders" })))).toEqual([
      ["Navigate", ["Orders"]],
      ["This page", ["Export orders"]],
    ]);
  });

  it("places a source group by its priority", () => {
    const lookup: Source = { id: "lookup", group: "Orders", priority: 10, search: async () => [] };
    const sets = [system([{ id: "o", title: "Order settings" }])];
    const sourceStates = new Map([
      ["lookup", { status: "done" as const, items: [{ id: "123456", title: "Order 123456" }] }],
    ]);
    expect(
      titles(buildResults(input({ sets, sources: [lookup], sourceStates, query: "order" }))),
    ).toEqual([
      ["Orders", ["Order 123456"]],
      ["Commands", ["Order settings"]],
    ]);
  });

  it("lists Recent, Suggested, then This page before anything is typed, each command once", () => {
    const save: Command = { id: "save", title: "Save" };
    const help: Command = { id: "help", title: "Help" };
    const sets = [page([save]), system([help])];
    const recents = [{ command: save, path: [] }];
    expect(titles(buildResults(input({ sets, recents, suggested: ["help", "save"] })))).toEqual([
      ["Recent", ["Save"]],
      ["Suggested", ["Help"]],
    ]);
  });

  it("lists an open page's children in order, grouped by their group", () => {
    const parent: Command = {
      id: "theme",
      title: "Theme",
      children: [
        { id: "light", title: "Light", group: "Mode" },
        { id: "contrast", title: "High contrast" },
        { id: "dark", title: "Dark", group: "Mode" },
      ],
    };
    expect(titles(buildResults(input({ page: parent })))).toEqual([
      ["Mode", ["Light", "Dark"]],
      [undefined, ["High contrast"]],
    ]);
  });
});
