import "../components_styles/DevicesPanelMainStyle.css";
import { useState, useEffect, useRef, useMemo } from "react";
import DeviceModel from "./DeviceModel";

// Hook for handling WebSocket
const useWebSocket = (device, setDeviceData) => {
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    if (!device) return;
    const ws = new WebSocket(`ws://${device.IP_Address}`);
    setConnection(ws);

    const handleOpen = () =>
      console.log(`${device.IP_Address} connection established`);

    ws.onclose = () => {
      console.log(`${device.IP_Address} connection closed`);
    };

    const handleError = () =>
      console.log(`${device.IP_Address} connection error`);

    const handleMessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setDeviceData(data);
      } catch (error) {
        console.error("JSON parse error:", error);
      }
    };

    ws.addEventListener("open", handleOpen);
    ws.addEventListener("error", handleError);
    ws.addEventListener("message", handleMessage);

    return () => {
      ws.removeEventListener("open", handleOpen);
      ws.removeEventListener("error", handleError);
      ws.removeEventListener("message", handleMessage);
      ws.close();
    };
  }, [device]);

  return { connection };
};

const DevicesPanelMain = ({ device }) => {
  const [deviceData, setDeviceData] = useState([]);
  const [isDeviceSelected, setIsDeviceSelected] = useState(false);
  const [deviceModelSrc, setDeviceModelSrc] = useState("");
  const [intervalId, setIntervalId] = useState(null);
  const [isSendingDeviceData, setIsSendingDeviceData] = useState(false);

  const nodeJSDeviceDataServer = import.meta.env.VITE_NODEJS_DEVICE_DATA_SERVER;

  useEffect(() => {
    if (device) {
      setIsDeviceSelected(true);
      let path = String(device.Device_Name).split("-")[0];
      path = "devices/" + path;

      setDeviceModelSrc(path);
    } else {
      setDeviceModelSrc("");
      setIsDeviceSelected(false);
    }
    return () => clearInterval(intervalId); // Clear interval after unmounting a component
  }, [device]);

  const sendDeviceDataToServer = () => {
    if (!intervalId) {
      setIsSendingDeviceData(!isSendingDeviceData);
      const id = setInterval(() => {
        let data = deviceData;
        data.Device_Name = device.Device_Name;
        data.Location = device.Location;

        fetch(nodeJSDeviceDataServer, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Błąd HTTP! Status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => console.log("Success:", data))
          .catch((error) => console.error("Error:", error));
      }, 1000);
      setIntervalId(id);
    }
  };

  const stopSendingDeviceDataToServer = () => {
    if (intervalId) {
      setIsSendingDeviceData(!isSendingDeviceData);
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  const { connection: deviceConn } = useWebSocket(device, setDeviceData);
  return (
    <div className="devicesPanelMain">
      {isDeviceSelected && (
        <>
          <span className="deviceFullNameHolder">{device.Full_Name}</span>
          <div className="deviceDataBoxesGrid">
            <div className="deviceDescriptionAndButtonsHolder">
              <span className="descriptionHolderTitle">Device Description</span>
              <div className="descriptionHolder">{device.Description}</div>
              <div className="descriptionButtonsHolder">
                <input
                  type="text"
                  placeholder="Enter current device location"
                  defaultValue={device.Location}
                  className="deviceLocationHolder"
                ></input>
                <button
                  type="button"
                  className="deviceLocationChangeBtn cyanStyleBtn"
                >
                  Change
                </button>
              </div>
            </div>
            <div className="deviceDataAndButtonsHolder">
              <div className="deviceDataHolder">
                <span className="deviceDataHolderTitle">Device Data: </span>
                <div className="deviceDataTextHolder">
                  {deviceData?.data && Array.isArray(deviceData.data) ? (
                    deviceData.data.map((obj, index) =>
                      Object.entries(obj).map(([key, value]) => (
                        <span key={`${index}-${key}`}>
                          {key}: {String(value)}
                        </span>
                      ))
                    )
                  ) : (
                    <span>No data available</span>
                  )}
                </div>
                <div className="deviceDataOptionsHolder">
                  <button
                    type="button"
                    className="startSavingDataBtn cyanStyleBtn"
                    onClick={
                      isSendingDeviceData
                        ? stopSendingDeviceDataToServer
                        : sendDeviceDataToServer
                    }
                  >
                    {isSendingDeviceData
                      ? "Stop saving data"
                      : "Start Saving Data"}
                  </button>
                  <button
                    type="button"
                    className="savingDataSettingBtn"
                  ></button>
                  <button
                    type="button"
                    className="showDataHistoryBtn cyanStyleBtn"
                  >
                    Show Data History
                  </button>
                </div>
              </div>
              <div className="deviceButtonHolder">
                <div className="buttonsHolder">
                  <div className="buttonScroll">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries,
                    but also the leap into electronic typesetting, remaining
                    essentially unchanged. It was popularised in the 1960s with
                    the release of Letraset sheets containing Lorem Ipsum
                    passages, and more recently with desktop publishing software
                    like Aldus PageMaker including versions of Lorem Ipsum
                  </div>
                </div>
                <button
                  type="button"
                  className="hideDeviceButtonsBtn cyanStyleBtn"
                >
                  Hide Device Buttons
                </button>
              </div>
            </div>
            <div className="device3DModelHolder">
              <DeviceModel path={deviceModelSrc} />
            </div>
            <div className="deviceDataChartHolder"></div>
          </div>
        </>
      )}
    </div>
  );
};

export default DevicesPanelMain;
