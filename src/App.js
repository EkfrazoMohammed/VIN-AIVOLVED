import { useState,useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { ToastContainer,toast } from "react-toastify";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Main from "./components/layout/Main";
import "../node_modules/antd/dist/antd"
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import Reports from "./pages/Reports";
import AiSmartView from "./pages/AiSmartView";
import Dashboard from "./pages/Dashboard";
import MachinesParameter from "./pages/MachinesParameter";
import Camera from "./pages/Camera";
import Settings from "./pages/Settings.jsx";
import Plant from "./pages/Plant.js";
import {
  createBrowserRouter,
  createRoutesFromElements,
  
  RouterProvider,
} from "react-router-dom";
import Organisation from "./pages/Organization.js";
import Plants from "./pages/Plants.js";
import Select_dashboard from "./pages/SelectDashboard.js";
import "react-toastify/dist/ReactToastify.css";
import Insights from "./pages/Insights.js";

import 'react-toastify/dist/ReactToastify.css';
// import useWebSocket from './WebSocketService';
import Layout from "./pages/Layout.js";
import Login from "./pages/Auth/Login.js"
import ResetPassword from "./pages/Auth/ResetPassword.js"
import axios from "axios"
import { baseURL } from "./API/API.js";

const App = () => {

  const [refreshTokens, setrefreshTokens] = useState(() => 
    JSON.parse(localStorage.getItem('refreshToken')) || null
  );
  const refreshToken = async () => {
    try {
      const response = await axios.post(`${baseURL}refresh_token/`, {
        refresh: refreshTokens,
      });
      console.log(response)
 
      localStorage.setItem("token",JSON.stringify(response.data.access))

    } catch (error) {
      console.error('Token refresh failed:', error);
    }
  };


   setInterval(() => {
        refreshToken();
    }, 15 * 60 * 1000); // Refresh every 15 minutes



  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
   
      children: [
        {
          path: "", 
          element: <Dashboard />,
        },
        {
         path: 'dashboard-home',
          element: <Dashboard />,
        },
        {
          path: 'reports',
          element: <Reports />,
        },
        {
          path: 'ai-smart-view',
          element: <AiSmartView />,
        },
        {
          path: 'machines-parameter',
          element: <MachinesParameter />,
        },
        {
          path: 'camera',
          element: <Camera />,
        },
        {
          path: 'settings',
          element: <Settings />,
        }, 
          {
          path: 'insights',
          element: <Insights />,
        },
        // {
        //   path: 'Plants',
        //   element: <Organisation />,
     
        // },
        // {
        //   path: 'Plants/:id',
        //   element: <Plants />,
        // }, 
        //     {
        //   path: 'Organization-Dashboard/:id',
        //   element: <Selectdashboard />,
        // },
      ]
    },
    {
      path: "/login",
      element: <Login />,
    }, 
      {
      path: "/resetPassword",
      element: <ResetPassword />,
    },
    {
      path: "/Plant",
      element: <Plant />,
    },

  ]);
  // const { notifications, isSocketConnected } = useWebSocket();

  return (
    <>
         <RouterProvider router={router} />
    </>
    // <div className="App" >
    //   <Switch>
    //     <Route path="/sign-up" exact component={SignUp} />
    //     <Route path="/sign-in" exact component={SignIn} />
    //     <Main>
    //       <Route exact path="/dashboard" component={Dashboard} />
    //       <Route exact path="/reports" component={Reports} />
    //       <Route exact path="/insights" component={Insights} />
    //       <Route exact path="/ai-smart-view" component={AiSmartView} />
    //       <Route exact path="/machines-parameter" component={MachinesParameter} />
    //       <Route exact path="/camera" component={Camera} />
    //       <Route exact path="/settings" component={Settings} />
    //       <Route exact path="/organization" component={Organisation} />
    //       <Route exact path="/Plants/:id" component={Plants} />
    //       <Route exact path="/Organization-Dashboard/:id" component={Select_dashboard} />
    //       <Redirect from="*" to="/dashboard" />
    //     </Main>
    //   </Switch>
    // </div>
  );
}

export default App;