# Colors

> Color tokens — brand, surfaces, borders, text, and state.

<ColorCopy />

The palette is [Flexoki](https://stephango.com/flexoki). The system layers it as palette tones (`--color-blue-600`, `--color-base-50`, …) and semantic aliases that point at them (`--color-primary`, `--color-surface`, …) — see [Principles › Two-layer tokens](principles.md#two-layer-tokens).

Override either layer to reskin the system — see [Customize](customize.md). Click any swatch to copy its hex, Tailwind class, or CSS variable.

## Semantic tokens

Primary and the state families (danger, success, warning, info) share a four-slot layout: **Base**, **Hover**, **Muted** (low-saturation background for tinted surfaces), and **Content** (text/icons on top of the base). Text, Surface, Border, Link, and Focus use lighter scales.

<ColorFamily
  family="Primary"
  description="High-contrast neutral (ink). Drives solid primary buttons, badges, and selected states. Inverts with the mode — near-black on light, near-white on dark."
  variants={[
    { label: "Base", variable: "--color-primary" },
    { label: "Hover", variable: "--color-primary-hover" },
    { label: "Muted", variable: "--color-primary-muted" },
    { label: "Content", variable: "--color-primary-content" },
  ]}
/>

<ColorFamily
  family="Link"
  description="Text-link color. Separate from Info so links can be retinted independently."
  variants={[
    { label: "Base", variable: "--color-link" },
    { label: "Hover", variable: "--color-link-hover" },
  ]}
/>

<ColorFamily
  family="Focus"
  description="Focus-ring color for every interactive component."
  variants={[{ label: "Base", variable: "--color-focus" }]}
/>

<ColorFamily
  family="Text"
  description="Foreground content on neutral surfaces."
  variants={[
    { label: "Base", variable: "--color-text" },
    { label: "Muted", variable: "--color-text-muted" },
  ]}
/>

<ColorFamily
  family="Surface"
  description="Page and component backgrounds, lightest to strongest."
  variants={[
    { label: "Base", variable: "--color-surface" },
    { label: "Muted", variable: "--color-surface-muted" },
    { label: "Strong", variable: "--color-surface-strong" },
  ]}
/>

<ColorFamily
  family="Danger"
  description="Destructive actions and error states."
  variants={[
    { label: "Base", variable: "--color-danger" },
    { label: "Hover", variable: "--color-danger-hover" },
    { label: "Muted", variable: "--color-danger-muted" },
    { label: "Content", variable: "--color-danger-content" },
  ]}
/>

<ColorFamily
  family="Success"
  description="Confirmation and positive outcomes."
  variants={[
    { label: "Base", variable: "--color-success" },
    { label: "Hover", variable: "--color-success-hover" },
    { label: "Muted", variable: "--color-success-muted" },
    { label: "Content", variable: "--color-success-content" },
  ]}
/>

<ColorFamily
  family="Warning"
  description="Caution and non-blocking issues."
  variants={[
    { label: "Base", variable: "--color-warning" },
    { label: "Hover", variable: "--color-warning-hover" },
    { label: "Muted", variable: "--color-warning-muted" },
    { label: "Content", variable: "--color-warning-content" },
  ]}
/>

<ColorFamily
  family="Info"
  description="Neutral notifications and helper hints."
  variants={[
    { label: "Base", variable: "--color-info" },
    { label: "Hover", variable: "--color-info-hover" },
    { label: "Muted", variable: "--color-info-muted" },
    { label: "Content", variable: "--color-info-content" },
  ]}
/>

<ColorFamily
  family="Border"
  description="Dividers and outlines."
  variants={[
    { label: "Base", variable: "--color-border" },
    { label: "Strong", variable: "--color-border-strong" },
  ]}
/>

## Palette

Every Flexoki tone is a utility class and CSS variable. Tones run light→dark from `50` to `950`; the base ramp is bookended by `paper` and `black`.

<ColorRamp
  family="Base"
  tones={[
    { label: "paper", variable: "--color-paper" },
    { label: "50", variable: "--color-base-50" },
    { label: "100", variable: "--color-base-100" },
    { label: "150", variable: "--color-base-150" },
    { label: "200", variable: "--color-base-200" },
    { label: "300", variable: "--color-base-300" },
    { label: "400", variable: "--color-base-400" },
    { label: "500", variable: "--color-base-500" },
    { label: "600", variable: "--color-base-600" },
    { label: "700", variable: "--color-base-700" },
    { label: "800", variable: "--color-base-800" },
    { label: "850", variable: "--color-base-850" },
    { label: "900", variable: "--color-base-900" },
    { label: "950", variable: "--color-base-950" },
    { label: "black", variable: "--color-black" },
  ]}
/>

<ColorRamp
  family="Red"
  tones={[
    { label: "50", variable: "--color-red-50" },
    { label: "100", variable: "--color-red-100" },
    { label: "150", variable: "--color-red-150" },
    { label: "200", variable: "--color-red-200" },
    { label: "300", variable: "--color-red-300" },
    { label: "400", variable: "--color-red-400" },
    { label: "500", variable: "--color-red-500" },
    { label: "600", variable: "--color-red-600" },
    { label: "700", variable: "--color-red-700" },
    { label: "800", variable: "--color-red-800" },
    { label: "850", variable: "--color-red-850" },
    { label: "900", variable: "--color-red-900" },
    { label: "950", variable: "--color-red-950" },
  ]}
/>

<ColorRamp
  family="Orange"
  tones={[
    { label: "50", variable: "--color-orange-50" },
    { label: "100", variable: "--color-orange-100" },
    { label: "150", variable: "--color-orange-150" },
    { label: "200", variable: "--color-orange-200" },
    { label: "300", variable: "--color-orange-300" },
    { label: "400", variable: "--color-orange-400" },
    { label: "500", variable: "--color-orange-500" },
    { label: "600", variable: "--color-orange-600" },
    { label: "700", variable: "--color-orange-700" },
    { label: "800", variable: "--color-orange-800" },
    { label: "850", variable: "--color-orange-850" },
    { label: "900", variable: "--color-orange-900" },
    { label: "950", variable: "--color-orange-950" },
  ]}
/>

<ColorRamp
  family="Yellow"
  tones={[
    { label: "50", variable: "--color-yellow-50" },
    { label: "100", variable: "--color-yellow-100" },
    { label: "150", variable: "--color-yellow-150" },
    { label: "200", variable: "--color-yellow-200" },
    { label: "300", variable: "--color-yellow-300" },
    { label: "400", variable: "--color-yellow-400" },
    { label: "500", variable: "--color-yellow-500" },
    { label: "600", variable: "--color-yellow-600" },
    { label: "700", variable: "--color-yellow-700" },
    { label: "800", variable: "--color-yellow-800" },
    { label: "850", variable: "--color-yellow-850" },
    { label: "900", variable: "--color-yellow-900" },
    { label: "950", variable: "--color-yellow-950" },
  ]}
/>

<ColorRamp
  family="Green"
  tones={[
    { label: "50", variable: "--color-green-50" },
    { label: "100", variable: "--color-green-100" },
    { label: "150", variable: "--color-green-150" },
    { label: "200", variable: "--color-green-200" },
    { label: "300", variable: "--color-green-300" },
    { label: "400", variable: "--color-green-400" },
    { label: "500", variable: "--color-green-500" },
    { label: "600", variable: "--color-green-600" },
    { label: "700", variable: "--color-green-700" },
    { label: "800", variable: "--color-green-800" },
    { label: "850", variable: "--color-green-850" },
    { label: "900", variable: "--color-green-900" },
    { label: "950", variable: "--color-green-950" },
  ]}
/>

<ColorRamp
  family="Cyan"
  tones={[
    { label: "50", variable: "--color-cyan-50" },
    { label: "100", variable: "--color-cyan-100" },
    { label: "150", variable: "--color-cyan-150" },
    { label: "200", variable: "--color-cyan-200" },
    { label: "300", variable: "--color-cyan-300" },
    { label: "400", variable: "--color-cyan-400" },
    { label: "500", variable: "--color-cyan-500" },
    { label: "600", variable: "--color-cyan-600" },
    { label: "700", variable: "--color-cyan-700" },
    { label: "800", variable: "--color-cyan-800" },
    { label: "850", variable: "--color-cyan-850" },
    { label: "900", variable: "--color-cyan-900" },
    { label: "950", variable: "--color-cyan-950" },
  ]}
/>

<ColorRamp
  family="Blue"
  tones={[
    { label: "50", variable: "--color-blue-50" },
    { label: "100", variable: "--color-blue-100" },
    { label: "150", variable: "--color-blue-150" },
    { label: "200", variable: "--color-blue-200" },
    { label: "300", variable: "--color-blue-300" },
    { label: "400", variable: "--color-blue-400" },
    { label: "500", variable: "--color-blue-500" },
    { label: "600", variable: "--color-blue-600" },
    { label: "700", variable: "--color-blue-700" },
    { label: "800", variable: "--color-blue-800" },
    { label: "850", variable: "--color-blue-850" },
    { label: "900", variable: "--color-blue-900" },
    { label: "950", variable: "--color-blue-950" },
  ]}
/>

<ColorRamp
  family="Purple"
  tones={[
    { label: "50", variable: "--color-purple-50" },
    { label: "100", variable: "--color-purple-100" },
    { label: "150", variable: "--color-purple-150" },
    { label: "200", variable: "--color-purple-200" },
    { label: "300", variable: "--color-purple-300" },
    { label: "400", variable: "--color-purple-400" },
    { label: "500", variable: "--color-purple-500" },
    { label: "600", variable: "--color-purple-600" },
    { label: "700", variable: "--color-purple-700" },
    { label: "800", variable: "--color-purple-800" },
    { label: "850", variable: "--color-purple-850" },
    { label: "900", variable: "--color-purple-900" },
    { label: "950", variable: "--color-purple-950" },
  ]}
/>

<ColorRamp
  family="Magenta"
  tones={[
    { label: "50", variable: "--color-magenta-50" },
    { label: "100", variable: "--color-magenta-100" },
    { label: "150", variable: "--color-magenta-150" },
    { label: "200", variable: "--color-magenta-200" },
    { label: "300", variable: "--color-magenta-300" },
    { label: "400", variable: "--color-magenta-400" },
    { label: "500", variable: "--color-magenta-500" },
    { label: "600", variable: "--color-magenta-600" },
    { label: "700", variable: "--color-magenta-700" },
    { label: "800", variable: "--color-magenta-800" },
    { label: "850", variable: "--color-magenta-850" },
    { label: "900", variable: "--color-magenta-900" },
    { label: "950", variable: "--color-magenta-950" },
  ]}
/>
