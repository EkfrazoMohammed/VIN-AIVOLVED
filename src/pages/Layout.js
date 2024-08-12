import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Login from "./Auth/Login";
import Main from "../components/layout/Main";
export default function Layout() {
  const token = useSelector((state) => state.auth.authData.access_token); // Get token from authSlice
  const plantData = useSelector((state) => state.plant.plantData); // Get PlantData from plantSlice

  const [auth, setAuth] = useState(false);

  useEffect(() => {
    if (token && plantData) {
      setAuth(true);
    } else {
      setAuth(false);
    }
  }, [token, plantData]); // Ensure the effect runs when token or plantData changes

  return (
    <>
      {/* {auth ? ( */}

      <Main>
        <Outlet />
      </Main>
      {/* ) : (
        <Login />
      )} */}
    </>
  );
}
