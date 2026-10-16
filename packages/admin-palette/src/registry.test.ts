import { afterEach, describe, expect, it, vi } from "vitest";
import { fillPattern } from "./rank";
import type { PaletteRegistry, RemoteCommand } from "./protocol";
import { registryCommands } from "./registry";

const noToken = async () => undefined;

const registry = (systems: PaletteRegistry["systems"]): PaletteRegistry => ({
  protocol: 1,
  systems,
});

function respond(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("registryCommands", () => {
  it("namespaces ids, groups by system, and resolves hrefs against the system url", () => {
    const { commands } = registryCommands(
      registry([
        {
          id: "oms",
          name: "OMS",
          url: "https://oms.example.com/admin/",
          icon: "package",
          commands: [
            { id: "orders", title: "Orders", href: "orders/" },
            { id: "here", title: "Same origin", href: `${window.location.origin}/x?y=1#z` },
          ],
        },
      ]),
      noToken,
    );
    expect(commands).toEqual([
      expect.objectContaining({
        id: "oms.orders",
        group: "OMS",
        icon: "package",
        href: "https://oms.example.com/admin/orders/",
      }),
      expect.objectContaining({ id: "oms.here", href: "/x?y=1#z" }),
    ]);
  });

  it("fills a pattern command with the query", () => {
    const { commands } = registryCommands(
      registry([
        {
          id: "oms",
          name: "OMS",
          url: "https://oms.example.com",
          commands: [
            { id: "order", title: "Order {q}", href: "/orders/{q}", pattern: "^\\d{6,}$" },
          ],
        },
      ]),
      noToken,
    );
    const [order] = commands;
    expect(fillPattern(order!, "12345")).toBeUndefined();
    expect(fillPattern(order!, "123456")).toMatchObject({
      title: "Order 123456",
      href: "https://oms.example.com/orders/123456",
    });
  });

  it("skips what it can't run, and what the filter drops", () => {
    const { commands } = registryCommands(
      registry([
        {
          id: "oms",
          name: "OMS",
          url: "https://oms.example.com",
          commands: [
            { id: "nothing", title: "No href or children" },
            { id: "bad", title: "Bad pattern", href: "/", pattern: "(" },
            { id: "future", title: "Future kind", href: "/", kind: "action" } as RemoteCommand,
            { id: "kept", title: "Kept", href: "/" },
            { id: "hidden", title: "Hidden", href: "/" },
          ],
        },
      ]),
      noToken,
      (command) => command.id !== "oms.hidden",
    );
    expect(commands.map((c) => c.id)).toEqual(["oms.kept"]);
  });

  it("searches a remote source with a bearer token, refreshing it once on a 401", async () => {
    const tokens = ["stale", "fresh"];
    const requests: { url: string; auth: string | null }[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: URL, init: RequestInit) => {
        const auth = new Headers(init.headers).get("Authorization");
        requests.push({ url: String(url), auth });
        return auth === "Bearer fresh"
          ? respond({
              protocol: 1,
              items: [{ id: "123456", title: "Order 123456", href: "123456/" }],
            })
          : respond({}, 401);
      }),
    );
    const { sources } = registryCommands(
      registry([
        {
          id: "oms",
          name: "OMS",
          url: "https://oms.example.com",
          sources: [{ id: "lookup", search: "/palette/orders/", resource: "oms:palette" }],
        },
      ]),
      async () => tokens.shift(),
    );
    const [lookup] = sources;
    expect(lookup).toMatchObject({ id: "oms.lookup", group: "OMS" });
    const items = await lookup!.search("123456", { signal: new AbortController().signal });
    expect(requests).toEqual([
      { url: "https://oms.example.com/palette/orders/?q=123456", auth: "Bearer stale" },
      { url: "https://oms.example.com/palette/orders/?q=123456", auth: "Bearer fresh" },
    ]);
    expect(items).toEqual([
      expect.objectContaining({
        id: "oms.lookup.123456",
        title: "Order 123456",
        href: "https://oms.example.com/palette/orders/123456/",
      }),
    ]);
  });

  it("rejects a search response in another protocol", async () => {
    vi.stubGlobal("fetch", async () => respond({ protocol: 2, items: [] }));
    const { sources } = registryCommands(
      registry([
        {
          id: "oms",
          name: "OMS",
          url: "https://oms.example.com",
          sources: [{ id: "lookup", search: "/s" }],
        },
      ]),
      noToken,
    );
    await expect(
      sources[0]!.search("1", { signal: new AbortController().signal }),
    ).rejects.toThrow();
  });
});
