import { ChangeEventHandler } from "react";
import { GRID_SIZES } from "../GameCanvas/useGridSize";

const CellsSelect = ({
  handleTotalCellsSelect,
}: {
  handleTotalCellsSelect: ChangeEventHandler;
}) => {
  return (
    <label htmlFor="total-cells" className="text-neutral-50">
      <span className="font-bold">Cells: </span>
      <select
        onChange={handleTotalCellsSelect}
        id="total-cells"
        className="text-neutral-950 rounded-sm"
      >
        {GRID_SIZES.map((size, index) => {
          return (
            <option value={index} key={index}>{`${(
              size.x * size.y
            ).toLocaleString()} Cells`}</option>
          );
        })}
      </select>
    </label>
  );
};

export default CellsSelect;
