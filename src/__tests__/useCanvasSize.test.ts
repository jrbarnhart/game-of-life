import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import useCanvasSize, {
  CANVAS_HEIGHTS,
  CANVAS_WIDTHS,
} from "../components/GameOfLife/GameCanvas/useCanvasSize";

const XXL_SCREEN = { width: 3840, height: 2160 };
const XL_SCREEN = { width: 1920, height: 1080 };
const LG_SCREEN = { width: 1280, height: 720 };
const MD_SCREEN = { width: 1024, height: 768 };
const SM_SCREEN = { width: 768, height: 1024 };
const XS_SCREEN = { width: 640, height: 480 };

describe("useCanvasSize", () => {
  it("returns xxl values when screen is wider than xxl breakpoint + margin", () => {
    window.innerWidth = XXL_SCREEN.width;
    window.innerHeight = XXL_SCREEN.height;
    const margin = 10;
    const { result, rerender } = renderHook(() => useCanvasSize(margin));
    const canvasSize = result.current;
    rerender();
    expect(canvasSize.width).toBe(CANVAS_WIDTHS.xxl - margin);
    expect(canvasSize.height).toBe(CANVAS_HEIGHTS.xxl - margin);
  });

  it("returns xl values when screen is wider than xl breakpoint + margin but smaller than xxl", () => {
    window.innerWidth = XL_SCREEN.width;
    window.innerHeight = XL_SCREEN.height;
    const margin = 10;
    const { result, rerender } = renderHook(() => useCanvasSize(margin));
    const canvasSize = result.current;
    rerender();
    expect(canvasSize.width).toBe(CANVAS_WIDTHS.xl - margin);
    expect(canvasSize.height).toBe(CANVAS_HEIGHTS.xl - margin);
  });

  it("returns lg values when screen is wider than lg breakpoint + margin but smaller than xl", () => {
    window.innerWidth = LG_SCREEN.width;
    window.innerHeight = LG_SCREEN.height;
    const margin = 10;
    const { result, rerender } = renderHook(() => useCanvasSize(margin));
    const canvasSize = result.current;
    rerender();
    expect(canvasSize.width).toBe(CANVAS_WIDTHS.lg - margin);
    expect(canvasSize.height).toBe(CANVAS_HEIGHTS.lg - margin);
  });

  it("returns md values when screen is wider than md breakpoint + margin but smaller than lg", () => {
    window.innerWidth = MD_SCREEN.width;
    window.innerHeight = MD_SCREEN.height;
    const margin = 10;
    const { result, rerender } = renderHook(() => useCanvasSize(margin));
    const canvasSize = result.current;
    rerender();
    expect(canvasSize.width).toBe(CANVAS_WIDTHS.md - margin);
    expect(canvasSize.height).toBe(CANVAS_HEIGHTS.md - margin);
  });

  it("returns sm values when screen is wider than sm breakpoint + margin but smaller than md", () => {
    window.innerWidth = SM_SCREEN.width;
    window.innerHeight = SM_SCREEN.height;
    const margin = 10;
    const { result, rerender } = renderHook(() => useCanvasSize(margin));
    const canvasSize = result.current;
    rerender();
    expect(canvasSize.width).toBe(CANVAS_WIDTHS.sm - margin);
    expect(canvasSize.height).toBe(CANVAS_HEIGHTS.sm - margin);
  });

  it("returns xs values when screen is smaller than sm breakpoint + margin", () => {
    window.innerWidth = XS_SCREEN.width;
    window.innerHeight = XS_SCREEN.height;
    const margin = 10;
    const { result, rerender } = renderHook(() => useCanvasSize(margin));
    const canvasSize = result.current;
    rerender();
    expect(canvasSize.width).toBe(CANVAS_WIDTHS.xs - margin);
    expect(canvasSize.height).toBe(CANVAS_HEIGHTS.xs - margin);
  });

  it("returns correct values when window is resized", () => {
    const margin = 10;
    const { result } = renderHook(() => useCanvasSize(margin));

    act(() => {
      window.innerWidth = SM_SCREEN.width;
      window.innerHeight = SM_SCREEN.height;
      window.dispatchEvent(new Event("resize"));
    });
    expect(result.current.width).toBe(CANVAS_WIDTHS.sm - margin);
    expect(result.current.height).toBe(CANVAS_HEIGHTS.sm - margin);

    act(() => {
      window.innerWidth = MD_SCREEN.width;
      window.innerHeight = MD_SCREEN.height;
      window.dispatchEvent(new Event("resize"));
    });
    expect(result.current.width).toBe(CANVAS_WIDTHS.md - margin);
    expect(result.current.height).toBe(CANVAS_HEIGHTS.md - margin);

    act(() => {
      window.innerWidth = LG_SCREEN.width;
      window.innerHeight = LG_SCREEN.height;
      window.dispatchEvent(new Event("resize"));
    });
    expect(result.current.width).toBe(CANVAS_WIDTHS.lg - margin);
    expect(result.current.height).toBe(CANVAS_HEIGHTS.lg - margin);

    act(() => {
      window.innerWidth = XL_SCREEN.width;
      window.innerHeight = XL_SCREEN.height;
      window.dispatchEvent(new Event("resize"));
    });
    expect(result.current.width).toBe(CANVAS_WIDTHS.xl - margin);
    expect(result.current.height).toBe(CANVAS_HEIGHTS.xl - margin);

    act(() => {
      window.innerWidth = XXL_SCREEN.width;
      window.innerHeight = XXL_SCREEN.height;
      window.dispatchEvent(new Event("resize"));
    });
    expect(result.current.width).toBe(CANVAS_WIDTHS.xxl - margin);
    expect(result.current.height).toBe(CANVAS_HEIGHTS.xxl - margin);
  });
});
