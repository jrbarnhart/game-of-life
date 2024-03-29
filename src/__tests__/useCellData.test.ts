import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import useCellData from "../components/GameCanvas/useCellData";

describe("useCellData", () => {
  it("returns object with correct properties", () => {
    const { result } = renderHook(() => useCellData(0));
    expect(result.current.current).toBeInstanceOf(Int8Array);
    expect(result.current.next).toBeInstanceOf(Int8Array);
    expect(result.current.computeNext).toBeTypeOf("function");
  });

  it("correctly initializes passed data", () => {
    const gridSize = 3;
    const initialData = [0, 1, 0, 1, 1, 0, 0, 0, 1];
    const { result } = renderHook(() => useCellData(gridSize, initialData));
    expect(result.current.current[1]).toBe(1);
  });

  describe("computeNext", () => {
    it("correctly swap betweens arrays for curent and next", () => {
      const gridSize = 3;
      const initialData = [0, 1, 0, 1, 1, 0, 0, 0, 1];
      const { result, rerender } = renderHook(() =>
        useCellData(gridSize, initialData)
      );
    });
  });
});
