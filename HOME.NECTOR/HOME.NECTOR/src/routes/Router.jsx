import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import MainLayout from "../layout/MainLayout";

import Home from "../pages/Home/Home";
import CamerasPanel from "../pages/CamerasPanel/CamerasPanel";
import RobotsPanel from "../pages/RobotsPanel/RobotsPanel";
import DevicesPanel from "../pages/DevicesPanel/DevicesPanel";
import AlternativeViewPanel from "../pages/AlternativeViewPanel";
import LearnMorePanel from "../pages/LearnMore/LearnMore";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<Home />} />
      <Route path="cameras" element={<CamerasPanel />} />
      <Route path="robots" element={<RobotsPanel />} />
      <Route path="devices" element={<DevicesPanel />} />
      <Route path="alternative_view" element={<AlternativeViewPanel />} />
      <Route path="learn_more" element={<LearnMorePanel />} />
    </Route>
  )
);

export default router;
