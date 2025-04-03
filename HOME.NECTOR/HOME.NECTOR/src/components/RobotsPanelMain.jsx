import "../styles/RobotsPanelMainStyle.css";
import { useState } from "react";
import DeviceModel from "./DeviceModel";

const RobotsPanelMain = () => {
  const [show3DModel, setShow3DModel] = useState(false);
  const [deviceModelPath, setDeviceModelPath] = useState("");

  return (
    <div className="robotsPanelMain">
      <div className="robotBtnsHolder"></div>
      <div className="cameraViewAndRobotDataHolder">
        {show3DModel ? (
          <DeviceModel path={deviceModelPath} />
        ) : (
          <div className="cameraViewAndRobotDataHolder">
            <img className="robotCameraView" />
            <div className="robotDataHolder"></div>
          </div>
        )}
        <div className="w-[96%] h-[8%] flex justify-evenly items-center">
          <button type="button" className="modelOrViewBtn cyanHoverBtn">
            Robot 3D Model
          </button>
          <button type="button" className="modelOrViewBtn cyanHoverBtn">
            Robot View And Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default RobotsPanelMain;
