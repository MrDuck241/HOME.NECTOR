import "../styles/RobotsPanelNavStyle.css";
import { useState, useEffect } from "react";

const RobotsPanelNav = ({onSelectRobot}) => {
  const [detectedRobotsList, setDetectedRobotsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const devices_list_broadcast_server_url = import.meta.env
    .VITE_NODEJS_BROADCAST_SCANNING_SERVER;

  const testRobotData = [{
    Device_Name: "SRV"
  }]

  const getDevicesListFromBroadcast = (url, message) => {
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ queryMessage: message }),
    })
      .then((response) => {
        if (!response.ok) {
          setErrorMsg("Error during loading data");
        }
        return response.json();
      })
      .then((data) => {
        const transformedDeviceList = data.devices.map((obj, id) => ({
          ...obj,
          id: id,
          Device_Name: obj.Device_Model + "-" + id,
          Data_Source: "broadcastServer",
        }));

        setLoading(false);
        return transformedDeviceList;
      })
      .catch(() => {
        setErrorMsg("Failed to scan devices with broadcast");
        setLoading(false);
        return null;
      });
  };

  useEffect(() => {
    const fetchStartData = async () => {
      try {
        const startDevicesList = await getDevicesListFromBroadcast(
          devices_list_broadcast_server_url,
          "who_is_iot_robot"
        );
        setDetectedRobotsList(startDevicesList);
      } catch (error) {
        console.error("Error during fetching data: ", error);
      }
    };

    //fetchStartData();
    setLoading(false);
    setDetectedRobotsList(testRobotData);
  }, []);

  const selectRobot = (selectedRobotData) => {
    onSelectRobot(selectedRobotData);
  }

  const renderRobotBox = (element, index) => {
    return (
      <button className="cameraDeviceBox" key={index} onClick={() => selectRobot(element)}>
        {element.Device_Name}
      </button>
    );
  };

  return (
    <div className="robotsPanelNav">
      <div className="robotsHolder">
        {loading ? (
          <p className="text-cyan-400 text-lg italic font-semibold">
            Loading...
          </p>
        ) : errorMsg ? (
          <div className="text-cyan-400 text-lg italic font-semibold">
            {errorMsg}
          </div>
        ) : detectedRobotsList && detectedRobotsList.length > 0 ? (
          detectedRobotsList.map((element, index) =>
            renderRobotBox(element, index)
          )
        ) : (
          <p>No robots available</p>
        )}
      </div>
      <div className="robotsNavBtnsHolder">
        <div className="w-[40%] h-[100%] bg-slate-200 flex flex-col justify-evenly items-center">
          <div>
            <div className="flex items-center gap-[5px]">
              <span className="text-cyan-400">Get Server List</span>
              <input type="checkbox" />
              <button type="button" className="infoBtn" />
            </div>
            <div className="flex items-center gap-[5px]">
              <span className="text-cyan-400">Get Broadcast List</span>
              <input type="checkbox" />
              <button type="button" className="infoBtn" />
            </div>
          </div>
          <button type="button" className="searchDevicesBtn cyanHoverBtn">
            Search Devices
          </button>
        </div>
      </div>
    </div>
  );
};

export default RobotsPanelNav;
