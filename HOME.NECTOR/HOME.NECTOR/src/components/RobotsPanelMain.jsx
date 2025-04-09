import "../styles/RobotsPanelMainStyle.css";
import { useEffect, useRef, useState } from "react";
import DeviceModel from "./DeviceModel";

const RobotsPanelMain = ({ selectedRobot, connectedToRobotClicked }) => {
  const [show3DModel, setShow3DModel] = useState(false);
  const [robotDevicePath, setrobotDevicePath] = useState("");

  const isCameraDetected = useRef(false);
  const isHorizontalLidarDetected = useRef(false);
  const isMicrophoneDetected = useRef(false);
  const isMicrophoneEnabled = useRef(false);

  const robotConnection = useRef(null);

  useEffect(() => {
    console.log(selectedRobot);
    if (selectedRobot) {
      setShow3DModel(true);
      const path = "robots/" + selectedRobot.Device_Name;
      setrobotDevicePath(path || "No_Robot_Name_Found");
      console.log(path);
    }
  }, [selectedRobot]);

  const sendMessageToRobot = (message) => {
    if(robotConnection.current){
      robotConnection.current.send(message);
      console.log("Message has been sended to robot");
    }
    else console.log("Robot connection is closed and cannot receive message");
  }

  const handleRobotMessage = (message) => {

  }

  const connectedToRobot = () => {
    const robot_conn_url = `ws://${selectedRobot.IP_Address}:${selectedRobot.Websocket_Port}`;
    robotConnection.current = new WebSocket(robot_conn_url);

    robotConnection.current.onopen = () => console.log(`Robot connection established: ${selectedRobot.IP_Address}`);
    robotConnection.current.onmessage = (event) => handleRobotMessage(event);
    robotConnection.current.onerror = (err) => console.log(`Robot connection has error: ${err}`);
    robotConnection.current.onclose = () => console.log("Robot connection closed");
  }

  useEffect(() => {
    console.log("Connecting to robot in useEffect");
    if(connectedToRobotClicked) connectedToRobot();
  }, []);

  const createRobotBtn = (robotFunction) => {
    if (robotFunction === "BASIC_SPIDER_MOVES") {
      return (
        <>
          <img
            src="assets/icons/MOVE_FORWARD.png"
            className="robotBtn"
            title="MOVE_FORWARD"
            onClick={() => sendMessageToRobot("MOVE_FORWARD")}
          />
          <img
            src="assets/icons/MOVE_BACKWARD.png"
            className="robotBtn"
            title="MOVE_BACKWARD"
            onClick={() => sendMessageToRobot("MOVE_BACKWARD")}
          />
          <img
            src="assets/icons/MOVE_LEFT.png"
            className="robotBtn"
            title="MOVE_LEFT"
            onClick={() => sendMessageToRobot("MOVE_LEFT")}
          />
          <img
            src="assets/icons/MOVE_RIGHT.png"
            className="robotBtn"
            title="MOVE_RIGHT"
            onClick={() => sendMessageToRobot("MOVE_RIGHT")}
          />
          <img
            src="assets/icons/ROTATE_LEFT.png"
            className="robotBtn"
            title="ROTATE_LEFT"
            onClick={() => sendMessageToRobot("ROTATE_LEFT")}
          />
          <img
            src="assets/icons/ROTATE_RIGHT.png"
            className="robotBtn"
            title="ROTATE_RIGHT"
            onClick={() => sendMessageToRobot("ROTATE_RIGHT")}
          />
        </>
      );
    } else if (robotFunction === "REFLECTOR") {
      return (
        <img
          src="assets/icons/REFLECTOR.png"
          className="robotBtn"
          title="REFLECTOR"
        />
      );
    } else if (robotFunction === "CAMERA") {
      isCameraDetected.current = false;
      return null;
    } else if (robotFunction === "HORIZONTAL_POINTS_LIDAR") {
      isHorizontalLidarDetected.current = true;
      return null;
    } else if (robotFunction === "MICROPHONE") {
      isMicrophoneDetected.current = true;
      isMicrophoneEnabled.current = true;
      return (
        <img
          src="assets/icons/MICROPHONE.png"
          className="robotBtn"
          title="MICROPHONE"
        />
      );
    }
  };

  return (
    <div className="robotsPanelMain">
      <div className="robotBtnsAndDataHolder">
        <div className="robotBtnsHolder">
          {selectedRobot
            ? JSON.parse(selectedRobot.Device_Functions).map(
                (robotFunction) => {
                  const element = createRobotBtn(robotFunction);
                  if (element) return element;
                }
              )
            : null}
        </div>
        <div className="robotDataHolder"></div>
      </div>
      <div className="cameraViewOr3DModelHolder">
        {show3DModel ? (
          <div className="deviceModelHolder">
            <DeviceModel path={robotDevicePath} />
          </div>
        ) : (
          <img className="robotCameraView" />
        )}
        <div className="w-[96%] h-[20%] flex justify-evenly items-center">
          <button
            type="button"
            className="modelOrViewBtn cyanHoverBtn"
            onClick={() => setShow3DModel(true)}
          >
            Robot 3D Model
          </button>

          <button
            type="button"
            className="modelOrViewBtn cyanHoverBtn"
            onClick={() => setShow3DModel(false)}
          >
            Robot View
          </button>
        </div>
      </div>
    </div>
  );
};

export default RobotsPanelMain;
