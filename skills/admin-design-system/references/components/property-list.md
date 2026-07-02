# Property list

> Label-and-value rows for one-entity-N-attributes panels.

## Contents

- [Examples](#examples)
  - [Basic](#basic)
  - [Striped](#striped)
  - [Copyable (React only)](#copyable-react-only)
  - [Numeric column](#numeric-column)
  - [Empty values](#empty-values)
  - [Rich value](#rich-value)
  - [Compact density](#compact-density)
  - [Subpart escape hatch](#subpart-escape-hatch)

A `<dl>` with a label column that aligns across every row. Use it for summary panels, identifier strips, metadata blocks. See [Table](tables.md) for tabular/multi-row data.

## Examples

### Basic

Each row is a label–value pair via shorthand props on `<PropertyList.Item>`.

**Example**

```html
<section class="property-list">
  <h3 class="property-list-title">Status & ansvar</h3>
  <dl class="property-list-items">
    <dt class="property-list-label">Lifecyklus</dt>
    <dd class="property-list-value">A</dd>
    <dt class="property-list-label">Status</dt>
    <dd class="property-list-value">20</dd>
    <dt class="property-list-label">Auto-oprettet</dt>
    <dd class="property-list-value">Nej</dd>
    <dt class="property-list-label">Vareansvarlig</dt>
    <dd class="property-list-value">LUI</dd>
  </dl>
</section>
```

```tsx
<PropertyList title="Status & ansvar">
  <PropertyList.Item label="Lifecyklus" value="A" />
  <PropertyList.Item label="Status" value="20" />
  <PropertyList.Item label="Auto-oprettet" value="Nej" />
  <PropertyList.Item label="Vareansvarlig" value="LUI" />
</PropertyList>
```

### Striped

**Example**

```html
<section class="property-list property-list-striped">
  <dl class="property-list-items">
    <dt class="property-list-label">Varenummer</dt>
    <dd class="property-list-value">745325250</dd>
    <dt class="property-list-label">EAN-nummer</dt>
    <dd class="property-list-value">4005176923197</dd>
    <dt class="property-list-label">Leverandørnummer</dt>
    <dd class="property-list-value">SUP-00123</dd>
    <dt class="property-list-label">Lager (CL)</dt>
    <dd class="property-list-value">248</dd>
  </dl>
</section>
```

```tsx
<PropertyList striped>
  <PropertyList.Item label="Varenummer" value="745325250" />
  <PropertyList.Item label="EAN-nummer" value="4005176923197" />
  <PropertyList.Item label="Leverandørnummer" value="SUP-00123" />
  <PropertyList.Item label="Lager (CL)" value="248" />
</PropertyList>
```

### Copyable (React only)

`copyable` on an item reveals a copy button on its value cell on hover or focus; clicking anywhere in the cell copies and confirms with a check for ~1.2s. Text selection and links inside the value still work. Opt in row-by-row.

**Example**

```tsx
<PropertyList>
  <PropertyList.Item label="Varenummer" value="745325250" copyable />
  <PropertyList.Item label="EAN-nummer" value="4005176923197" copyable />
  <PropertyList.Item label="Leverandørnummer" value="SUP-00123" copyable />
</PropertyList>
```

### Numeric column

`numeric` right-aligns the value. Same convention as `<Table.Cell numeric>`.

**Example**

```html
<section class="property-list">
  <dl class="property-list-items">
    <dt class="property-list-label">Lager (CL)</dt>
    <dd class="property-list-value">248</dd>
    <dt class="property-list-label">Indkøbspris</dt>
    <dd class="property-list-value property-list-value-numeric">42,50 kr</dd>
    <dt class="property-list-label">Vejl. udsalgspris</dt>
    <dd class="property-list-value property-list-value-numeric">129,00 kr</dd>
  </dl>
</section>
```

```tsx
<PropertyList>
  <PropertyList.Item label="Lager (CL)" value="248" />
  <PropertyList.Item label="Indkøbspris" value="42,50 kr" numeric />
  <PropertyList.Item label="Vejl. udsalgspris" value="129,00 kr" numeric />
</PropertyList>
```

### Empty values

Null, undefined, or empty `value` renders an em-dash. Rows never auto-hide. To collapse a section whose every value is missing, pass `hideIfAllEmpty` on the list.

**Example**

```html
<section class="property-list">
  <dl class="property-list-items">
    <dt class="property-list-label">Leverandørnummer</dt>
    <dd class="property-list-value">SUP-00123</dd>
    <dt class="property-list-label">Reol</dt>
    <dd class="property-list-value property-list-value-empty">—</dd>
    <dt class="property-list-label">Hyldemeter</dt>
    <dd class="property-list-value property-list-value-empty">—</dd>
  </dl>
</section>
```

```tsx
<PropertyList>
  <PropertyList.Item label="Leverandørnummer" value="SUP-00123" />
  <PropertyList.Item label="Reol" value={null} />
  <PropertyList.Item label="Hyldemeter" value="" />
</PropertyList>
```

### Rich value

Pass JSX to the shorthand `value` prop for badges, links, or inline icons.

**Example**

```html
<section class="property-list">
  <dl class="property-list-items">
    <dt class="property-list-label">Status</dt>
    <dd class="property-list-value">
      <span class="badge badge-success">A — Active</span>
    </dd>
    <dt class="property-list-label">Leverandør</dt>
    <dd class="property-list-value"><a href="#">Acme A/S</a></dd>
  </dl>
</section>
```

```tsx
<PropertyList>
  <PropertyList.Item label="Status" value={<Badge variant="success">A — Active</Badge>} />
  <PropertyList.Item label="Leverandør" value={<a href="#">Acme A/S</a>} />
</PropertyList>
```

### Compact density

`compact` tightens rows for sidebar info blocks or panels with many short attributes.

**Example**

```html
<section class="property-list property-list-compact">
  <dl class="property-list-items">
    <dt class="property-list-label">Lifecyklus</dt>
    <dd class="property-list-value">A</dd>
    <dt class="property-list-label">Status</dt>
    <dd class="property-list-value">20</dd>
    <dt class="property-list-label">Auto-oprettet</dt>
    <dd class="property-list-value">Nej</dd>
    <dt class="property-list-label">Vareansvarlig</dt>
    <dd class="property-list-value">LUI</dd>
  </dl>
</section>
```

```tsx
<PropertyList compact>
  <PropertyList.Item label="Lifecyklus" value="A" />
  <PropertyList.Item label="Status" value="20" />
  <PropertyList.Item label="Auto-oprettet" value="Nej" />
  <PropertyList.Item label="Vareansvarlig" value="LUI" />
</PropertyList>
```

### Subpart escape hatch

When you need full control over a row — e.g. a label with a tooltip, a value cell with a custom layout — drop the shorthand props and compose `<PropertyList.Label>` and `<PropertyList.Value>` directly.

**Example**

```html
<section class="property-list">
  <dl class="property-list-items">
    <dt class="property-list-label">EAN <small>(GTIN-13)</small></dt>
    <dd class="property-list-value"><code>4005176923197</code></dd>
  </dl>
</section>
```

```tsx
<PropertyList>
  <PropertyList.Item>
    <PropertyList.Label>
      EAN <small>(GTIN-13)</small>
    </PropertyList.Label>
    <PropertyList.Value>
      <code>4005176923197</code>
    </PropertyList.Value>
  </PropertyList.Item>
</PropertyList>
```
