# Stat cards

> Compact KPI tile with label, value, and detail.

Pair `stat-card` with [`card`](cards.md) so it inherits every card surface and modifier. For free-form tiles, use [Cards](cards.md); for label/value tables, use [Property list](property-list.md).

## Examples

### Basic

**Example**

```html
<div class="card stat-card">
  <p class="stat-card-label">Total Generations</p>
  <p class="stat-card-value">1,234</p>
  <p class="stat-card-detail">42 completed / 12 pending</p>
</div>
```

```tsx
<StatCard label="Total Generations" value="1,234" detail="42 completed / 12 pending" />
```

### With icon

Pass `icon` — it lands in the label row. See [Icons](../basics/icons.md).

**Example**

```html
<div class="card stat-card">
  <p class="stat-card-label">
    <i class="ti ti-shopping-bag" aria-hidden="true"></i>
    Orders today
  </p>
  <p class="stat-card-value">128</p>
  <p class="stat-card-detail">14 awaiting fulfilment</p>
</div>
```

```tsx
<StatCard icon={IconShoppingBag} label="Orders today" value="128" detail="14 awaiting fulfilment" />
```

### Compact + bordered

`compact` tightens padding; `bordered` drops the shadow. Same [`card-compact` / `card-bordered`](cards.md#compact--bordered) modifiers as a card.

**Example**

```html
<div class="card stat-card card-compact card-bordered">
  <p class="stat-card-label">Active sessions</p>
  <p class="stat-card-value">3,402</p>
  <p class="stat-card-detail">+12% vs last hour</p>
</div>
```

```tsx
<StatCard compact bordered label="Active sessions" value="3,402" detail="+12% vs last hour" />
```

### Color variants

The same [variants as `<Card>`](cards.md#color-variants); the value picks up the matching accent. `warning` keeps its value at the default colour — yellow fails contrast on the tinted surface. Use sparingly.

**Example**

```html
<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
  <div class="card stat-card card-success">
    <p class="stat-card-label">Uptime</p>
    <p class="stat-card-value">99.98%</p>
    <p class="stat-card-detail">last 30 days</p>
  </div>
  <div class="card stat-card card-danger">
    <p class="stat-card-label">Failed jobs</p>
    <p class="stat-card-value">37</p>
    <p class="stat-card-detail">+29 vs yesterday</p>
  </div>
  <div class="card stat-card card-warning">
    <p class="stat-card-label">Queue depth</p>
    <p class="stat-card-value">1,204</p>
    <p class="stat-card-detail">approaching limit</p>
  </div>
  <div class="card stat-card card-muted">
    <p class="stat-card-label">Archived</p>
    <p class="stat-card-value">8,510</p>
    <p class="stat-card-detail">read-only</p>
  </div>
</div>
```

```tsx
<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
  <StatCard variant="success" label="Uptime" value="99.98%" detail="last 30 days" />
  <StatCard variant="danger" label="Failed jobs" value="37" detail="+29 vs yesterday" />
  <StatCard variant="warning" label="Queue depth" value="1,204" detail="approaching limit" />
  <StatCard variant="muted" label="Archived" value="8,510" detail="read-only" />
</div>
```

### Dashboard grid

Grid layout is the consumer's call — the tile bakes in no wrapper.

**Example**

```html
<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
  <div class="card stat-card">
    <p class="stat-card-label">
      <i class="ti ti-users" aria-hidden="true"></i>
      Users
    </p>
    <p class="stat-card-value">12,408</p>
    <p class="stat-card-detail">+1,204 this week</p>
  </div>
  <div class="card stat-card">
    <p class="stat-card-label">
      <i class="ti ti-activity" aria-hidden="true"></i>
      Active now
    </p>
    <p class="stat-card-value">342</p>
    <p class="stat-card-detail">peak 412</p>
  </div>
  <div class="card stat-card">
    <p class="stat-card-label">
      <i class="ti ti-shopping-bag" aria-hidden="true"></i>
      Orders
    </p>
    <p class="stat-card-value">128</p>
    <p class="stat-card-detail">14 pending</p>
  </div>
  <div class="card stat-card">
    <p class="stat-card-label">
      <i class="ti ti-cash" aria-hidden="true"></i>
      Revenue
    </p>
    <p class="stat-card-value">$8.4k</p>
    <p class="stat-card-detail">+8% vs target</p>
  </div>
</div>
```

```tsx
<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
  <StatCard icon={IconUsers} label="Users" value="12,408" detail="+1,204 this week" />
  <StatCard icon={IconActivity} label="Active now" value="342" detail="peak 412" />
  <StatCard icon={IconShoppingBag} label="Orders" value="128" detail="14 pending" />
  <StatCard icon={IconCash} label="Revenue" value="$8.4k" detail="+8% vs target" />
</div>
```

### Trend

`trend` adds a delta line with a directional caret below the value. Tone is independent of direction — a falling error rate is good, so pass `intent` to override the default mapping (`up` → positive, `down` → negative).

**Example**

```html
<div class="card stat-card">
  <p class="stat-card-label">Revenue</p>
  <p class="stat-card-value">$8.4k</p>
  <p class="stat-card-trend" data-trend="up" data-intent="positive">+12.4% vs last week</p>
</div>
<div class="card stat-card">
  <p class="stat-card-label">Error rate</p>
  <p class="stat-card-value">0.42%</p>
  <p class="stat-card-trend" data-trend="down" data-intent="positive">-0.18 vs prior</p>
</div>
```

```tsx
<StatCard label="Revenue" value="$8.4k" trend={{ direction: "up", value: "+12.4% vs last week" }} />
<StatCard
  label="Error rate"
  value="0.42%"
  trend={{ direction: "down", intent: "positive", value: "-0.18 vs prior" }}
/>
```

### Custom content

For sparklines or anything else, drop it in as children — it renders below the trend and `detail`.

**Example**

```html
<div class="card stat-card">
  <p class="stat-card-label">Error rate</p>
  <p class="stat-card-value">0.42%</p>
  <p class="stat-card-detail">last 24 hours</p>
  <span class="badge badge-success badge-sm">↓ 0.18 vs prior period</span>
</div>
```

```tsx
<StatCard label="Error rate" value="0.42%" detail="last 24 hours">
  <Badge variant="success" size="sm">
    ↓ 0.18 vs prior period
  </Badge>
</StatCard>
```
