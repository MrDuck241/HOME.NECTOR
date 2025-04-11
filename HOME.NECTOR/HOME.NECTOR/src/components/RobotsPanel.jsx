import "../components_styles/RobotsPanelStyle.css";
import RobotsPanelMain from "./RobotsPanelMain";
import RobotsPanelNav from "./RobotsPanelNav";
import { useState } from "react";

const RobotsPanel = () => {
  const [selectedRobot, setSelectedRobot] = useState(null);
  const [connectRobotClicked, setConnectRobotClicked] = useState(false);

  const connectToRobotClick = (value) => {
    console.log("AKTUALNA WARTOSC CONNECT TO ROBOT", String(value));
    setConnectRobotClicked(value);
  };

  const selectRobot = (robotDevice) => {
    console.log(robotDevice);
    setSelectedRobot(robotDevice);
  };

  const cancelSelection = () => {
    setSelectedRobot(null);
  };

  return (
    <div className="robotsPanel">
      <RobotsPanelNav
        onSelectRobot={selectRobot}
        onRobotConnectClick={connectToRobotClick}
      />
      <RobotsPanelMain
        onCancelSelection={cancelSelection}
        selectedRobot={selectedRobot}
        connectedToRobotClicked={connectRobotClicked}
      />
    </div>
  );
};

export default RobotsPanel;
