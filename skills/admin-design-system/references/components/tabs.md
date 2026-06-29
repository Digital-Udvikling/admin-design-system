# Tabs

> Section a view into named panels.

## Contents

- [Examples](#examples)
  - [Basic (bordered)](#basic-bordered)
  - [Boxed (segmented control)](#boxed-segmented-control)
  - [Primary](#primary)
  - [Full width](#full-width)
  - [Wrapping](#wrapping)
  - [With icons](#with-icons)
  - [Vertical orientation](#vertical-orientation)

Vanilla tabs are radio-input driven, so switching works without JavaScript, but they cap at 6 panels. React adds ARIA semantics, arrow-key navigation, and controlled state; use it for more than 6 panels.

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

The active thumb is anchored to the selected tab via [CSS anchor positioning](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning). Browsers without anchor positioning crossfade the highlight instead.

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

`tabs-primary` (React `primary`) fills the active segment with the primary color. Only affects the boxed variant.

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

`fullWidth` stretches the list across the container and divides space evenly between tabs. Composes with both variants.

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

Pair `fullWidth` with `variant="boxed"` for a full-width segmented control.

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

`wrap` lets the list flow onto new rows instead of overflowing, keeping each tab's label on one line. Use it for variable-length, free-text labels in a narrow container; without it a `boxed` segmented control squishes labels to equal slivers.

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

Pass `icon` to `Tabs.Tab` for a leading glyph, rendered at the label size. See [Icons](../basics/icons.md).

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
