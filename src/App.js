import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Auth/Login";
import ResetPasswordEmail from "./pages/Auth/ResetPasswordEmail";
import ResetPasswordNewPassword from "./pages/Auth/ResetPasswordNewPassword";
import Plant from "./pages/Plant";
import Reports from "./pages/Reports";
import AiSmartView from "./pages/AiSmartView";
import Dashboard from "./components/Dashboard/DashboardContentLayout";
import MachinesParameter from "./pages/MachinesParameter";
import Camera from "./pages/Camera";
import SettingsContainer from "./pages/SettingsContainer";
import Insights from "./pages/Insights";
import ProtectedRoutes from "./hooks/protectedRoutes";
import NotFound from "./pages/PageNotFound";
import ResetPasswordRoute from "./hooks/resetPasswordRoute";
import ProtectedRouteForPlant from "./hooks/protectedRouteForPlant";
import Location from "./pages/Location/Location";
import { useSelector } from "react-redux";

const routeMap = {
  "Dashboard": { path: "/dashboard", component: <Dashboard /> },
  "Reports": { path: "/reports", component: <Reports /> },
  "Machine Parameter": { path: "/machine-parameter", component: <MachinesParameter /> },
  "Ai Smart View": { path: "/ai-smart-view", component: <AiSmartView /> },
  "Insights": { path: "/insights", component: <Insights /> },
  "Settings": { path: "/settings", component: <SettingsContainer /> },
  "System Status": { path: "/system-status", component: <Camera /> },
};


const App = () => {
  const userPermissions = useSelector(
    (state) => state.user.userData[0].permissions
  );
  console.clear();

  // Save a reference to the original console.log
  const originalConsoleLog = console.log;
  // Display your custom text

  originalConsoleLog('Hi 👋,Hul Dashboard ');

  // Override console methods with a function that does nothing
  console.log = function () {};
  console.warn = function () {};
  console.error = function () {};
  console.table = function () {};
  return (
    <Router>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Login />} />
        <Route path="/reset-password-email" element={<ResetPasswordEmail />} />
        {/* <Route path="/plant" element={<Plant />} /> */}
        <Route
          path="/reset-password/:id"
          element={
            <ResetPasswordRoute>
              <ResetPasswordNewPassword />
            </ResetPasswordRoute>
          }
        />
        {/* Protected Route for Plant page, outside of Layout */}
        <Route element={<ProtectedRouteForPlant />}>
          <Route path="/plant" element={<Plant />} />
          <Route path="/location" element={<Location />} />
        </Route>
        <Route element={<ProtectedRoutes />}>
        {[
  ...(userPermissions?.generalRoutes || []),
  ...(userPermissions?.otherRoutes || [])
]
  .filter((item) => item.isActive && routeMap[item.name])
  .map((item) => (
    <Route
      key={item.name}
      path={routeMap[item.name].path}
      element={routeMap[item.name].component}
    />
))}
 <Route
      key="Insights"
      path="/insights"
      element={routeMap["Insights"].component}
    />
    </Route>
      </Routes>
    </Router>
  );
};

export default App;
