import {  useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Layout} from "antd";
import { useSelector} from "react-redux";
import SideMenu from "../common/SideMenu";
import TopHeader from "../common/TopHeader";
import DashboardContentLayout from "../Dashboard/DashboardContentLayout";
import PropTypes from "prop-types";

const { Content, Sider } = Layout;

function Main({ children }) {
  const localPlantData = useSelector((state) => state.plant.plantData[0]);
  const plantName = localPlantData?.plant_name;
let { pathname } = useLocation();
  pathname = pathname.replace("/", "");
  const local=localStorage.getItem("rememberMeClicked"); // Set Remember Me immediately   
  useEffect(() => {
    console.log(local)
  }, [pathname]);

  return (
    <Layout
      className={`layout-dashboard ${pathname === "dashboard" ? "layout-profile" : ""
        } ${pathname === "rtl" ? "layout-dashboard-rtl" : ""}`}
    >
      <SideMenu />
      <Layout>
        <TopHeader
          clientName={plantName}
          clientLogoImgUrl={
            "https://xtemko.stripocdn.email/content/guids/CABINET_d8f211887c57378d14d80cfb73c09f4b2db394a5cf71f6e0cdda10e02f8c454f/images/vin_logo.jpeg"
          }
        />
        <Content className="content-ant">
          <DashboardContentLayout>{children}</DashboardContentLayout>
        </Content>
      </Layout>
    </Layout>
  );
}
Main.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Main;
