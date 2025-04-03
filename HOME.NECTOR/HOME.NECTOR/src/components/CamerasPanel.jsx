import "../styles/CamerasPanelStyle.css";
import CamerasPanelMain from "./CamerasPanelMain";
import CamerasPanelNav from "./CamerasPanelNav";
import { useState } from "react";

const CamerasPanel = () => {
  const [camerasGridOption, setCamerasGridOption] = useState(1);
  const [newViewCamDevice, setNewViewCamDevice] = useState(null);
  const [devicesList, setDevicesList] = useState([]);

  const selectCamerasGridOption = (option_value) => {
    setCamerasGridOption(option_value);
  };

  const selectNewViewCamDevice = (new_device) => {
    setNewViewCamDevice(new_device);
  };

  const selectDevicesList = (devices_list) => {
    setDevicesList(devices_list);
  };

  return (
    <div className="camerasPanel">
      <CamerasPanelNav
        onSelectCamerasGridOption={selectCamerasGridOption}
        onSelectNewViewCamDevice={selectNewViewCamDevice}
        onSelectDevicesList={selectDevicesList}
      />
      <CamerasPanelMain
        camerasGridOption={camerasGridOption}
        newViewCamDevice={newViewCamDevice}
        devicesList={devicesList}
      />
    </div>
  );
};

export default CamerasPanel;
