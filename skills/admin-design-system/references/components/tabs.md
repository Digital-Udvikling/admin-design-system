# Tabs

> Section a view into named panels.

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
