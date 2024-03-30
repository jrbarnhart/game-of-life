import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import useCellData from "../components/GameCanvas/useCellData";

describe("useCellData", () => {
  it("returns object with correct properties", () => {
    const { result } = renderHook(() => useCellData(0));
    expect(result.current.gameState).toBeInstanceOf(Uint8Array);
    expect(result.current.changedCells).toBeInstanceOf(Uint32Array);
    expect(result.current.computeNext).toBeTypeOf("function");
  });

  /*
    Grid representation:
    0 0 1 0
    0 1 0 0
    0 0 1 0
    1 0 0 0
  */
  it("returns proper gameState based on initialData", () => {
    const { result } = renderHook(() =>
      useCellData(4, [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0])
    );
    expect(Array.from(result.current.gameState)).toEqual([
      3, 128, 3, 2, 3, 128, 2, 2, 3, 129, 2, 2, 2, 1, 130, 3, 2, 1, 2, 2, 3,
      129, 2, 2, 3, 128, 3, 2, 3, 128, 2, 2, 3, 129, 2, 2,
    ]);
  });

  it("changedCells initially contains all cells for first render", () => {
    const { result } = renderHook(() =>
      useCellData(4, [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0])
    );
    expect(Array.from(result.current.changedCells)).toEqual([
      8, 9, 10, 11, 14, 15, 16, 17, 20, 21, 22, 23, 26, 27, 28, 29, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });
});
