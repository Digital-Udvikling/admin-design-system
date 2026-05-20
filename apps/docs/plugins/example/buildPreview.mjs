/**
 * @typedef {{ name: string; type: "select"; options: string[]; default: string }} SelectControl
 * @typedef {{ name: string; type: "boolean"; default: boolean }} BooleanControl
 * @typedef {{ name: string; type: "string"; default: string }} StringControl
 * @typedef {{ name: string; type: "number"; default: number }} NumberControl
 * @typedef {SelectControl | BooleanControl | StringControl | NumberControl} Control
 */

/**
 * Build the TSX source for one preview's virtual module.
 *
 * Without controls, emits a plain default-exported FC that just renders the
 * tsx fence body. With controls, wraps the body in a `useState` shell, a
 * `<ControlsPanel>` (rendered above the preview), and a `<LiveSource>`
 * (rendered below) — the destructured state variables are in scope so the
 * tsx body can reference `variant`, `loading`, etc. as bare identifiers.
 *
 * The output is hashed to derive the virtual module id, so any change here
 * invalidates every preview's cache across the workspace.
 *
 * @param {object} args
 * @param {string} args.importsBlock  User imports collected from the MDX file
 * @param {string} args.reactSource   Formatted tsx fence body
 * @param {Control[] | undefined} args.controls
 */
export function buildPreviewSource({ importsBlock, reactSource, controls }) {
  const header = importsBlock.length > 0 ? `${importsBlock}\n\n` : "";

  if (!controls || controls.length === 0) {
    return `${header}export default function ExamplePreview() {
  return (
    <>
${indent(reactSource, 6)}
    </>
  );
}
`;
  }

  const controlsJson = JSON.stringify(controls);
  const templateJson = JSON.stringify(reactSource);
  const destructure = controls.map((c) => c.name).join(", ");

  return `${header}import { useState } from "react";
import ControlsPanel from "@example/ControlsPanel";
import LiveSource from "@example/LiveSource";

const __controls = ${controlsJson};
const __template = ${templateJson};

export default function ExamplePreview() {
  const [__state, __setState] = useState(() =>
    Object.fromEntries(__controls.map((c) => [c.name, c.default])),
  );
  const { ${destructure} } = __state as any;
  return (
    <>
      <ControlsPanel controls={__controls} value={__state} onChange={__setState} />
      <div className="example-preview-body">
${indent(reactSource, 8)}
      </div>
      <LiveSource template={__template} controls={__controls} value={__state} />
    </>
  );
}
`;
}

/**
 * Parse the body of a ```controls``` fence into typed control descriptors.
 *
 * Grammar (one per line, leading/trailing whitespace and `// comments` ignored):
 *
 *   name: select [opt1, opt2, ...] = default
 *   name: boolean = true|false
 *   name: number  = <numeric literal>
 *   name: string  = "..." | '...'
 *
 * Throws `Error` on malformed input — the caller is expected to catch and
 * surface a vfile message at the offending node.
 *
 * @param {string} src
 * @returns {Control[]}
 */
export function parseControls(src) {
  /** @type {Control[]} */
  const out = [];
  const lines = src
    .split("\n")
    .map((l) => l.replace(/\/\/.*$/, "").trim())
    .filter((l) => l.length > 0);

  const seen = new Set();
  for (const line of lines) {
    const m = /^(\w+)\s*:\s*(\w+)\s*(?:\[([^\]]*)\])?\s*(?:=\s*(.+))?$/.exec(line);
    if (!m) throw new Error(`malformed control line: ${line}`);
    const [, name, type, optsRaw, defaultRaw] = m;
    if (seen.has(name)) throw new Error(`duplicate control name "${name}"`);
    seen.add(name);
    if (defaultRaw === undefined) throw new Error(`control "${name}" needs a default value`);
    const def = defaultRaw.trim();

    switch (type) {
      case "select": {
        if (optsRaw === undefined) {
          throw new Error(`control "${name}" of type select needs an options list`);
        }
        const options = optsRaw
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
        if (options.length === 0) {
          throw new Error(`control "${name}" needs at least one option`);
        }
        if (!options.includes(def)) {
          throw new Error(
            `control "${name}" default "${def}" must be one of: ${options.join(", ")}`,
          );
        }
        out.push({ name, type: "select", options, default: def });
        break;
      }
      case "boolean": {
        if (optsRaw !== undefined) {
          throw new Error(`control "${name}" of type boolean cannot have an options list`);
        }
        if (def !== "true" && def !== "false") {
          throw new Error(`control "${name}" default must be true or false, got "${def}"`);
        }
        out.push({ name, type: "boolean", default: def === "true" });
        break;
      }
      case "number": {
        if (optsRaw !== undefined) {
          throw new Error(`control "${name}" of type number cannot have an options list`);
        }
        const n = Number(def);
        if (Number.isNaN(n)) {
          throw new Error(`control "${name}" default must be numeric, got "${def}"`);
        }
        out.push({ name, type: "number", default: n });
        break;
      }
      case "string": {
        if (optsRaw !== undefined) {
          throw new Error(`control "${name}" of type string cannot have an options list`);
        }
        const sm = /^"([^"]*)"$|^'([^']*)'$/.exec(def);
        if (!sm) {
          throw new Error(`control "${name}" default must be a quoted string, got ${def}`);
        }
        out.push({ name, type: "string", default: sm[1] ?? sm[2] ?? "" });
        break;
      }
      default:
        throw new Error(`control "${name}" has unknown type "${type}"`);
    }
  }
  return out;
}

/**
 * @param {string} text
 * @param {number} n
 */
function indent(text, n) {
  const pad = " ".repeat(n);
  return text
    .split("\n")
    .map((l) => (l.length > 0 ? pad + l : l))
    .join("\n");
}
