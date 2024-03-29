import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import useCanvasSize, {
  CANVAS_SIZES,
} from "../components/GameCanvas/useCanvasSize";

describe("useCanvasSize", () => {
  it("returns an object with width and height numbers >= 0", () => {
    const { result, rerender } = renderHook(() => useCanvasSize(0));
    const canvasSize = result.current;
    rerender();
    expect(canvasSize.width).toBeTypeOf("number");
    expect(canvasSize.height).toBeTypeOf("number");
  });

  it("returns numbers >= 0 and <= than 1000", () => {
    const { result, rerender } = renderHook(() => useCanvasSize(0));
    const canvasSize = result.current;
    rerender();
    expect(canvasSize.width).toBeGreaterThanOrEqual(0);
    expect(canvasSize.height).toBeGreaterThanOrEqual(0);
    expect(canvasSize.width).toBeLessThanOrEqual(1000);
    expect(canvasSize.height).toBeLessThanOrEqual(1000);
  });

  it("returns xxl values when screen is wider than xxl breakpoint + margin", () => {
    window.innerWidth = 3840;
    window.innerHeight = 2160;
    const margin = 10;
    const { result, rerender } = renderHook(() => useCanvasSize(margin));
    const canvasSize = result.current;
    rerender();
    expect(canvasSize.width).toBe(CANVAS_SIZES.xxl - margin);
    expect(canvasSize.height).toBe(CANVAS_SIZES.xxl - margin);
  });

  it("returns xl values when screen is wider than xl breakpoint + margin but smaller than xxl", () => {
    window.innerWidth = 1920;
    window.innerHeight = 1080;
    const margin = 10;
    const { result, rerender } = renderHook(() => useCanvasSize(margin));
    const canvasSize = result.current;
    rerender();
    expect(canvasSize.width).toBe(CANVAS_SIZES.xl - margin);
    expect(canvasSize.height).toBe(CANVAS_SIZES.xl - margin);
  });

  it("returns lg values when screen is wider than lg breakpoint + margin but smaller than xl", () => {
    window.innerWidth = 1280;
    window.innerHeight = 720;
    const margin = 10;
    const { result, rerender } = renderHook(() => useCanvasSize(margin));
    const canvasSize = result.current;
    rerender();
    expect(canvasSize.width).toBe(CANVAS_SIZES.lg - margin);
    expect(canvasSize.height).toBe(CANVAS_SIZES.lg - margin);
  });

  it("returns md values when screen is wider than md breakpoint + margin but smaller than lg", () => {
    window.innerWidth = 1024;
    window.innerHeight = 768;
    const margin = 10;
    const { result, rerender } = renderHook(() => useCanvasSize(margin));
    const canvasSize = result.current;
    rerender();
    expect(canvasSize.width).toBe(CANVAS_SIZES.md - margin);
    expect(canvasSize.height).toBe(CANVAS_SIZES.md - margin);
  });

  it("returns sm values when screen is wider than sm breakpoint + margin but smaller than md", () => {
    window.innerWidth = 768;
    window.innerHeight = 1024;
    const margin = 10;
    const { result, rerender } = renderHook(() => useCanvasSize(margin));
    const canvasSize = result.current;
    rerender();
    expect(canvasSize.width).toBe(CANVAS_SIZES.sm - margin);
    expect(canvasSize.height).toBe(CANVAS_SIZES.sm - margin);
  });

  it("returns xs values when screen is smaller than sm breakpoint + margin", () => {
    window.innerWidth = 640;
    window.innerHeight = 480;
    const margin = 10;
    const { result, rerender } = renderHook(() => useCanvasSize(margin));
    const canvasSize = result.current;
    rerender();
    expect(canvasSize.width).toBe(CANVAS_SIZES.xs - margin);
    expect(canvasSize.height).toBe(CANVAS_SIZES.xs - margin);
  });
});
