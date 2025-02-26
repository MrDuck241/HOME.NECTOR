import "../styles/CamerasPanelStyle.css";
import CamerasPanelMain from "./CamerasPanelMain";
import CamerasPanelNav from "./CamerasPanelNav";
import { useState } from "react";

const CamerasPanel = () => {
  const [view1CamDevice, setView1CamDevice] = useState(null);
  const [view2CamDevice, setView2CamDevice] = useState(null);

  const selectCamDevice = (viewID, camDevice) => {
    if (viewID == 1) {
      setView1CamDevice(camDevice);
    } else if (viewID == 2) {
      setView2CamDevice(camDevice);
    }
  };

  return (
    <div className="camerasPanel">
      <CamerasPanelNav onSelectCamDevice={selectCamDevice} />
      <CamerasPanelMain
        view1CamDevice={view1CamDevice}
        view2CamDevice={view2CamDevice}
      />
    </div>
  );
};

export default CamerasPanel;
