import { render } from "@testing-library/react";
import { createRef, useMemo } from "react";
import { describe, expect, it, vi } from "vitest";
import { mergeRefs } from "./merge-refs";

describe("mergeRefs", () => {
  it("sets object refs and calls callback refs with the node", () => {
    const objectRef = createRef<HTMLDivElement>();
    const callbackRef = vi.fn();
    const { unmount } = render(<div data-testid="x" ref={mergeRefs(objectRef, callbackRef)} />);
    expect(objectRef.current).toBeInstanceOf(HTMLDivElement);
    expect(callbackRef).toHaveBeenCalledWith(objectRef.current);
    unmount();
    expect(objectRef.current).toBeNull();
    expect(callbackRef).toHaveBeenLastCalledWith(null);
  });

  it("runs a callback ref's own cleanup instead of calling it with null", () => {
    const cleanup = vi.fn();
    const callbackRef = vi.fn(() => cleanup);
    const { unmount } = render(<div ref={mergeRefs(callbackRef)} />);
    expect(callbackRef).toHaveBeenCalledOnce();
    unmount();
    expect(cleanup).toHaveBeenCalledOnce();
    expect(callbackRef).toHaveBeenCalledOnce();
  });

  it("skips null and undefined refs", () => {
    const objectRef = createRef<HTMLSpanElement>();
    render(<span ref={mergeRefs(null, undefined, objectRef)} />);
    expect(objectRef.current).toBeInstanceOf(HTMLSpanElement);
  });

  it("keeps the node attached across renders when memoized", () => {
    const callbackRef = vi.fn();
    function Probe({ label }: { label: string }) {
      const ref = useMemo(() => mergeRefs<HTMLDivElement>(callbackRef), []);
      return <div ref={ref}>{label}</div>;
    }
    const { rerender } = render(<Probe label="a" />);
    rerender(<Probe label="b" />);
    expect(callbackRef).toHaveBeenCalledOnce();
  });
});
