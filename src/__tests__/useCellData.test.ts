import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import useCellData from "../components/GameCanvas/useCellData";

describe("useCellData", () => {
  it("returns object with correct properties", () => {
    const { result } = renderHook(() => useCellData(2));
    expect(result.current.current).toBeInstanceOf(Int8Array);
    expect(result.current.next).toBeInstanceOf(Int8Array);
    expect(result.current.computeNext).toBeTypeOf("function");
  });
});
