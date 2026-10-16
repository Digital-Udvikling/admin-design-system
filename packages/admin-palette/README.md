# @aortl/admin-palette

Cmd+K command palette for the admin design system: search, navigation, nested pages and async sources. Built on [`@aortl/admin-react`](https://www.npmjs.com/package/@aortl/admin-react).

[View on npm](https://www.npmjs.com/package/@aortl/admin-palette) · [Docs](https://digital-udvikling.github.io/admin-design-system/modules/command-palette/)

## Install

```fish
npm install @aortl/admin-palette @aortl/admin-react react react-dom
```

## Use

```tsx
"use client";

import "@aortl/admin-react/styles.css";
import { AdminRoot } from "@aortl/admin-react";
import { CommandPalette } from "@aortl/admin-palette";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <AdminRoot>
      <CommandPalette.Trigger />
      <CommandPalette commands={[{ id: "orders", title: "Orders", href: "/orders" }]} />
      {children}
    </AdminRoot>
  );
}
```

Render one `<CommandPalette>` per document. Ctrl/Cmd+K opens it.

## Without React

```html
<script type="module">
  import { init } from "https://unpkg.com/@aortl/admin-palette/dist/standalone/palette.js";

  init({ commands: [{ id: "orders", title: "Orders", href: "/orders/" }] });
</script>
```

The entry binds the hotkey and `[data-admin-palette]` triggers; the palette, React included, loads on first open into a shadow root.
