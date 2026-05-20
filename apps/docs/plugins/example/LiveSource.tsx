import type { Control } from "./ControlsPanel";

interface LiveSourceProps {
  template: string;
  controls: Control[];
  value: Record<string, unknown>;
}

/**
 * Render the React-fence source with current control values substituted in.
 *
 * The author writes the tsx fence using the bare identifier convention —
 * `variant={variant}` — and we rewrite each `name={name}` occurrence per
 * control type:
 *
 *   boolean true   → `name`               (shorthand attribute)
 *   boolean false  → strip the whole `name={name}` (with leading whitespace)
 *   string/select  → `name="value"`
 *   number         → `name={value}`
 *
 * Plain text rewrite; no syntax highlighting in v1.
 */
export default function LiveSource({ template, controls, value }: LiveSourceProps) {
  return (
    <pre className="example-live-source">
      <code>{substitute(template, controls, value)}</code>
    </pre>
  );
}

function substitute(template: string, controls: Control[], value: Record<string, unknown>): string {
  let out = template;
  for (const c of controls) {
    const n = escapeRegex(c.name);
    const placeholder = new RegExp(`\\b${n}=\\{${n}\\}`, "g");
    const v = value[c.name];
    switch (c.type) {
      case "boolean":
        if (v === true) {
          out = out.replace(placeholder, c.name);
        } else {
          const stripper = new RegExp(`\\s${n}=\\{${n}\\}`, "g");
          out = out.replace(stripper, "");
        }
        break;
      case "string":
      case "select":
        out = out.replace(placeholder, `${c.name}="${String(v)}"`);
        break;
      case "number":
        out = out.replace(placeholder, `${c.name}={${String(v)}}`);
        break;
    }
  }
  return out;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
