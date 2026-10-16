import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { close, init, register } from "./palette";

const shadow = () => document.querySelector("admin-palette")?.shadowRoot ?? null;
const dialog = () => shadow()?.querySelector("dialog") ?? null;
const options = () =>
  [...(shadow()?.querySelectorAll("[role=option]") ?? [])].map((o) => o.textContent);

describe("standalone", () => {
  it("mounts in a shadow root on first open, binds the hotkey and triggers, and takes page commands", async () => {
    const user = userEvent.setup();
    init({
      commands: [
        { id: "orders", title: "Orders", href: "#orders" },
        { id: "theme", title: "Theme", children: [{ id: "dark", title: "Dark" }] },
      ],
      suggested: ["orders"],
    });
    const unregister = register([{ id: "refund", title: "Refund this order" }]);
    expect(document.querySelector("admin-palette")).toBeNull();

    await user.keyboard("{Control>}k{/Control}");
    await waitFor(() => expect(dialog()?.open).toBe(true));
    expect(options()).toEqual(["Orders", "Refund this order"]);

    await user.keyboard("{Control>}k{/Control}");
    expect(dialog()?.open).toBe(false);

    unregister();
    const trigger = document.body.appendChild(document.createElement("button"));
    trigger.dataset.adminPalette = "theme";
    await user.click(trigger);
    await waitFor(() => expect(options()).toEqual(["Dark"]));
    close();
    await waitFor(() => expect(dialog()?.open).toBe(false));
  });
});
