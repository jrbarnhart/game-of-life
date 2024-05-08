import { GRID_SIZES } from "../GameCanvas/useGridSize";

const CellsSelect = ({
  handleTotalCellsSelect,
}: {
  handleTotalCellsSelect: VoidFunction;
}) => {
  return (
    <label htmlFor="total-cells" className="text-neutral-50">
      <span className="font-bold">Cells: </span>
      <select
        onChange={handleTotalCellsSelect}
        id="total-cells"
        className="text-neutral-950"
      >
        {/* Min canvas size is 300, meaning 300x200 is the max cells possible w/o subpixel rendering
              Values must fit this size AND ratio or game will not function. */}
        <option value={GRID_SIZES.sm.x * GRID_SIZES.sm.y}>
          {(GRID_SIZES.sm.x * GRID_SIZES.sm.y).toLocaleString()}
        </option>
        <option value={GRID_SIZES.md.x * GRID_SIZES.md.y}>
          {(GRID_SIZES.md.x * GRID_SIZES.md.y).toLocaleString()}
        </option>
        <option value={GRID_SIZES.lg.x * GRID_SIZES.lg.y}>{`${(
          GRID_SIZES.lg.x * GRID_SIZES.lg.y
        ).toLocaleString()} (No Grid)`}</option>
        <option value={GRID_SIZES.xl.x * GRID_SIZES.xl.y}>{`${(
          GRID_SIZES.xl.x * GRID_SIZES.xl.y
        ).toLocaleString()} (No Grid)`}</option>
      </select>
    </label>
  );
};

export default CellsSelect;
