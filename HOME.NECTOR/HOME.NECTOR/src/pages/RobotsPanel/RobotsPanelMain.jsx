import "./RobotsPanelMainStyle.css";
import { useEffect, useRef, useState } from "react";
import DeviceModel from "../DeviceModel";

const RobotsPanelMain = ({ selectedRobot, connectedToRobotClicked }) => {
  const [show3DModel, setShow3DModel] = useState(false);
  const [robotDevicePath, setrobotDevicePath] = useState("");

  const isCameraDetected = useRef(false);
  const isHorizontalLidarDetected = useRef(false);
  const isMicrophoneDetected = useRef(false);
  const isMicrophoneEnabled = useRef(false);

  const robotConnection = useRef(null);

  const connectToRobot = () => {
    console.log("Connection function");
    const robot_conn_url = `ws://${selectedRobot.IP_Address}:${selectedRobot.Websocket_Port}`;
    robotConnection.current = new WebSocket(robot_conn_url);

    robotConnection.current.onopen = () =>
      console.log(`Robot connection established: ${selectedRobot.IP_Address}`);
    robotConnection.current.onopen = () =>
      robotConnection.current.send("START_POSITION");
    robotConnection.current.onmessage = (event) => handleRobotMessage(event);
    robotConnection.current.onerror = (err) =>
      console.log(`Robot connection has error: ${err}`);
    robotConnection.current.onclose = () =>
      console.log("Robot connection closed");
  };

  useEffect(() => {
    if (selectedRobot) connectToRobot();
    if (selectedRobot) {
      setShow3DModel(true);
      const path = "robots/" + selectedRobot.Device_Name;
      setrobotDevicePath(path || "No_Robot_Name_Found");
      console.log(path);
    }
  }, [selectedRobot]);

  const sendMessageToRobot = (message) => {
    if (robotConnection.current) {
      robotConnection.current.send(message);
      console.log("Message has been sended to robot");
    } else console.log("Robot connection is closed and cannot receive message");
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "w" || event.key === "ArrowUp") {
        sendMessageToRobot("MOVE_FORWARD");
      } else if (event.key === "s" || event.key === "ArrowDown") {
        sendMessageToRobot("MOVE_BACKWARD");
      } else if (event.key === "d" || event.key === "ArrowRight") {
        sendMessageToRobot("ROTATE_RIGHT");
      } else if (event.key === "a" || event.key === "ArrowLeft") {
        sendMessageToRobot("ROTATE_LEFT");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleRobotMessage = (message) => {};

  const createRobotBtn = (robotFunction) => {
    if (robotFunction === "BASIC_SPIDER_MOVES") {
      return (
        <>
          <img
            src="assets/icons/start-position-icon.jpg"
            className="robotBtn"
            title="START_POSITION"
            onClick={() => sendMessageToRobot("START_POSITION")}
          />
          <img
            src="assets/icons/move-forward-icon.png"
            className="robotBtn"
            title="MOVE_FORWARD"
            onClick={() => sendMessageToRobot("MOVE_FORWARD")}
          />
          <img
            src="assets/icons/move-backward-icon.png"
            className="robotBtn"
            title="MOVE_BACKWARD"
            onClick={() => sendMessageToRobot("MOVE_BACKWARD")}
          />
          <img
            src="assets/icons/move-left-icon.png"
            className="robotBtn"
            title="MOVE_LEFT"
            onClick={() => sendMessageToRobot("MOVE_LEFT")}
          />
          <img
            src="assets/icons/move-right-icon.png"
            className="robotBtn"
            title="MOVE_RIGHT"
            onClick={() => sendMessageToRobot("MOVE_RIGHT")}
          />
          <img
            src="assets/icons/rotate-left-icon.png"
            className="robotBtn"
            title="ROTATE_LEFT"
            onClick={() => sendMessageToRobot("ROTATE_LEFT")}
          />
          <img
            src="assets/icons/rotate-right-icon.png"
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
          <img
            className="robotCameraView"
            alt="robot camera view"
            src="assets/no-camera-signal.jpg"
          />
        )}
        <div className="cameraOr3DModelBtnsHolder">
          <button
            type="button"
            className="modelOrViewBtn cyanHoverBtn"
            onClick={() => setShow3DModel(true)}
            title="Show Robot 3D Model"
          >
            Robot 3D Model
          </button>

          <button
            type="button"
            className="modelOrViewBtn cyanHoverBtn"
            onClick={() => setShow3DModel(false)}
            title="Show Robot Camera View"
          >
            Robot Camera
          </button>
        </div>
      </div>
    </div>
  );
};

export default RobotsPanelMain;
