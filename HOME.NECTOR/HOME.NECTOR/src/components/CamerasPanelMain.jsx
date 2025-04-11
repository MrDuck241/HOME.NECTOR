import { useEffect, useRef } from "react";
import "../components_styles/CamerasPanelMainStyle.css";

const CamerasPanelMain = ({ camerasGridOption, devicesList }) => {
  const imageRefs = useRef({});
  const socketsRef = useRef({});

  useEffect(() => {
    devicesList.forEach((camera) => {
      const url = `ws://${camera.IP_Address}:${camera.Websocket_Port}`;
      const ws = new WebSocket(url);

      ws.onopen = () =>
        console.log(`Connected with camera: ${camera.IP_Address}`);

      ws.onmessage = (event) => {
        const blob = new Blob([event.data], { type: "image/jpeg" });
        const imageUrl = URL.createObjectURL(blob);

        if (imageRefs.current[camera.id]) {
          URL.revokeObjectURL(imageRefs.current[camera.id].src);
          imageRefs.current[camera.id].src = imageUrl;
        }
      };

      ws.onerror = (error) =>
        console.error(`Error with camera: ${camera.IP_Address}`, error);
      ws.onclose = () =>
        console.log(`Connection closed with camera: ${camera.IP_Address}`);

      socketsRef.current[camera.id] = ws;
    });

    return () => {
      Object.values(socketsRef.current).forEach((ws) => ws.close());
    };
  }, [devicesList]);

  const sendMessageToDevice = (device_id, message) => {
    const socket = socketsRef.current[device_id];
    if (socket) {
      socket.send(message);
    } else {
      console.error(`No WebSocket connection found for device: ${device_id}`);
    }
  };

  const renderCameraBtn = (camera_btn_data, device_id) => {
    const regex = /^([^\[]+)\[([^\[]+)\/([^\]]+)\]$/;
    const match = camera_btn_data.match(regex);
    if (match) {
      const firstPart = match[1];
      const secondPart = match[2];
      const thirdPart = match[3];
      return (
        <img
          className="h-[80px] w-[80px] "
          src={`assets/icons/${firstPart}.png`}
          onClick={() => sendMessageToDevice(device_id, secondPart)}
        />
      );
    } else {
      console.log("Text in camera_btn_data does not match the proper format");
      return null;
    }
  };

  const renderDeviceView1 = (device, id) => {
    console.log(device.Device_Functions);
    return camerasGridOption == 1 || camerasGridOption == 2 ? (
      <img
        key={id}
        ref={(el) => (imageRefs.current[id] = el)}
        className={camerasGridOption == 1 ? "deviceView1" : "deviceView2"}
      />
    ) : (
      <div className="deviceViewWithBtns">
        <div className="flex flex-col justify-evenly h-[100%] w-[430px]">
          <img
            key={id}
            ref={(el) => (imageRefs.current[id] = el)}
            className="deviceView3"
          />
          <div className="h-[100px] flex flex-col overflow-y-auto cameraInfoHolder">
            <span className="shrink-0">MAC Address: {device.MAC_Address}</span>
            <span className="shrink-0">IP Address: {device.IP_Address}</span>
            <span className="shrink-0">Location: Kitchen</span>
            <span className="shrink-0">Device Type: {device.Device_Type} </span>
            <span className="shrink-0">
              Device Model: {device.Device_Model}
            </span>
          </div>
        </div>
        <div className="cameraBtnsHolder">
          {device.Device_Functions.map((device_function) => {
            return renderCameraBtn(device_function, device.id);
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="main">
      {devicesList.length > 0 && (
        <div
          className={`camerasViewsScrollableArea ${
            camerasGridOption == 1
              ? "camerasViewsArea4x"
              : camerasGridOption == 2 || camerasGridOption == 3
              ? "camerasViewsArea2x"
              : "camerasViewsArea2xBtns"
          }`}
        >
          {devicesList.map((device) => renderDeviceView1(device, device.id))}
        </div>
      )}
    </div>
  );
};

export default CamerasPanelMain;
