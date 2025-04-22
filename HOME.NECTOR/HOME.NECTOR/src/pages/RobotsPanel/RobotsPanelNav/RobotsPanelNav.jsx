import "./RobotsPanelNavStyle.css";
import { useState, useEffect } from "react";

import {
  CyanBtn,
  InfoBtn,
  ExpandableMenu,
  DeviceTile,
} from "../../../components/buttons/Buttons";
import {
  PanelNavDevicesHolder,
  PanelNavBtnsHolder,
  PanelNavHolder,
} from "../../../components/holders/Holders";
import { NoRobotsAvaiableMsg } from "../../../components/messages/Messages";

const RobotsPanelNav = ({ onSelectRobot, isRobotConnectionConfirmed }) => {
  const [detectedRobotsList, setDetectedRobotsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isRobotSelected, setIsRobotSelected] = useState(false);

  const devices_list_broadcast_server_url = import.meta.env
    .VITE_BROADCAST_SCAN_URL;

  const transformDevicesList = (robotsList) => {
    const transformedRobotList = robotsList.map((obj, id) => ({
      ...obj,
      Id: id,
      Device_Name: obj.Device_Model + "-" + id,
      Data_Source: "broadcastServer",
    }));
    return transformedRobotList;
  };

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
        setLoading(false);
        return transformDevicesList(data.devices);
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

    fetchStartData();
    setLoading(false);
  }, []);

  const selectRobot = (selectedRobotData) => {
    onSelectRobot(selectedRobotData);
    setIsRobotSelected(true);
  };

  const connectToRobotBtnHandler = () => {
    isRobotConnectionConfirmed(true);
  };

  const cancelRobotBtnHandler = () => {
    isRobotConnectionConfirmed(false);
  };

  /* renderRobotBox is box holding each detected robot in network */
  const renderRobotBox = (element, index) => {
    return (
      <DeviceTile key={index} onClickFunction={() => selectRobot(element)}>
        {element.Device_Name}
      </DeviceTile>
    );
  };

  const renderInfoBtn = () => {
    return <button type="button" className="infoBtn" title="Learn more" />;
  };

  return (
    <PanelNavHolder>
      <PanelNavDevicesHolder>
        {loading ? (
          <span className="robotsHolderCyanInfo">Loading...</span>
        ) : errorMsg ? (
          <div className="robotsHolderErrorArea">{errorMsg}</div>
        ) : detectedRobotsList && detectedRobotsList.length > 0 ? (
          detectedRobotsList.map((element, index) =>
            renderRobotBox(element, index)
          )
        ) : (
          <NoRobotsAvaiableMsg />
        )}
      </PanelNavDevicesHolder>
      <PanelNavBtnsHolder>
        <div className="w-[40%] h-[100%] flex flex-col justify-evenly items-center">
          <div>
            <div className="flex items-center gap-[5px]">
              <span className="cyanText">Get Server List</span>
              <input type="checkbox" />
              {renderInfoBtn()}
            </div>
            <div className="flex items-center gap-[5px]">
              <span className="cyanText">Get Broadcast List</span>
              <input type="checkbox" />
              {renderInfoBtn()}
            </div>
          </div>
          <CyanBtn text={"Search Devices"} onClickFunction={null} />
        </div>
        <div className="robotConnectionBtnsHolder">
          <button
            className="robotConnectionBtn cyanBtn"
            onClick={() => connectToRobotBtnHandler()}
          >
            Connect To Selected Robot
          </button>
          <button
            className="robotConnectionBtn cyanBtn"
            disabled={!isRobotSelected}
            onClick={() => cancelRobotBtnHandler()}
          >
            Cancel Selected Robot
          </button>
        </div>
        <div className="flex flex-col items-center justify-evenly w-[20%]">
          <ExpandableMenu onClickFunction={null} />
        </div>
      </PanelNavBtnsHolder>
    </PanelNavHolder>
  );
};

export default RobotsPanelNav;
