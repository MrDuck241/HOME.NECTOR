import "../styles/RobotsPanelMainStyle.css";
import { useEffect, useState } from "react";
import DeviceModel from "./DeviceModel";

const RobotsPanelMain = ({selectedRobot}) => {
  const [show3DModel, setShow3DModel] = useState(false);
  const [robotDevicePath, setrobotDevicePath] = useState("");

  useEffect(() => {
    console.log(selectedRobot);
    if(selectedRobot){
      setShow3DModel(true);
            const path = "robots/" + selectedRobot.Device_Name;
    setrobotDevicePath(path || "No_Robot_Name_Found");
    console.log(path);
    }
  }, [selectedRobot]);

  return (
    <div className="robotsPanelMain">
      <div className="robotBtnsAndDataHolder">
        <div className="robotBtnsHolder"></div>
        <div className="robotDataHolder"></div>
      </div>
      <div className="cameraViewOr3DModelHolder">
        {show3DModel ? (
          <div className="deviceModelHolder"><DeviceModel path={robotDevicePath} /></div>
        ) : (
            <img className="robotCameraView"/>
        )}
        <div className="w-[96%] h-[20%] flex justify-evenly items-center">
          <button type="button" className="modelOrViewBtn cyanHoverBtn" onClick={() => setShow3DModel(true)}>
            Robot 3D Model
          </button>
          <button type="button" className="modelOrViewBtn cyanHoverBtn" onClick={() => setShow3DModel(false)}>
            Robot View And Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default RobotsPanelMain;
