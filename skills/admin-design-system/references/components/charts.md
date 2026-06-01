# Charts

> Pure-CSS bar, proportion, and donut primitives.

Three JS-free primitives for dashboards and inline micro-viz. No axes, ticks, or gridlines — for analytical charts reach for a dedicated library. Data is driven by inline custom properties (never `data-*`): a bar's `--value` over the container's `--chart-max`, a segment's `flex: var(--value)`, a donut's cumulative `conic-gradient` string. In React the `data` prop fills them in.

## Bar chart

Horizontal by default — category labels sit in a left gutter, values in an aligned trailing column. `--chart-max` defaults to the largest value; React computes it. Add `showValues` for the value column.

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

### Vertical

`orientation="vertical"` (`.chart-bars-vertical`) draws columns growing from the floor — the value sits above, the label below. Use it for trend-shaped data.

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

### Variants

A single-series chart follows `currentColor`. `variant` recolours every bar — `success`, `warning`, `danger`, `info`.

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

## Proportion bar

A single track split by flex ratios — the "60% / 30% / 10%" breakdown. Multi-series by default: segments take colours from the [palette sequence](#colors). `legend` renders the key.

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

## Donut

A `conic-gradient` ring with the centre masked out. React builds the cumulative stop string from `data`; a vanilla author writes it (degrees accumulate, `var(--color-*)` from the [sequence](#colors)). `centerLabel` overlays a total, `legend` renders the key. Per-slice read-outs live on the legend rows — a gradient slice has no element to carry a `title`.

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

`pie` (`.chart-donut-pie`) fills the hole for a solid pie.

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

### Sizes

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

## Inline

`inline` (`.chart-inline`) sizes the chart in `em` and aligns it to the text baseline — drop it into a table cell or a sentence next to a number.

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

## Colors

There is no chart token layer. A single-series bar chart follows `currentColor` (`--color-primary`, recoloured by `variant`). Multi-series charts (donut, stacked bar, or per-bar colours) take colours inline. React cycles this `SERIES` sequence of existing palette tokens; copy it verbatim in vanilla so both render identically:

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

Override per element: `--bar-color` on a bar, `--segment-color` on a stack segment, `--legend-color` on a legend item, or the colour baked into the donut's `conic-gradient` string. In React, set `color` on a datum.

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

## Accessibility

Each chart root is `role="img"` with an `aria-label` summarising the data. React generates it (`"Bar chart. Mon: 80, Tue: 52."`); pass your own `aria-label` to override, and write one by hand in vanilla. Bars and stack segments also carry a native `title` for a hover read-out.
