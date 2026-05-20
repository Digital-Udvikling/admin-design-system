import type { ComponentType } from "react";

/**
 * Renders the React preview as part of this component's tree so the whole
 * thing goes through one React SSR pass. Going through Astro's `<slot />`
 * pre-renders each child JSX node independently, which severs context links
 * — e.g. `<Field.Label>` loses the `<Field>` context published by its
 * parent. Astro recognises this file as React (`.tsx` + @astrojs/react), so
 * everything below `<Render />` stays in React's renderer.
 */
export function ReactPreview({ render: Render }: { render: ComponentType }) {
  return <Render />;
}
