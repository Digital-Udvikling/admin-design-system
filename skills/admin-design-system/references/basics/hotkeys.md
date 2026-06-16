# Hotkeys

> Bind keyboard shortcuts to page-level actions.

For shortcuts tied to a visible control, use the `hotkey` prop on [Buttons](../components/buttons.md) and [Menu.Item](../components/menus.md). For everything else — opening a help dialog, focusing search, navigation — reach for `useHotkey()`.

`mod` resolves to `Cmd` on macOS and `Ctrl` on every other platform.

## Page-level shortcut (React only)

```tsx
import { useHotkey } from "@aortl/admin-react";

function HelpShortcut({ onOpen }: { onOpen: () => void }) {
  useHotkey("?", onOpen);
  return null;
}
```

Pass `{ enabled: false }` to pause registration without unmounting.
