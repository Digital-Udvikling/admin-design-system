# Tabs

> Section a view into named panels.

## Contents

- [Examples](#examples)
  - [Basic (bordered)](#basic-bordered)
  - [Boxed (segmented control)](#boxed-segmented-control)
  - [Primary](#primary)
  - [Full width](#full-width)
  - [Full width, boxed](#full-width-boxed)
  - [Wrapping](#wrapping)
  - [With icons](#with-icons)
  - [Vertical orientation](#vertical-orientation)
- [Reference](#reference)
  - [React](#react)
  - [Vanilla](#vanilla)

## Examples

### Basic (bordered)

**Example**

```html
<div class="tabs">
  <div class="tab-list" role="tablist">
    <input class="tab-input" type="radio" name="basic" id="basic-1" value="1" checked />
    <label class="tab" for="basic-1">Overview</label>
    <input class="tab-input" type="radio" name="basic" id="basic-2" value="2" />
    <label class="tab" for="basic-2">Activity</label>
    <input class="tab-input" type="radio" name="basic" id="basic-3" value="3" />
    <label class="tab" for="basic-3">Settings</label>
  </div>
  <div class="tab-panel" data-value="1">Overview content.</div>
  <div class="tab-panel" data-value="2">Activity content.</div>
  <div class="tab-panel" data-value="3">Settings content.</div>
</div>
```

```tsx
<Tabs defaultValue="overview">
  <Tabs.List>
    <Tabs.Tab value="overview">Overview</Tabs.Tab>
    <Tabs.Tab value="activity">Activity</Tabs.Tab>
    <Tabs.Tab value="settings">Settings</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="overview">Overview content.</Tabs.Panel>
  <Tabs.Panel value="activity">Activity content.</Tabs.Panel>
  <Tabs.Panel value="settings">Settings content.</Tabs.Panel>
</Tabs>
```

### Boxed (segmented control)

**Example**

```html
<div class="tabs tabs-boxed tabs-sm">
  <div class="tab-list" role="tablist">
    <input class="tab-input" type="radio" name="boxed" id="boxed-1" value="1" />
    <label class="tab" for="boxed-1">Day</label>
    <input class="tab-input" type="radio" name="boxed" id="boxed-2" value="2" checked />
    <label class="tab" for="boxed-2">Week</label>
    <input class="tab-input" type="radio" name="boxed" id="boxed-3" value="3" />
    <label class="tab" for="boxed-3">Month</label>
  </div>
  <div class="tab-panel" data-value="1">Daily breakdown.</div>
  <div class="tab-panel" data-value="2">Weekly breakdown.</div>
  <div class="tab-panel" data-value="3">Monthly breakdown.</div>
</div>
```

```tsx
<Tabs defaultValue="week" variant="boxed" size="sm">
  <Tabs.List>
    <Tabs.Tab value="day">Day</Tabs.Tab>
    <Tabs.Tab value="week">Week</Tabs.Tab>
    <Tabs.Tab value="month">Month</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="day">Daily breakdown.</Tabs.Panel>
  <Tabs.Panel value="week">Weekly breakdown.</Tabs.Panel>
  <Tabs.Panel value="month">Monthly breakdown.</Tabs.Panel>
</Tabs>
```

### Primary

**Example**

```html
<div class="tabs tabs-boxed tabs-primary tabs-sm">
  <div class="tab-list" role="tablist">
    <input class="tab-input" type="radio" name="boxed-primary" id="boxed-primary-1" value="1" />
    <label class="tab" for="boxed-primary-1">Day</label>
    <input
      class="tab-input"
      type="radio"
      name="boxed-primary"
      id="boxed-primary-2"
      value="2"
      checked
    />
    <label class="tab" for="boxed-primary-2">Week</label>
    <input class="tab-input" type="radio" name="boxed-primary" id="boxed-primary-3" value="3" />
    <label class="tab" for="boxed-primary-3">Month</label>
  </div>
  <div class="tab-panel" data-value="1">Daily breakdown.</div>
  <div class="tab-panel" data-value="2">Weekly breakdown.</div>
  <div class="tab-panel" data-value="3">Monthly breakdown.</div>
</div>
```

```tsx
<Tabs defaultValue="week" variant="boxed" size="sm" primary>
  <Tabs.List>
    <Tabs.Tab value="day">Day</Tabs.Tab>
    <Tabs.Tab value="week">Week</Tabs.Tab>
    <Tabs.Tab value="month">Month</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="day">Daily breakdown.</Tabs.Panel>
  <Tabs.Panel value="week">Weekly breakdown.</Tabs.Panel>
  <Tabs.Panel value="month">Monthly breakdown.</Tabs.Panel>
</Tabs>
```

### Full width

**Example**

```html
<div class="tabs tabs-full-width">
  <div class="tab-list" role="tablist">
    <input class="tab-input" type="radio" name="full" id="full-1" value="1" checked />
    <label class="tab" for="full-1">Inbox</label>
    <input class="tab-input" type="radio" name="full" id="full-2" value="2" />
    <label class="tab" for="full-2">Archive</label>
    <input class="tab-input" type="radio" name="full" id="full-3" value="3" />
    <label class="tab" for="full-3">Spam</label>
  </div>
  <div class="tab-panel" data-value="1">Inbox content.</div>
  <div class="tab-panel" data-value="2">Archive content.</div>
  <div class="tab-panel" data-value="3">Spam content.</div>
</div>
```

```tsx
<Tabs defaultValue="inbox" fullWidth>
  <Tabs.List>
    <Tabs.Tab value="inbox">Inbox</Tabs.Tab>
    <Tabs.Tab value="archive">Archive</Tabs.Tab>
    <Tabs.Tab value="spam">Spam</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="inbox">Inbox content.</Tabs.Panel>
  <Tabs.Panel value="archive">Archive content.</Tabs.Panel>
  <Tabs.Panel value="spam">Spam content.</Tabs.Panel>
</Tabs>
```

### Full width, boxed

**Example**

```html
<div class="tabs tabs-boxed tabs-full-width">
  <div class="tab-list" role="tablist">
    <input class="tab-input" type="radio" name="boxed-full" id="boxed-full-1" value="1" />
    <label class="tab" for="boxed-full-1">Day</label>
    <input class="tab-input" type="radio" name="boxed-full" id="boxed-full-2" value="2" checked />
    <label class="tab" for="boxed-full-2">Week</label>
    <input class="tab-input" type="radio" name="boxed-full" id="boxed-full-3" value="3" />
    <label class="tab" for="boxed-full-3">Month</label>
  </div>
  <div class="tab-panel" data-value="1">Daily breakdown.</div>
  <div class="tab-panel" data-value="2">Weekly breakdown.</div>
  <div class="tab-panel" data-value="3">Monthly breakdown.</div>
</div>
```

```tsx
<Tabs defaultValue="week" variant="boxed" fullWidth>
  <Tabs.List>
    <Tabs.Tab value="day">Day</Tabs.Tab>
    <Tabs.Tab value="week">Week</Tabs.Tab>
    <Tabs.Tab value="month">Month</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="day">Daily breakdown.</Tabs.Panel>
  <Tabs.Panel value="week">Weekly breakdown.</Tabs.Panel>
  <Tabs.Panel value="month">Monthly breakdown.</Tabs.Panel>
</Tabs>
```

### Wrapping

**Example**

```html
<div style="max-width: 22rem">
  <div class="tabs tabs-boxed tabs-sm tabs-wrap">
    <div class="tab-list" role="tablist">
      <input class="tab-input" type="radio" name="wrap" id="wrap-1" value="1" checked />
      <label class="tab" for="wrap-1">1 click, 10s on page</label>
      <input class="tab-input" type="radio" name="wrap" id="wrap-2" value="2" />
      <label class="tab" for="wrap-2">0 clicks, 5s on page</label>
      <input class="tab-input" type="radio" name="wrap" id="wrap-3" value="3" />
      <label class="tab" for="wrap-3">1 click, no automatic popup</label>
    </div>
    <div class="tab-panel" data-value="1">Variant A.</div>
    <div class="tab-panel" data-value="2">Variant B.</div>
    <div class="tab-panel" data-value="3">Variant C.</div>
  </div>
</div>
```

```tsx
<div style={{ maxWidth: "22rem" }}>
  <Tabs defaultValue="a" variant="boxed" size="sm" wrap>
    <Tabs.List>
      <Tabs.Tab value="a">1 click, 10s on page</Tabs.Tab>
      <Tabs.Tab value="b">0 clicks, 5s on page</Tabs.Tab>
      <Tabs.Tab value="c">1 click, no automatic popup</Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel value="a">Variant A.</Tabs.Panel>
    <Tabs.Panel value="b">Variant B.</Tabs.Panel>
    <Tabs.Panel value="c">Variant C.</Tabs.Panel>
  </Tabs>
</div>
```

### With icons

**Example**

```html
<div class="tabs tabs-boxed tabs-sm">
  <div class="tab-list" role="tablist">
    <input class="tab-input" type="radio" name="icons" id="icons-1" value="1" checked />
    <label class="tab" for="icons-1"
      ><i class="ti ti-layout-grid" aria-hidden="true"></i> Grid</label
    >
    <input class="tab-input" type="radio" name="icons" id="icons-2" value="2" />
    <label class="tab" for="icons-2"><i class="ti ti-list" aria-hidden="true"></i> List</label>
    <input class="tab-input" type="radio" name="icons" id="icons-3" value="3" />
    <label class="tab" for="icons-3"
      ><i class="ti ti-chart-bar" aria-hidden="true"></i> Chart</label
    >
  </div>
  <div class="tab-panel" data-value="1">Grid view.</div>
  <div class="tab-panel" data-value="2">List view.</div>
  <div class="tab-panel" data-value="3">Chart view.</div>
</div>
```

```tsx
<Tabs defaultValue="grid" variant="boxed" size="sm">
  <Tabs.List>
    <Tabs.Tab value="grid" icon={IconLayoutGrid}>
      Grid
    </Tabs.Tab>
    <Tabs.Tab value="list" icon={IconList}>
      List
    </Tabs.Tab>
    <Tabs.Tab value="chart" icon={IconChartBar}>
      Chart
    </Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="grid">Grid view.</Tabs.Panel>
  <Tabs.Panel value="list">List view.</Tabs.Panel>
  <Tabs.Panel value="chart">Chart view.</Tabs.Panel>
</Tabs>
```

### Vertical orientation

**Example**

```html
<div class="tabs" data-orientation="vertical">
  <div class="tab-list" role="tablist">
    <input class="tab-input" type="radio" name="vertical" id="vertical-1" value="1" checked />
    <label class="tab" for="vertical-1">Profile</label>
    <input class="tab-input" type="radio" name="vertical" id="vertical-2" value="2" />
    <label class="tab" for="vertical-2">Account</label>
    <input class="tab-input" type="radio" name="vertical" id="vertical-3" value="3" />
    <label class="tab" for="vertical-3">Billing</label>
    <input class="tab-input" type="radio" name="vertical" id="vertical-4" value="4" />
    <label class="tab" for="vertical-4">API keys</label>
  </div>
  <div class="tab-panel" data-value="1">Profile settings.</div>
  <div class="tab-panel" data-value="2">Account settings.</div>
  <div class="tab-panel" data-value="3">Billing details.</div>
  <div class="tab-panel" data-value="4">Personal access tokens.</div>
</div>
```

```tsx
<Tabs defaultValue="profile" orientation="vertical">
  <Tabs.List>
    <Tabs.Tab value="profile">Profile</Tabs.Tab>
    <Tabs.Tab value="account">Account</Tabs.Tab>
    <Tabs.Tab value="billing">Billing</Tabs.Tab>
    <Tabs.Tab value="api">API keys</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="profile">Profile settings.</Tabs.Panel>
  <Tabs.Panel value="account">Account settings.</Tabs.Panel>
  <Tabs.Panel value="billing">Billing details.</Tabs.Panel>
  <Tabs.Panel value="api">Personal access tokens.</Tabs.Panel>
</Tabs>
```

## Reference

### React

| Part         | Renders    | Class       |
| ------------ | ---------- | ----------- |
| `Tabs`       | `<div>`    | `tabs`      |
| `Tabs.List`  | `<div>`    | `tab-list`  |
| `Tabs.Tab`   | `<button>` | `tab`       |
| `Tabs.Panel` | `<div>`    | `tab-panel` |

| Part       | Prop        | Type                                          | Default      |
| ---------- | ----------- | --------------------------------------------- | ------------ |
| `Tabs`     | `variant`   | `"bordered" \| "boxed"`                       | `"bordered"` |
| `Tabs`     | `size`      | `"sm" \| "md" \| "lg"`                        | `"md"`       |
| `Tabs`     | `fullWidth` | `boolean`                                     | `false`      |
| `Tabs`     | `wrap`      | `boolean`                                     | `false`      |
| `Tabs`     | `primary`   | `boolean`                                     | `false`      |
| `Tabs.Tab` | `icon`      | [`IconProp`](../basics/conventions.md#icons) | —            |

`primary` only affects `variant="boxed"`. Wraps [Base UI Tabs](https://base-ui.com/react/components/tabs), which owns `value` / `defaultValue` / `onValueChange` and `orientation`, and supplies the `role="tablist"` wiring plus arrow-key navigation. `Tabs.Tab` and `Tabs.Panel` are matched by `value`, which can be any string. Plus native `<div>` attributes.

Prefer React over the vanilla pattern past six panels — see below.

### Vanilla

| Class             | Effect                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------ |
| `tabs`            | Root column. Scopes every selector below, so a stray `class="tab"` elsewhere is unaffected |
| `tab-list`        | Tab row with a bottom border, `0.25rem` gap                                                |
| `tab`             | `2.25rem` tall, `0.75rem` side padding, `text-sm` medium, muted until selected             |
| `tab-panel`       | `0.75rem` of top padding; hidden unless its `data-value` matches the checked input         |
| `tab-input`       | The visually-hidden radio driving selection                                                |
| `tabs-boxed`      | Segmented control: bordered `0.375rem` box, muted fill, a thumb behind the active label    |
| `tabs-primary`    | Fills that thumb with the primary colour. Boxed only                                       |
| `tabs-full-width` | List spans the container, tabs share the row evenly                                        |
| `tabs-wrap`       | List flows onto new rows, each label staying on one line                                   |
| `tabs-sm`         | `1.75rem` tall tabs, `text-xs`                                                             |
| `tabs-lg`         | `2.75rem` tall tabs, `text-base`                                                           |

There is no `tabs-bordered` or `tabs-md` — both are the unmodified `tabs`. `data-orientation="vertical"` on the root turns the rail vertical, moving the border and the marker to the trailing edge.

Selection is a radio group: one `tab-input` per `tab` sharing a `name`, and `tab-panel[data-value]` matched to the input's `value` — so switching needs no JavaScript. The trade-off is a hard cap: the panel-matching rules are enumerated for values `1`–`6`, so a seventh panel never shows. Past six, use React.

Both variants share one marker mechanism: the selected tab becomes a CSS anchor and a single `tab-list` pseudo-element tracks it, which the browser interpolates — so the underline slides between tabs, and the boxed thumb slides behind the labels, with no extra DOM and no JavaScript in either bundle. Where [anchor positioning](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning) is missing, a per-tab fallback scales an underline in or crossfades the thumb instead. The slide is dropped under `prefers-reduced-motion: reduce`.

Write `role="tablist"` yourself; the label-and-radio pattern gives keyboard support for free but not the tab ARIA. Selected state is read from `[data-selected]`, `[aria-selected="true"]`, or a checked `tab-input`, so all three markup styles land on the same visuals.

`tabs-wrap` earns its place on variable-length free-text labels in a narrow container: without it, a boxed control squishes them to equal slivers.

For a group of independent toggles rather than a single choice, use a [button group](buttons.md#group).
