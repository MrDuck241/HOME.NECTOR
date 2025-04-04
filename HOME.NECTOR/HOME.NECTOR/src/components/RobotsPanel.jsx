import "../styles/RobotsPanelStyle.css";
import RobotsPanelMain from "./RobotsPanelMain";
import RobotsPanelNav from "./RobotsPanelNav";
import { useState } from "react";

const RobotsPanel = () => {
  const [selectedRobot, setSelectedRobot] = useState(null);

  const selectRobot = (robotDevice) => {
    console.log(robotDevice);
    setSelectedRobot(robotDevice);
  };

  const cancelSelection = () => {
    setSelectedRobot(null);
  };

  return (
    <div className="robotsPanel">
      <RobotsPanelNav onSelectRobot={selectRobot} />
      <RobotsPanelMain
        onCancelSelection={cancelSelection}
        selectedRobot={selectedRobot}
      />
    </div>
  );
};

export default RobotsPanel;
