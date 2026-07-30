# Charts

> Pure-CSS bar, proportion, and donut primitives.

## Contents

- [Examples](#examples)
  - [Bar chart](#bar-chart)
  - [Bar chart, vertical](#bar-chart-vertical)
  - [Bar chart, variants](#bar-chart-variants)
  - [Proportion bar](#proportion-bar)
  - [Donut](#donut)
  - [Pie](#pie)
  - [Donut sizes](#donut-sizes)
  - [Inline](#inline)
  - [Per-series colours](#per-series-colours)
- [Reference](#reference)
  - [React](#react)
  - [Vanilla](#vanilla)

## Examples

### Bar chart

**Example**

```html
<div
  class="chart chart-bars chart-values"
  role="img"
  aria-label="Bar chart. Mon: 80, Tue: 52, Wed: 95."
  style="--chart-max: 95"
>
  <div class="chart-bar" style="--value: 80">
    <span class="chart-bar-label">Mon</span>
    <div class="chart-bar-track"><div class="chart-bar-fill" title="Mon: 80"></div></div>
    <span class="chart-bar-value">80</span>
  </div>
  <div class="chart-bar" style="--value: 52">
    <span class="chart-bar-label">Tue</span>
    <div class="chart-bar-track"><div class="chart-bar-fill" title="Tue: 52"></div></div>
    <span class="chart-bar-value">52</span>
  </div>
  <div class="chart-bar" style="--value: 95">
    <span class="chart-bar-label">Wed</span>
    <div class="chart-bar-track"><div class="chart-bar-fill" title="Wed: 95"></div></div>
    <span class="chart-bar-value">95</span>
  </div>
</div>
```

```tsx
<BarChart
  showValues
  data={[
    { label: "Mon", value: 80 },
    { label: "Tue", value: 52 },
    { label: "Wed", value: 95 },
  ]}
/>
```

### Bar chart, vertical

`orientation="vertical"` (`.chart-bars-vertical`) draws columns: value above, label below.

**Example**

```html
<div
  class="chart chart-bars chart-bars-vertical chart-values"
  role="img"
  aria-label="Bar chart. Mon: 80, Tue: 52, Wed: 95, Thu: 70."
  style="--chart-max: 95"
>
  <div class="chart-bar" style="--value: 80">
    <span class="chart-bar-value">80</span>
    <div class="chart-bar-track"><div class="chart-bar-fill" title="Mon: 80"></div></div>
    <span class="chart-bar-label">Mon</span>
  </div>
  <div class="chart-bar" style="--value: 52">
    <span class="chart-bar-value">52</span>
    <div class="chart-bar-track"><div class="chart-bar-fill" title="Tue: 52"></div></div>
    <span class="chart-bar-label">Tue</span>
  </div>
  <div class="chart-bar" style="--value: 95">
    <span class="chart-bar-value">95</span>
    <div class="chart-bar-track"><div class="chart-bar-fill" title="Wed: 95"></div></div>
    <span class="chart-bar-label">Wed</span>
  </div>
  <div class="chart-bar" style="--value: 70">
    <span class="chart-bar-value">70</span>
    <div class="chart-bar-track"><div class="chart-bar-fill" title="Thu: 70"></div></div>
    <span class="chart-bar-label">Thu</span>
  </div>
</div>
```

```tsx
<BarChart
  orientation="vertical"
  showValues
  data={[
    { label: "Mon", value: 80 },
    { label: "Tue", value: 52 },
    { label: "Wed", value: 95 },
    { label: "Thu", value: 70 },
  ]}
/>
```

### Bar chart, variants

A single-series chart defaults to `info` (`currentColor`, no class). `variant` recolours every bar: `success`, `warning`, or `danger`.

**Example**

```html
<div
  class="chart chart-bars"
  role="img"
  aria-label="Bar chart. 40, 70, 55."
  style="--chart-max: 70"
>
  <div class="chart-bar" style="--value: 40">
    <div class="chart-bar-track"><div class="chart-bar-fill" title="40"></div></div>
    <span class="chart-bar-value">40</span>
  </div>
  <div class="chart-bar" style="--value: 70">
    <div class="chart-bar-track"><div class="chart-bar-fill" title="70"></div></div>
    <span class="chart-bar-value">70</span>
  </div>
  <div class="chart-bar" style="--value: 55">
    <div class="chart-bar-track"><div class="chart-bar-fill" title="55"></div></div>
    <span class="chart-bar-value">55</span>
  </div>
</div>
<div
  class="chart chart-bars chart-success"
  role="img"
  aria-label="Bar chart. 40, 70, 55."
  style="--chart-max: 70"
>
  <div class="chart-bar" style="--value: 40">
    <div class="chart-bar-track"><div class="chart-bar-fill" title="40"></div></div>
    <span class="chart-bar-value">40</span>
  </div>
  <div class="chart-bar" style="--value: 70">
    <div class="chart-bar-track"><div class="chart-bar-fill" title="70"></div></div>
    <span class="chart-bar-value">70</span>
  </div>
  <div class="chart-bar" style="--value: 55">
    <div class="chart-bar-track"><div class="chart-bar-fill" title="55"></div></div>
    <span class="chart-bar-value">55</span>
  </div>
</div>
<div
  class="chart chart-bars chart-danger"
  role="img"
  aria-label="Bar chart. 40, 70, 55."
  style="--chart-max: 70"
>
  <div class="chart-bar" style="--value: 40">
    <div class="chart-bar-track"><div class="chart-bar-fill" title="40"></div></div>
    <span class="chart-bar-value">40</span>
  </div>
  <div class="chart-bar" style="--value: 70">
    <div class="chart-bar-track"><div class="chart-bar-fill" title="70"></div></div>
    <span class="chart-bar-value">70</span>
  </div>
  <div class="chart-bar" style="--value: 55">
    <div class="chart-bar-track"><div class="chart-bar-fill" title="55"></div></div>
    <span class="chart-bar-value">55</span>
  </div>
</div>
```

```tsx
<BarChart showValues data={[{ value: 40 }, { value: 70 }, { value: 55 }]} />
<BarChart showValues variant="success" data={[{ value: 40 }, { value: 70 }, { value: 55 }]} />
<BarChart showValues variant="danger" data={[{ value: 40 }, { value: 70 }, { value: 55 }]} />
```

### Proportion bar

**Example**

```html
<div class="chart" role="img" aria-label="Proportion bar. Done: 60, Pending: 30, Failed: 10.">
  <div class="chart-stack">
    <div
      class="chart-segment"
      style="--value: 60; --segment-color: var(--color-blue-500)"
      title="Done: 60"
    ></div>
    <div
      class="chart-segment"
      style="--value: 30; --segment-color: var(--color-orange-400)"
      title="Pending: 30"
    ></div>
    <div
      class="chart-segment"
      style="--value: 10; --segment-color: var(--color-green-500)"
      title="Failed: 10"
    ></div>
  </div>
  <ul class="chart-legend">
    <li class="chart-legend-item" style="--legend-color: var(--color-blue-500)" title="Done: 60">
      Done
    </li>
    <li
      class="chart-legend-item"
      style="--legend-color: var(--color-orange-400)"
      title="Pending: 30"
    >
      Pending
    </li>
    <li class="chart-legend-item" style="--legend-color: var(--color-green-500)" title="Failed: 10">
      Failed
    </li>
  </ul>
</div>
```

```tsx
<StackedBar
  legend
  data={[
    { label: "Done", value: 60 },
    { label: "Pending", value: 30 },
    { label: "Failed", value: 10 },
  ]}
/>
```

### Donut

A `conic-gradient` ring with the centre masked out. React builds the cumulative stop string from `data`; a vanilla author writes it. `centerLabel` overlays a total, `legend` renders the key. Per-slice read-outs live on the legend rows — a gradient slice has no element to carry a `title`.

**Example**

```html
<div class="chart" role="img" aria-label="Donut chart. A: 50, B: 30, C: 20.">
  <div class="chart-donut-figure">
    <div
      class="chart-donut"
      style="--donut-segments: var(--color-blue-500) 0deg 180deg, var(--color-orange-400) 180deg 288deg, var(--color-green-500) 288deg 360deg"
    ></div>
    <div class="chart-donut-center">100</div>
  </div>
  <ul class="chart-legend">
    <li class="chart-legend-item" style="--legend-color: var(--color-blue-500)" title="A: 50">A</li>
    <li class="chart-legend-item" style="--legend-color: var(--color-orange-400)" title="B: 30">
      B
    </li>
    <li class="chart-legend-item" style="--legend-color: var(--color-green-500)" title="C: 20">
      C
    </li>
  </ul>
</div>
```

```tsx
<Donut
  legend
  centerLabel="100"
  data={[
    { label: "A", value: 50 },
    { label: "B", value: 30 },
    { label: "C", value: 20 },
  ]}
/>
```

### Pie

`pie` (`.chart-donut-pie`) fills the centre hole.

**Example**

```html
<div class="chart" role="img" aria-label="Pie chart. A: 50, B: 30, C: 20.">
  <div class="chart-donut-figure">
    <div
      class="chart-donut chart-donut-pie"
      style="--donut-segments: var(--color-blue-500) 0deg 180deg, var(--color-orange-400) 180deg 288deg, var(--color-green-500) 288deg 360deg"
    ></div>
  </div>
</div>
```

```tsx
<Donut
  pie
  data={[
    { label: "A", value: 50 },
    { label: "B", value: 30 },
    { label: "C", value: 20 },
  ]}
/>
```

### Donut sizes

`size="sm"` / `size="lg"` (`.chart-sm` / `.chart-lg`) remap the diameter; override `--chart-size` for anything in between.

**Example**

```html
<div class="chart" role="img" aria-label="Donut chart. A: 60, B: 40.">
  <div class="chart-donut-figure chart-sm">
    <div
      class="chart-donut"
      style="--donut-segments: var(--color-blue-500) 0deg 216deg, var(--color-orange-400) 216deg 360deg"
    ></div>
  </div>
</div>
<div class="chart" role="img" aria-label="Donut chart. A: 60, B: 40.">
  <div class="chart-donut-figure">
    <div
      class="chart-donut"
      style="--donut-segments: var(--color-blue-500) 0deg 216deg, var(--color-orange-400) 216deg 360deg"
    ></div>
  </div>
</div>
<div class="chart" role="img" aria-label="Donut chart. A: 60, B: 40.">
  <div class="chart-donut-figure chart-lg">
    <div
      class="chart-donut"
      style="--donut-segments: var(--color-blue-500) 0deg 216deg, var(--color-orange-400) 216deg 360deg"
    ></div>
  </div>
</div>
```

```tsx
<Donut size="sm" data={[{ label: "A", value: 60 }, { label: "B", value: 40 }]} />
<Donut data={[{ label: "A", value: 60 }, { label: "B", value: 40 }]} />
<Donut size="lg" data={[{ label: "A", value: 60 }, { label: "B", value: 40 }]} />
```

### Inline

`inline` (`.chart-inline`) sizes the chart in `em` and aligns it to the text baseline.

**Example**

```html
<div class="chart chart-inline" role="img" aria-label="Proportion bar. Used: 72, Free: 28.">
  <div class="chart-stack">
    <div
      class="chart-segment"
      style="--value: 72; --segment-color: var(--color-blue-500)"
      title="Used: 72"
    ></div>
    <div
      class="chart-segment"
      style="--value: 28; --segment-color: var(--color-orange-400)"
      title="Free: 28"
    ></div>
  </div>
</div>
```

```tsx
<StackedBar
  inline
  data={[
    { label: "Used", value: 72 },
    { label: "Free", value: 28 },
  ]}
/>
```

### Per-series colours

**Example**

```html
<div
  class="chart chart-bars chart-values"
  role="img"
  aria-label="Bar chart. A: 30, B: 50, C: 20."
  style="--chart-max: 50"
>
  <div class="chart-bar" style="--value: 30; --bar-color: var(--color-blue-500)">
    <span class="chart-bar-label">A</span>
    <div class="chart-bar-track"><div class="chart-bar-fill" title="A: 30"></div></div>
    <span class="chart-bar-value">30</span>
  </div>
  <div class="chart-bar" style="--value: 50; --bar-color: var(--color-green-500)">
    <span class="chart-bar-label">B</span>
    <div class="chart-bar-track"><div class="chart-bar-fill" title="B: 50"></div></div>
    <span class="chart-bar-value">50</span>
  </div>
  <div class="chart-bar" style="--value: 20; --bar-color: var(--color-orange-400)">
    <span class="chart-bar-label">C</span>
    <div class="chart-bar-track"><div class="chart-bar-fill" title="C: 20"></div></div>
    <span class="chart-bar-value">20</span>
  </div>
</div>
```

```tsx
<BarChart
  showValues
  data={[
    { label: "A", value: 30, color: "var(--color-blue-500)" },
    { label: "B", value: 50, color: "var(--color-green-500)" },
    { label: "C", value: 20, color: "var(--color-orange-400)" },
  ]}
/>
```

**Caution** — A chart is unreadable to a screen reader without a text summary. Each root needs `role="img"` and an `aria-label` restating the data — React generates one, vanilla does not.

## Reference

### React

| Part                 | Renders | Class                                |
| -------------------- | ------- | ------------------------------------ |
| `BarChart`           | `<div>` | `chart`, `chart-bars`                |
| `BarChart.Container` | `<div>` | `chart`, `chart-bars`                |
| `BarChart.Bar`       | `<div>` | `chart-bar` + label/track/fill/value |
| `StackedBar`         | `<div>` | `chart`                              |
| `StackedBar.Track`   | `<div>` | `chart-stack`                        |
| `StackedBar.Segment` | `<div>` | `chart-segment`                      |
| `Donut`              | `<div>` | `chart`                              |
| `Donut.Figure`       | `<div>` | `chart-donut-figure`                 |
| `Donut.Ring`         | `<div>` | `chart-donut`                        |
| `Donut.Center`       | `<div>` | `chart-donut-center`                 |
| `Donut.Legend`       | `<ul>`  | `chart-legend`                       |

`StackedBar.Legend` is the same component as `Donut.Legend`.

| Component    | Prop          | Type                                           | Default        |
| ------------ | ------------- | ---------------------------------------------- | -------------- |
| `BarChart`   | `data`        | `ChartDatum[]`                                 | — (required)   |
| `BarChart`   | `max`         | `number`                                       | largest value  |
| `BarChart`   | `orientation` | `"horizontal" \| "vertical"`                   | `"horizontal"` |
| `BarChart`   | `size`        | `"sm" \| "md" \| "lg"`                         | `"md"`         |
| `BarChart`   | `showValues`  | `boolean`                                      | `false`        |
| `BarChart`   | `inline`      | `boolean`                                      | `false`        |
| `BarChart`   | `variant`     | `"info" \| "success" \| "warning" \| "danger"` | `"info"`       |
| `StackedBar` | `data`        | `ChartDatum[]`                                 | — (required)   |
| `StackedBar` | `legend`      | `boolean`                                      | `false`        |
| `StackedBar` | `inline`      | `boolean`                                      | `false`        |
| `Donut`      | `data`        | `ChartDatum[]`                                 | — (required)   |
| `Donut`      | `size`        | `"sm" \| "md" \| "lg"`                         | `"md"`         |
| `Donut`      | `thickness`   | `string`                                       | `"33%"`        |
| `Donut`      | `pie`         | `boolean`                                      | `false`        |
| `Donut`      | `centerLabel` | `ReactNode`                                    | —              |
| `Donut`      | `legend`      | `boolean`                                      | `false`        |
| `Donut`      | `inline`      | `boolean`                                      | `false`        |

A `ChartDatum` is `{ value, label?, color? }`. `value` is the magnitude — normalised against the chart max for bars, summed for a donut or stack. `label` renders the category and feeds the generated `aria-label`; `color` overrides that datum's colour. `thickness` is ignored when `pie` is set.

Each root gets `role="img"` and an `aria-label` built from the data (`"Bar chart. Mon: 80, Tue: 52."`); pass your own `aria-label` to replace it. Bars and segments also carry a native `title` for a hover read-out. Plus native `<div>` attributes.

`BarChart.Container` and the per-part components are the escape hatch for composing bars by hand — see the [`.Container` convention](../basics/conventions.md#container-escape-hatch).

### Vanilla

| Class / var                                    | Effect                                                                          |
| ---------------------------------------------- | ------------------------------------------------------------------------------- |
| `chart`                                        | Root. Sets the defaults every chart reads and colours the series `info`         |
| `chart-success` `chart-warning` `chart-danger` | Recolours a single series                                                       |
| `chart-bars`                                   | Horizontal bar grid: label gutter, `1fr` track, trailing value column           |
| `chart-bars-vertical`                          | Columns in a `--chart-height` box instead, labels beneath                       |
| `chart-bar`                                    | One bar. Carries `--value`; a subgrid row, so columns align across bars         |
| `chart-bar-label`                              | Category label, `text-xs` muted. Its column collapses when no bar has one       |
| `chart-bar-track`                              | The bar's rail, which gives the fill a definite length to animate against       |
| `chart-bar-fill`                               | `0.75rem` fill sized `--value / --chart-max`, `2px` radius, `200ms` transition  |
| `chart-bar-value`                              | Trailing value, tabular figures. Hidden unless the root has `chart-values`      |
| `chart-values`                                 | Shows the value column                                                          |
| `chart-stack`                                  | Proportion bar: `0.75rem` pill on `surface-strong`, clipped                     |
| `chart-segment`                                | One share, `flex-grow: var(--value)`, hairline-separated from the previous      |
| `chart-donut-figure`                           | Square box sized `--chart-size`, centring the ring and its overlay              |
| `chart-donut`                                  | Conic-gradient ring from `--donut-segments`, centre punched out by a mask       |
| `chart-donut-pie`                              | Solid pie — sets the ring width to `50%`                                        |
| `chart-donut-center`                           | Centred overlay label, `text-sm` semibold tabular                               |
| `chart-legend`                                 | Wrapping `text-xs` muted list, marker-less                                      |
| `chart-legend-item`                            | One entry with a `0.625rem` swatch from `--legend-color`                        |
| `chart-inline`                                 | Micro-viz for a table cell: `em`-relative, `6em` wide track                     |
| `chart-sm` `chart-lg`                          | Steps `--chart-height` and `--chart-size` to `4rem` / `12rem`                   |
| `--value`                                      | A bar's or segment's magnitude. Required on each                                |
| `--chart-max`                                  | The 100% reference for bars. Defaults to `100`                                  |
| `--chart-height`                               | Vertical bar box height: `8rem`, or `4rem` / `12rem` at `chart-sm` / `chart-lg` |
| `--chart-size`                                 | Donut diameter, same scale as `--chart-height`                                  |
| `--chart-gap`                                  | Space between bars, `0.25rem`                                                   |
| `--bar-color`                                  | One bar's fill. Defaults to `currentColor`                                      |
| `--segment-color`                              | One stack segment's fill                                                        |
| `--legend-color`                               | One legend swatch's fill                                                        |
| `--donut-segments`                             | The ring's pre-built cumulative `conic-gradient` stop string                    |
| `--donut-thickness`                            | Ring width as a % of the diameter, `33%`. `50%` is a solid pie                  |

There is no `chart-info` or `chart-md` — both are the unmodified `chart`.

Values arrive as inline custom properties rather than `data-` attributes because CSS can't read an attribute as a number for `calc()`. That is also why `--donut-segments` is a pre-built stop string: CSS can't sum a variable-length list of siblings, so the cumulative percentages have to be computed before they reach the style attribute. The fill transitions the _resolved_ length, not `--value`, since an unregistered custom property doesn't animate; transitions are dropped under `prefers-reduced-motion: reduce`.

There is no chart token layer. A single series rides `currentColor`; multi-series charts take colours inline. React cycles this `SERIES` sequence of existing palette tokens — copy it verbatim so both bundles render identically:

```css
var(--color-blue-500)
var(--color-orange-400)
var(--color-green-500)
var(--color-purple-400)
var(--color-cyan-500)
var(--color-magenta-400)
var(--color-yellow-500)
var(--color-red-400)
```

The donut's centre label has to be a _sibling_ overlay inside `chart-donut-figure`, never a child of the ring — `mask` clips the whole subtree.

Write `role="img"` and the `aria-label` yourself in vanilla, and add a `title` on each bar or segment for the hover read-out.

These are primitives: no axes, ticks, gridlines, or tooltips. Reach for a real charting library when the chart is the analysis rather than a glance.
