import DevicesPanelNav from "./DevicesPanelNav";
import DevicesPanelMain from "./DevicesPanelMain";
import { useState } from "react";
import "./DevicesPanelStyle.css";

const DevicesPanel = () => {
  const [selectedDevice, setSelectedDevice] = useState(null);

  const selectDevice = (device) => {
    setSelectedDevice(device);
  };

  return (
    <div className="devicesPanel">
      <DevicesPanelNav onSelectDevice={selectDevice} />
      <DevicesPanelMain device={selectedDevice} />
    </div>
  );
};

export default DevicesPanel;
