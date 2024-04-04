import playIcon from "../../assets/play.svg";
import pauseIcon from "../../assets/pause.svg";
import nextIcon from "../../assets/next.svg";
import stopIcon from "../../assets/stop.svg";

const Controls = () => {
  return (
    <div>
      <button>{playIcon}</button>
      <button>{pauseIcon}</button>
      <button>{nextIcon}</button>
      <button>{stopIcon}</button>
    </div>
  );
};

export default Controls;
