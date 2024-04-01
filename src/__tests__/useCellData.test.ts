import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import useCellData from "../components/GameCanvas/useCellData";

describe("useCellData", () => {
  it("returns object with correct properties", () => {
    const { result } = renderHook(() => useCellData({ width: 4, height: 4 }));
    expect(result.current.gameState).toBeInstanceOf(Uint8Array);
    expect(result.current.changedCells).toBeInstanceOf(Set);
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
      useCellData(
        { width: 4, height: 4 },
        [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0]
      )
    );
    expect(Array.from(result.current.gameState)).toEqual([
      2, 3, 129, 2, 1, 130, 3, 2, 2, 3, 129, 2, 128, 3, 2, 3,
    ]);
  });

  it("changedCells initially contains all cells for first render", () => {
    const { result } = renderHook(() =>
      useCellData(
        { width: 4, height: 4 },
        [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0]
      )
    );
    expect([...result.current.changedCells]).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
    ]);
  });

  /*
    Grid representation:
    0 0 1 0                 0 1 0 0
    0 1 0 0  computeNext => 0 1 1 0
    0 0 1 0                 0 1 0 0
    1 0 0 0                 0 1 0 1
  */
  describe("computeNext", () => {
    it("it returns proper gameState based on initialData after one iteration", () => {
      const { result } = renderHook(() =>
        useCellData(
          { width: 4, height: 4 },
          [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0]
        )
      );

      result.current.computeNext();

      expect(Array.from(result.current.gameState)).toEqual([
        4, 131, 5, 2, 3, 131, 131, 1, 4, 131, 5, 2, 4, 130, 4, 128,
      ]);
    });
  });
});
