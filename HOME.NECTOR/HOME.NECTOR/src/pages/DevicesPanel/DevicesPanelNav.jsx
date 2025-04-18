import "./DevicesPanelNavStyle.css";
import { useEffect, useState } from "react";

const DevicesPanelNav = ({ onSelectDevice }) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [allDevicesList, setAllDevicesList] = useState([]); // Combine list of fetched and broadcast detected devices lists

  const [selectedDeviceBuffor, setSelectedDeviceBuffor] = useState(null);

  const [isGetServer_ListChecked, setIsGetServer_ListChecked] = useState(false);
  const [isSendBroadcastChecked, setIsSendBroadcastChecked] = useState(false);

  const devices_list_server_url = import.meta.env
    .VITE_GET_DEVICES_PHP_SCRIPT_ADDRESS;
  const devices_list_broadcast_server_url = import.meta.env
    .VITE_NODEJS_BROADCAST_SCANNING_SERVER;
  const device_info_serverl_url = import.meta.env
    .VITE_GET_DEVICES_INFO_PHP_SCRIPT_ADDRESS;

  const getDevicesListFromServer = (url) => {
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          setErrorMsg("Error during loading data");
        }
        return response.json();
      })
      .then((data) => {
        const transformedDeviceList = data.data.map((obj) => ({
          ...obj,
          Data_Source: "Server_List",
        }));

        setLoading(false);
        return transformedDeviceList;
      })
      .catch(() => {
        setErrorMsg("Failed to download devices from database");
        setLoading(false);
        return null;
      });
  };

  const getDevicesListFromBroadcast = (url) => {
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ queryMessage: "who_is_esp" }),
    })
      .then((response) => {
        if (!response.ok) {
          setErrorMsg("Error during loading data");
        }
        return response.json();
      })
      .then((data) => {
        const transformedDeviceList = data.devices.map((obj) => ({
          ...obj,
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
        const startDevicesList = await getDevicesListFromServer(
          devices_list_server_url
        );
        setAllDevicesList(startDevicesList);
      } catch (error) {
        console.error("Error during fetching data: ", error);
      }
    };

    fetchStartData();
  }, []);

  const fetchDeviceData = (Device_Model) => {
    return fetch(device_info_serverl_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Device_Model: Device_Model }),
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch((error) => console.error("Error:", error));
  };

  const addDataToDetectedDevices = async (device) => {
    const helpFunction = async (deviceModel) => {
      try {
        const extendedDeviceInfo = await fetchDeviceData(deviceModel);
        console.log(extendedDeviceInfo);
        device.Description = extendedDeviceInfo.data[0].Description;
        device.Buttons = extendedDeviceInfo.data[0].Buttons;
        device.Full_Name = extendedDeviceInfo.data[0].Full_Name;
        console.log(device);
        device.IP_Address += ":" + device.Websocket_Port;
        return device;
      } catch (error) {
        console.error("Error during extending device data: ", error);
      }
    };
    console.log("Device data: ", device);
    const deviceModel = device.Device_Name.split("-")[0]; // From MSD-1, deviceModel will have value: MSD

    const newDeviceData = await helpFunction(deviceModel);

    return newDeviceData;
  };

  const updateDeviceList = async () => {
    let devicesFromBroadcastServer;
    let devicesFromStorageServer;

    if (isSendBroadcastChecked) {
      devicesFromBroadcastServer = await getDevicesListFromBroadcast(
        devices_list_broadcast_server_url
      );
    }
    if (isGetServer_ListChecked) {
      devicesFromStorageServer = await getDevicesListFromServer(
        devices_list_server_url
      );
    }
    let newArray;
    if (devicesFromBroadcastServer) {
      newArray = await Promise.all(
        devicesFromBroadcastServer.map(async (device) => {
          return await addDataToDetectedDevices(device);
        })
      );
    }

    const uniqueArray = new Map();
    if (isGetServer_ListChecked) {
      devicesFromStorageServer.forEach((obj) =>
        uniqueArray.set(obj.Device_Name, obj)
      );
    }
    if (newArray) {
      newArray.forEach((obj) => {
        if (!uniqueArray.has(obj.Device_Name)) {
          uniqueArray.set(obj.Device_Name, obj);
        }
      });
    }

    setAllDevicesList(Array.from(uniqueArray.values()));
  };

  const onDeviceClick = (element) => {
    setSelectedDeviceBuffor(element);
  };

  const renderDeviceBox = (element, index) => {
    return (
      <button
        type="button"
        className={
          element.Data_Source == "Server_List"
            ? "deviceBtn"
            : "broadcastDeviceBtn"
        }
        key={index}
        onClick={() => onDeviceClick(element)}
      >
        {element.Device_Name}
      </button>
    );
  };

  const connectToDevice = () => {
    if (selectedDeviceBuffor) {
      onSelectDevice(selectedDeviceBuffor);
    }
  };

  return (
    <div className="devicesPanelNav">
      <div className="devicesHolder">
        {loading ? (
          <p className="text-cyan-400 text-lg italic font-semibold">
            Loading...
          </p>
        ) : errorMsg ? (
          <div className="text-red-600 text-lg italic font-semibold">
            {errorMsg}
          </div>
        ) : allDevicesList && allDevicesList.length > 0 ? (
          allDevicesList.map((element, index) =>
            renderDeviceBox(element, index)
          )
        ) : (
          <p>No devices available</p>
        )}
      </div>
      <div className="scanBtnElementsHolder">
        <button
          type="button"
          className="navPanelSmallBtn"
          onClick={updateDeviceList}
        >
          Search Devices
        </button>
        <div className="scanBtnOptionsHolder">
          <div>
            <input
              type="checkbox"
              checked={isGetServer_ListChecked}
              onChange={(e) => setIsGetServer_ListChecked(e.target.checked)}
            ></input>{" "}
            Get Server Devices List
          </div>
          <div>
            <input
              type="checkbox"
              checked={isSendBroadcastChecked}
              onChange={(e) => setIsSendBroadcastChecked(e.target.checked)}
            ></input>{" "}
            Send ping message to devices
          </div>
        </div>
      </div>
      <button type="button" className="navPanelBtn" onClick={connectToDevice}>
        Connect to Device
      </button>
      <button type="button" className="navPanelBtn">
        Disconnect from Device
      </button>
    </div>
  );
};

export default DevicesPanelNav;
