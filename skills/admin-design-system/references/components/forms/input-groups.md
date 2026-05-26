# Input groups

> Combine inputs, addons, and buttons into a flush row.

Attach a prefix, suffix, or action button to an input. The group collapses the shared border between adjacent children and keeps the outer corners rounded.

## Examples

### Prepended addon

**Example**

```html
<div class="input-group">
  <span class="input-group-addon">$</span>
  <input class="input input-bordered" type="number" placeholder="0.00" />
</div>
```

```tsx
<InputGroup>
  <InputGroup.Addon>$</InputGroup.Addon>
  <Input type="number" placeholder="0.00" />
</InputGroup>
```

### Appended addon

**Example**

```html
<div class="input-group">
  <input class="input input-bordered" type="text" placeholder="subdomain" />
  <span class="input-group-addon">.example.com</span>
</div>
```

```tsx
<InputGroup>
  <Input placeholder="subdomain" />
  <InputGroup.Addon>.example.com</InputGroup.Addon>
</InputGroup>
```

### Both ends

**Example**

```html
<div class="input-group">
  <span class="input-group-addon">$</span>
  <input class="input input-bordered" type="number" placeholder="0.00" />
  <span class="input-group-addon">USD</span>
</div>
```

```tsx
<InputGroup>
  <InputGroup.Addon>$</InputGroup.Addon>
  <Input type="number" placeholder="0.00" />
  <InputGroup.Addon>USD</InputGroup.Addon>
</InputGroup>
```

### With a button

**Example**

```html
<div class="input-group">
  <input class="input input-bordered" type="search" placeholder="Search orders…" />
  <button class="btn btn-primary" type="submit">Search</button>
</div>
```

```tsx
<InputGroup>
  <Input type="search" placeholder="Search orders…" />
  <Button type="submit">Search</Button>
</InputGroup>
```

### With icon addons

`.input-group-addon` accepts any content. See [Icons](../../../basics/icons/).

**Example**

```html
<div class="input-group">
  <span class="input-group-addon" aria-hidden="true"><i class="ti ti-search"></i></span>
  <input class="input input-bordered" type="search" placeholder="Search products…" />
</div>
<div class="input-group">
  <span class="input-group-addon" aria-hidden="true"><i class="ti ti-at"></i></span>
  <input class="input input-bordered" type="email" placeholder="you@example.com" />
</div>
<div class="input-group">
  <input class="input input-bordered" type="text" placeholder="Enter command" />
  <button class="btn btn-primary" type="submit" aria-label="Run">
    <i class="ti ti-arrow-right" aria-hidden="true"></i>
  </button>
</div>
```

```tsx
<InputGroup>
  <InputGroup.Addon aria-hidden>
    <IconSearch size={16} />
  </InputGroup.Addon>
  <Input type="search" placeholder="Search products…" />
</InputGroup>
<InputGroup>
  <InputGroup.Addon aria-hidden>
    <IconAt size={16} />
  </InputGroup.Addon>
  <Input type="email" placeholder="you@example.com" />
</InputGroup>
<InputGroup>
  <Input placeholder="Enter command" />
  <Button type="submit" aria-label="Run">
    <IconArrowRight size={16} aria-hidden />
  </Button>
</InputGroup>
```
