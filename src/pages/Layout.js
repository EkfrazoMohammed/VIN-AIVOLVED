import { Outlet } from "react-router-dom";
import Main from "../components/layout/Main";
export default function Layout() {
  return (
    
      <Main>
        <Outlet />
      </Main>
  );
}
