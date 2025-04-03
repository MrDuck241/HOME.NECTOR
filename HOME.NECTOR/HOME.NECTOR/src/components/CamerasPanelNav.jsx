import { useState, useEffect, useRef } from "react";
import "../styles/CamerasPanelNavStyle.css";

const CamerasPanelNav = ({
  onSelectCamerasGridOption,
  onSelectNewViewCamDevice,
  onSelectDevicesList,
}) => {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [devicesList, setDevicesList] = useState([]);
  const [devicesCopyList, setDevicesCopyList] = useState([]);
  const [showGridOptionPopup, setShowGridOptionPopup] = useState(false);
  const [isGetStorageServerList, setIsGetStorageServerList] = useState(false);
  const [isGetBroadcastServerList, setIsGetBroadcastServerList] =
    useState(true);

  const [camerasGridOption, setCamerasGridOption] = useState(1);

  const popupRef = useRef(null);

  const devices_list_broadcast_server_url = import.meta.env
    .VITE_NODEJS_BROADCAST_SCANNING_SERVER;

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
          "who_is_esp_cam"
        );
        setDevicesList(startDevicesList);
        setDevicesCopyList(startDevicesList);
      } catch (error) {
        console.error("Error during fetching data: ", error);
      }
    };

    fetchStartData();
  }, []);

  useEffect(() => {
    console.log(String(isGetBroadcastServerList));
    console.log(String(isGetStorageServerList));
  }, [isGetBroadcastServerList, isGetStorageServerList]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowGridOptionPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const renderCameraBox = (element, index) => {
    return (
      <button className="cameraDeviceBox" key={index}>
        {element.Device_Name}
      </button>
    );
  };

  const connectToCameras = () => {
    onSelectCamerasGridOption(camerasGridOption);

    if (camerasGridOption == 1) {
      onSelectDevicesList(devicesList);
    }
  };

  const setGridOption = (option_value) => {
    setCamerasGridOption(option_value);
    onSelectCamerasGridOption(option_value);
  };

  const changeGridOption = () => {
    setShowGridOptionPopup(true);
  };

  const searchDevices = async () => {
    try {
      const newDevicesList = await getDevicesListFromBroadcast(
        devices_list_broadcast_server_url,
        "who_is_esp_cam"
      );
      setDevicesList(newDevicesList);
      setDevicesCopyList(newDevicesList);
    } catch (error) {
      console.error("Error during fetching data: ", error);
    }
  };

  return (
    <>
      {showGridOptionPopup && (
        <div className="selectGridOptionPopup" ref={popupRef}>
          <div className="optionsScrollArea">
            <div className="gridOptionBox">
              <img
                src="assets/icons/cameraGrid4x.png"
                className="gridOptionImage"
              />
              <div className="w-[60%] flex flex-col items-center">
                <span>4 X ONLY VIEW (AUTO CONNECTION)</span>
                <div className="w-[90%] flex justify-evenly mt-[5px]">
                  <button
                    className="bg-black text-white border-[3px] border-solid border-cyan-400 rounded-md p-[5px] cyanHoverBtn"
                    onClick={() => setGridOption(1)}
                  >
                    CHOOSE GRID
                  </button>
                  <button className="bg-black text-white border-[3px] border-solid border-cyan-400 rounded-md p-[5px] cyanHoverBtn">
                    LEARN MORE
                  </button>
                </div>
              </div>
            </div>
            <div className="gridOptionBox">
              <img
                src="assets/icons/cameraGrid2x.png"
                className="gridOptionImage"
              />
              <div className="w-[60%] flex flex-col items-center">
                <span>2 X ONLY VIEW (AUTO CONNECTION)</span>
                <div className="w-[90%] flex justify-evenly mt-[5px]">
                  <button
                    className="bg-black text-white border-[3px] border-solid border-cyan-400 rounded-md p-[5px] cyanHoverBtn"
                    onClick={() => setGridOption(2)}
                  >
                    CHOOSE GRID
                  </button>
                  <button className="bg-black text-white border-[3px] border-solid border-cyan-400 rounded-md p-[5px] cyanHoverBtn">
                    LEARN MORE
                  </button>
                </div>
              </div>
            </div>
            <div className="gridOptionBox">
              <img
                src="assets/icons/cameraGrid2xButtons.png"
                className="gridOptionImage"
              />
              <div className="w-[60%] flex flex-col items-center">
                <span>2 X VIEW WITH BTNs (AUTO CONNECTION)</span>
                <div className="w-[90%] flex justify-evenly mt-[5px]">
                  <button
                    className="bg-black text-white border-[3px] border-solid border-cyan-400 rounded-md p-[5px] cyanHoverBtn"
                    onClick={() => setGridOption(3)}
                  >
                    CHOOSE GRID
                  </button>
                  <button className="bg-black text-white border-[3px] border-solid border-cyan-400 rounded-md p-[5px] cyanHoverBtn">
                    LEARN MORE
                  </button>
                </div>
              </div>
            </div>
            <div className="gridOptionBox">
              <img />
              <div className="w-[60%] flex flex-col items-center">
                <span>NON SPECIFIED NUM OF VIEW WITH BUTTONS</span>
                <div className="w-[90%] flex justify-evenly mt-[5px]">
                  <button
                    className="bg-black text-white border-[3px] border-solid border-cyan-400 rounded-md p-[5px] cyanHoverBtn"
                    onClick={() => setGridOption(4)}
                  >
                    CHOOSE GRID
                  </button>
                  <button className="bg-black text-white border-[3px] border-solid border-cyan-400 rounded-md p-[5px] cyanHoverBtn">
                    LEARN MORE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="camerasPanelNav">
        <div className="cameraDevicesHolder">
          {loading ? (
            <p className="text-cyan-400 text-lg italic font-semibold">
              Loading...
            </p>
          ) : errorMsg ? (
            <div className="text-cyan-400 text-lg italic font-semibold">
              {errorMsg}
            </div>
          ) : devicesCopyList && devicesCopyList.length > 0 ? (
            devicesCopyList.map((element, index) =>
              renderCameraBox(element, index)
            )
          ) : (
            <p>No cameras available</p>
          )}
        </div>
        <div className="navControlBtnsHolder">
          <div className="navControlBtnsSubHolder1">
            <div>
              <div className="text-cyan-400 text-md font-semibold flex items-center">
                Get Server List
                <input
                  checked={isGetStorageServerList}
                  onClick={() =>
                    setIsGetStorageServerList(!isGetStorageServerList)
                  }
                  type="checkbox"
                  className="ml-[6px]"
                />
                <button
                  type="button"
                  className="w-[12px] h-[12px] bg-red-500 ml-[6px] infoBtn"
                />
              </div>
              <div className="text-cyan-400 text-md font-semibold flex items-center">
                Get Broadcast List
                <input
                  checked={isGetBroadcastServerList}
                  onClick={() =>
                    setIsGetBroadcastServerList(!isGetBroadcastServerList)
                  }
                  type="checkbox"
                  className="ml-[6px]"
                />
                <button
                  type="button"
                  className="w-[12px] h-[12px] bg-red-500 ml-[6px] infoBtn"
                />
              </div>
            </div>
            <button
              className="searchDevicesBtn cyanHoverBtn"
              onClick={() => searchDevices()}
            >
              Search Devices
            </button>
          </div>
          <div className="navControlBtnsSubHolder2">
            <div className="w-[65%] h-[100%] flex flex-col items-center justify-evenly">
              <button
                className="w-[96%] text-cyan-400 text-sm font-semibold border-solid border-[2px] border-gray-400 rounded-[8px] p-[3px] cyanHoverBtn"
                onClick={() => changeGridOption()}
              >
                Change cameras views grid
              </button>
              <button
                className="w-[96%] text-cyan-400 text-sm font-semibold border-solid border-[2px] border-gray-400 rounded-[8px] p-[3px] cyanHoverBtn"
                onClick={() => connectToCameras()}
              >
                Connect to all devices
              </button>
              <button className="w-[96%] text-cyan-400 text-sm font-semibold border-solid border-[2px] border-gray-400 rounded-[8px] p-[3px] cyanHoverBtn">
                Disconnect from all devices
              </button>
            </div>
            <div className="w-[35%] h-[100%] flex flex-col items-center justify-evenly">
              <button className="expandableMenu"></button>
              <button className="devicesListInfoBtn"></button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CamerasPanelNav;
