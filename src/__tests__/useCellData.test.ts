import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import useCellData from "../components/GameOfLife/GameCanvas/useCellData";
import { useRef } from "react";

describe("useCellData", () => {
  /*
    initialData set = [2, 5, 10, 12]

    Grid representation:
    0 0 1 0
    0 1 0 0
    0 0 1 0
    1 0 0 0
  */
  it("returns proper gameState based on initialData", () => {
    const { result: gridSize } = renderHook(() =>
      useRef<{ width: number; height: number }>({
        width: 4,
        height: 4,
      })
    );
    const { result: cellData } = renderHook(() =>
      useCellData(gridSize.current)
    );

    const initialData = new Set([2, 5, 10, 12]);

    cellData.current.initData(initialData);

    expect(Array.from(cellData.current.gameState.current)).toEqual([
      2, 3, 129, 2, 1, 130, 3, 2, 2, 3, 129, 2, 128, 3, 2, 3,
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
      const { result: gridSize } = renderHook(() =>
        useRef<{ width: number; height: number }>({
          width: 4,
          height: 4,
        })
      );
      const { result: cellData } = renderHook(() =>
        useCellData(gridSize.current)
      );

      const initialData = new Set([2, 5, 10, 12]);

      cellData.current.initData(initialData);

      cellData.current.computeNext();

      expect(Array.from(cellData.current.gameState.current)).toEqual([
        4, 131, 5, 2, 3, 131, 131, 1, 4, 131, 5, 2, 4, 130, 4, 128,
      ]);
    });

    it("it returns proper gameState based on initialData after two iterations", () => {
      const { result: gridSize } = renderHook(() =>
        useRef<{ width: number; height: number }>({
          width: 4,
          height: 4,
        })
      );
      const { result: cellData } = renderHook(() =>
        useCellData(gridSize.current)
      );

      const initialData = new Set([2, 5, 10, 12]);

      cellData.current.initData(initialData);

      cellData.current.computeNext();
      cellData.current.computeNext();

      expect(Array.from(cellData.current.gameState.current)).toEqual([
        4, 132, 4, 2, 131, 132, 131, 2, 4, 132, 4, 2, 3, 130, 3, 0,
      ]);
    });
  });
});
