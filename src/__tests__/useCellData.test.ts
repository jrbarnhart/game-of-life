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
    expect(result.current.gameState).toBe([
      [2, 3, 129, 2, 1, 130, 3, 2, 2, 3, 129, 2, 128, 3, 2, 3],
    ]);
  });
});
