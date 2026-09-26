# Colors

> Color tokens — brand, surfaces, borders, text, and state.

## Contents

- [Semantic tokens](#semantic-tokens)
- [Categorical](#categorical)
- [Palette](#palette)

The palette is [Flexoki](https://stephango.com/flexoki). The system layers it as palette tones (`--color-blue-600`, `--color-base-50`, …) and semantic aliases that point at them (`--color-primary`, `--color-surface`, …) — see [Principles › Two-layer tokens](principles.md#two-layer-tokens).

Override either layer to reskin the system — see [Theming](theming.md).

## Semantic tokens

Primary and the state families (danger, success, warning, info) share a four-slot layout: **Base**, **Hover**, **Muted** (low-saturation background for tinted surfaces), and **Content** (text/icons on top of the base). Text, Surface, Border, Link, and Focus use lighter scales.

**Primary** — High-contrast neutral (ink). Used by solid primary buttons, badges, and selected states. Inverts with the mode — near-black on light, near-white on dark.

- Base — `--color-primary`
- Hover — `--color-primary-hover`
- Muted — `--color-primary-muted`
- Content — `--color-primary-content`

**Link** — Text-link color. Separate from Info so links can be retinted independently.

- Base — `--color-link`
- Hover — `--color-link-hover`

**Focus** — Focus-ring color for every interactive component.

- Base — `--color-focus`

**Text** — Foreground content on neutral surfaces.

- Base — `--color-text`
- Muted — `--color-text-muted`

**Surface** — Page and component backgrounds, lightest to strongest. Hover and Stripe are translucent washes over whatever surface is below.

- Base — `--color-surface`
- Muted — `--color-surface-muted`
- Strong — `--color-surface-strong`
- Hover — `--color-surface-hover`
- Stripe — `--color-surface-stripe`

**Code** — Neutral surface and text for <pre>-style output blocks — logs, JSON, LLM output.

- Base — `--color-code-surface`
- Content — `--color-code-text`

**Danger** — Destructive actions and error states.

- Base — `--color-danger`
- Hover — `--color-danger-hover`
- Muted — `--color-danger-muted`
- Content — `--color-danger-content`

**Success** — Confirmation and positive outcomes.

- Base — `--color-success`
- Hover — `--color-success-hover`
- Muted — `--color-success-muted`
- Content — `--color-success-content`

**Warning** — Caution and non-blocking issues. Base and Content stay fixed — bright yellow with dark text in both modes; only Hover and Muted invert. That's why tinted card/stat-card surfaces skip the warning variant.

- Base — `--color-warning`
- Hover — `--color-warning-hover`
- Muted — `--color-warning-muted`
- Content — `--color-warning-content`

**Info** — Neutral notifications and helper hints.

- Base — `--color-info`
- Hover — `--color-info-hover`
- Muted — `--color-info-muted`
- Content — `--color-info-content`

**Border** — Dividers and outlines.

- Base — `--color-border`
- Strong — `--color-border-strong`

## Categorical

For colour-coding kinds of thing, such as event types or chart series, where the colour names a category and not a state. Each hue reads as text on `surface`, `surface-muted` and its own muted tint at 4.5:1 in both modes. Utilities: `text-category-<hue>`, `bg-category-<hue>`, `border-category-<hue>`, and the same with `-muted`.

**Categorical** — Text and marks for a category.

- Red — `--color-category-red`
- Orange — `--color-category-orange`
- Yellow — `--color-category-yellow`
- Green — `--color-category-green`
- Cyan — `--color-category-cyan`
- Blue — `--color-category-blue`
- Purple — `--color-category-purple`
- Magenta — `--color-category-magenta`

**Categorical muted** — Tinted fills behind a category's text.

- Red — `--color-category-red-muted`
- Orange — `--color-category-orange-muted`
- Yellow — `--color-category-yellow-muted`
- Green — `--color-category-green-muted`
- Cyan — `--color-category-cyan-muted`
- Blue — `--color-category-blue-muted`
- Purple — `--color-category-purple-muted`
- Magenta — `--color-category-magenta-muted`

**Example**

```html
<p class="flex flex-wrap gap-4 text-sm">
  <span class="text-category-blue"
    ><i class="ti ti-shopping-cart" aria-hidden="true"></i> Add to cart</span
  >
  <span class="text-category-green"
    ><i class="ti ti-credit-card" aria-hidden="true"></i> Order</span
  >
  <span class="text-category-purple"><i class="ti ti-search" aria-hidden="true"></i> Search</span>
  <span class="rounded-sm bg-category-orange-muted px-1.5 text-category-orange">Campaign</span>
</p>
```

## Palette

Every Flexoki tone is a utility class and CSS variable. Tones run light→dark from `50` to `950`; the base ramp adds `paper` at the light end and `black` at the dark end.

**Base**

- paper — `--color-paper`
- 50 — `--color-base-50`
- 100 — `--color-base-100`
- 150 — `--color-base-150`
- 200 — `--color-base-200`
- 300 — `--color-base-300`
- 400 — `--color-base-400`
- 500 — `--color-base-500`
- 600 — `--color-base-600`
- 700 — `--color-base-700`
- 800 — `--color-base-800`
- 850 — `--color-base-850`
- 900 — `--color-base-900`
- 950 — `--color-base-950`
- black — `--color-black`

**Red**

- 50 — `--color-red-50`
- 100 — `--color-red-100`
- 150 — `--color-red-150`
- 200 — `--color-red-200`
- 300 — `--color-red-300`
- 400 — `--color-red-400`
- 500 — `--color-red-500`
- 600 — `--color-red-600`
- 700 — `--color-red-700`
- 800 — `--color-red-800`
- 850 — `--color-red-850`
- 900 — `--color-red-900`
- 950 — `--color-red-950`

**Orange**

- 50 — `--color-orange-50`
- 100 — `--color-orange-100`
- 150 — `--color-orange-150`
- 200 — `--color-orange-200`
- 300 — `--color-orange-300`
- 400 — `--color-orange-400`
- 500 — `--color-orange-500`
- 600 — `--color-orange-600`
- 700 — `--color-orange-700`
- 800 — `--color-orange-800`
- 850 — `--color-orange-850`
- 900 — `--color-orange-900`
- 950 — `--color-orange-950`

**Yellow**

- 50 — `--color-yellow-50`
- 100 — `--color-yellow-100`
- 150 — `--color-yellow-150`
- 200 — `--color-yellow-200`
- 300 — `--color-yellow-300`
- 400 — `--color-yellow-400`
- 500 — `--color-yellow-500`
- 600 — `--color-yellow-600`
- 700 — `--color-yellow-700`
- 800 — `--color-yellow-800`
- 850 — `--color-yellow-850`
- 900 — `--color-yellow-900`
- 950 — `--color-yellow-950`

**Green**

- 50 — `--color-green-50`
- 100 — `--color-green-100`
- 150 — `--color-green-150`
- 200 — `--color-green-200`
- 300 — `--color-green-300`
- 400 — `--color-green-400`
- 500 — `--color-green-500`
- 600 — `--color-green-600`
- 700 — `--color-green-700`
- 800 — `--color-green-800`
- 850 — `--color-green-850`
- 900 — `--color-green-900`
- 950 — `--color-green-950`

**Cyan**

- 50 — `--color-cyan-50`
- 100 — `--color-cyan-100`
- 150 — `--color-cyan-150`
- 200 — `--color-cyan-200`
- 300 — `--color-cyan-300`
- 400 — `--color-cyan-400`
- 500 — `--color-cyan-500`
- 600 — `--color-cyan-600`
- 700 — `--color-cyan-700`
- 800 — `--color-cyan-800`
- 850 — `--color-cyan-850`
- 900 — `--color-cyan-900`
- 950 — `--color-cyan-950`

**Blue**

- 50 — `--color-blue-50`
- 100 — `--color-blue-100`
- 150 — `--color-blue-150`
- 200 — `--color-blue-200`
- 300 — `--color-blue-300`
- 400 — `--color-blue-400`
- 500 — `--color-blue-500`
- 600 — `--color-blue-600`
- 700 — `--color-blue-700`
- 800 — `--color-blue-800`
- 850 — `--color-blue-850`
- 900 — `--color-blue-900`
- 950 — `--color-blue-950`

**Purple**

- 50 — `--color-purple-50`
- 100 — `--color-purple-100`
- 150 — `--color-purple-150`
- 200 — `--color-purple-200`
- 300 — `--color-purple-300`
- 400 — `--color-purple-400`
- 500 — `--color-purple-500`
- 600 — `--color-purple-600`
- 700 — `--color-purple-700`
- 800 — `--color-purple-800`
- 850 — `--color-purple-850`
- 900 — `--color-purple-900`
- 950 — `--color-purple-950`

**Magenta**

- 50 — `--color-magenta-50`
- 100 — `--color-magenta-100`
- 150 — `--color-magenta-150`
- 200 — `--color-magenta-200`
- 300 — `--color-magenta-300`
- 400 — `--color-magenta-400`
- 500 — `--color-magenta-500`
- 600 — `--color-magenta-600`
- 700 — `--color-magenta-700`
- 800 — `--color-magenta-800`
- 850 — `--color-magenta-850`
- 900 — `--color-magenta-900`
- 950 — `--color-magenta-950`
