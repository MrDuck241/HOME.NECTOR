import { RouterProvider } from "react-router-dom";
import { initializeLocalStorageDefaults } from "./utilis/storageInit";
import router from "./routes/Router";

function App() {
  initializeLocalStorageDefaults();
  return <RouterProvider router={router} />;
}

export default App;
