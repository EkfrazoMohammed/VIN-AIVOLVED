import { Outlet } from "react-router-dom";
import { useContext, useEffect, useLayoutEffect, useState } from "react";

import Login from "./Auth/Login";
import Main from "../components/layout/Main";
import { useSelector } from "react-redux";
export default function Layout() {
  const [auth, setAuth] = useState(false)

  // const token = localStorage.getItem("token");
  // const PlantData = localStorage.getItem("PlantData");

  const token = useSelector((state) => state.auth.accessToken);
  const plantData = useSelector((state) => state.auth.plantData);
  console.log(token, plantData)
  useLayoutEffect(() => {
    if (token && plantData) {
      setAuth(true)
    }
    else {
      setAuth(false)
    }
  }, [])




  return (
    <>

      {
        auth ? <Main><Outlet /> </Main> : <Login />
      }
      {/* <Login />
   <Main><Outlet/> </Main> */}
    </>
  )
}
