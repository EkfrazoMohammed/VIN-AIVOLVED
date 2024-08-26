import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Auth/Login";
import ResetPasswordEmail from "./pages/Auth/ResetPasswordEmail";
import ResetPasswordNewPassword from "./pages/Auth/ResetPasswordNewPassword";
import Plant from "./pages/Plant";
import Reports from "./pages/Reports";
import AiSmartView from "./pages/AiSmartView";
import Dashboard from "./pages/Dashboard";
import MachinesParameter from "./pages/MachinesParameter";
import Camera from "./pages/Camera";
import SettingsContainer from "./pages/SettingsContainer";
import Insights from "./pages/Insights";
import ProtectedRoutes from "./hooks/protectedRoutes";
import NotFound from "./pages/PageNotFound";
import ResetPasswordRoute from "./hooks/resetPasswordRoute";
import ProtectedRouteForPlant from "./hooks/protectedRouteForPlant";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<Login />} />
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
        </Route>
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/machine-parameter" element={<MachinesParameter />} />
          <Route path="/ai-smart-view" element={<AiSmartView />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/settings" element={<SettingsContainer />} />
          <Route path="/system-status" element={<Camera />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
