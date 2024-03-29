import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import useCanvasSize from "../components/GameCanvas/useCanvasSize";

describe("useCanvasSize", () => {
  it("returns an object with width and height numbers", () => {
    const { result, rerender } = renderHook(() => useCanvasSize(0));
    const canvasSize = result.current;
    rerender();
    expect(canvasSize.width).toBeTypeOf("number");
    expect(canvasSize.height).toBeTypeOf("number");
  });
});
