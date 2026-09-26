/**
 * Node module hooks standing in for a React Server Components bundler: any ES
 * module that starts with "use client" (admin-react's or a dependency's, such
 * as Base UI's) loads as client references instead of running, so its imports
 * are never linked. Evaluating the package under `--conditions=react-server`
 * with these hooks proves that no server-reachable module calls a client-only
 * React API. Register with `module.register()`.
 */
import { init, parse } from "es-module-lexer";

const USE_CLIENT = /^\s*["']use client["']/;

await init;

export async function load(url, context, nextLoad) {
  const result = await nextLoad(url, context);
  if (result.format !== "module" || result.source == null) return result;
  const source = String(result.source);
  if (!USE_CLIENT.test(source)) return result;

  const [imports, exports] = parse(source);
  // `export * from` has no names to stub without loading the target.
  if (imports.some((i) => source.slice(i.ss, i.se).startsWith("export *"))) {
    throw new Error(`client module re-exports with export *: ${url}`);
  }
  const reference = (name) =>
    `Object.assign(function () { throw new Error(${JSON.stringify(
      `client reference ${name} (${url}) rendered on the server`,
    )}); }, { $$typeof: Symbol.for("react.client.reference") })`;
  const body = exports
    .map(({ n }) =>
      n === "default"
        ? `export default ${reference(n)};`
        : `const $${n} = ${reference(n)}; export { $${n} as ${JSON.stringify(n)} };`,
    )
    .join("\n");
  return { format: "module", source: body, shortCircuit: true };
}
