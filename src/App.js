import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Auth/Login';
import ResetPassword from './pages/Auth/ResetPassword';
import Plant from './pages/Plant';
import Reports from './pages/Reports';
import AiSmartView from './pages/AiSmartView';
import Dashboard from './pages/Dashboard';
import MachinesParameter from './pages/MachinesParameter';
import Camera from './pages/Camera';
import Settings from './pages/Settings';
import Insights from './pages/Insights';
import ProtectedRoutes from './hooks/protectedRoutes';
import NotFound from './pages/PageNotFound';

const App = () => {
  return (
    <Router>
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/dashboard-home" element={<Dashboard />} />
            <Route path="/plant" element={<Plant />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/machine-parameter" element={<MachinesParameter />} />
            <Route path="/ai-smart-view" element={<AiSmartView />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/system-status" element={<Camera />} />
          </Route>
          
        </Routes>
    </Router>
  );
};

export default App;
