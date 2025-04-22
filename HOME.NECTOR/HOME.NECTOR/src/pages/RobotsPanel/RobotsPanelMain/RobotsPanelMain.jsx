import "./RobotsPanelMainStyle.css";
import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import DeviceModel from "../../DeviceModel";

const RobotsPanelMain = ({ selectedRobot, connectedToRobotClicked }) => {
  const cameraViewRef = useRef(null);
  const robotConnection = useRef(null);

  const [robotViewOption, setRobotViewOption] = useState(1);
  const [robotDevicePath, setrobotDevicePath] = useState("");

  const isCameraDetected = useRef(false);
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);

  const is2DLidarDetected = useRef(false);
  const [is2DLidarEnabled, setIs2DLidarEnabled] = useState(false);

  const isMicrophoneDetected = useRef(false);
  const [isMicrophoneEnabled, setIsMicrophoneEnabled] = useState(false);

  const connectToRobot = () => {
    const robotConnUrl = `ws://${selectedRobot.IP_Address}:${selectedRobot.Websocket_Port}`;
    robotConnection.current = new WebSocket(robotConnUrl);

    robotConnection.current.onopen = () => {
      console.log(
        `Robot connection established with: ${selectedRobot.IP_Address}`
      );
      robotConnection.current.send("START_POSITION");
    };
    robotConnection.current.onmessage = (message) =>
      handleRobotMessage(message);
    robotConnection.current.onerror = (err) =>
      console.log(`Robot connection error: ${err}`);
    robotConnection.current.onclose = () =>
      console.log("Robot connection closed");
  };

  useEffect(() => {
    if (selectedRobot) {
      connectToRobot();
      setRobotViewOption(1);
      const path = "robots/" + selectedRobot.Device_Name;
      setrobotDevicePath(path || "No_Robot_Name_Found");
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

    if (robotConnection.current)
      window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleRobotMessage = (message) => {
    const blob = new Blob([message.data], { type: "image/jpeg" });
    const imageUrl = URL.createObjectURL(blob);

    if (cameraViewRef.current) {
      URL.revokeObjectURL(cameraViewRef.current.src);
      cameraViewRef.current.src = imageUrl;
    }
  };

  const renderRobotBtn = (btnFunctionality) => {
    const loweredText = btnFunctionality.toLowerCase();

    return (
      <img
        className="robotBtn"
        title={btnFunctionality}
        src={`assets/icons/${loweredText}-icon.png`}
        onClick={() => sendMessageToRobot(btnFunctionality)}
      />
    );
  };

  const createRobotBtn = (robotFunction) => {
    if (robotFunction === "BASIC-SPIDER-MOVES") {
      return (
        <>
          {renderRobotBtn("START-POSITION")}
          {renderRobotBtn("MOVE-FORWARD")}
          {renderRobotBtn("MOVE-BACKWARD")}
          {renderRobotBtn("MOVE-LEFT")}
          {renderRobotBtn("MOVE-RIGHT")}
          {renderRobotBtn("ROTATE-LEFT")}
          {renderRobotBtn("ROTATE-RIGHT")}
        </>
      );
    } else if (robotFunction === "REFLECTOR") {
      return renderRobotBtn("REFLECTOR");
    } else if (robotFunction === "CAMERA") {
      isCameraDetected.current = true;
      return (
        <>
          {renderRobotBtn("START-CAMERA")}
          {renderRobotBtn("STOP-CAMERA")}
        </>
      );
    } else if (robotFunction === "HORIZONTAL-POINTS-LIDAR") {
      is2DLidarDetected.current = true;
      return null;
    } else if (robotFunction === "MICROPHONE") {
      isMicrophoneDetected.current = true;
      return <>{renderRobotBtn("MICROPHONE")}</>;
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
        {robotViewOption == 1 ? (
          <div className="deviceModelHolder">
            <DeviceModel path={robotDevicePath} />
          </div>
        ) : robotViewOption == 2 ? (
          <img
            className="robotCameraView"
            alt="robot camera view"
            src="assets/no-camera-signal.jpg"
            ref={(el) => {
              cameraViewRef.current = el;
            }}
          />
        ) : (
          <div className="2DLidarView"></div>
        )}
        <div className="robotInterfaceBtnsHolder">
          <button
            type="button"
            className="robotInterfaceOptionBtn cyanHoverBtn"
            onClick={() => setRobotViewOption(1)}
            title="Show Robot 3D Model"
          >
            Robot 3D Model
          </button>
          {isCameraDetected.current == true ? (
            <button
              type="button"
              className="robotInterfaceOptionBtn cyanHoverBtn"
              onClick={() => setRobotViewOption(2)}
              title="Show Robot Camera View"
            >
              Robot Camera
            </button>
          ) : null}
          {is2DLidarDetected.current == true ? (
            <button
              type="button"
              className="robotInterfaceOptionBtn cyanHoverBtn"
              onClick={() => setRobotViewOption(3)}
              title="Show Robot 2D Lidar"
            >
              2D Lidar
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default RobotsPanelMain;

//CamerasPanelMain.propTypes = {
// camerasGridOption: PropTypes.number.isRequired,
//devicesList: PropTypes.array,
//};
