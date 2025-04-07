import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import aiLogo from "../../assets/images/ai-logo.webp";
import { TbLayoutDashboard } from "react-icons/tb";
import { LuView } from "react-icons/lu";
import { HiFlag, HiOutlineDocumentReport } from "react-icons/hi";
import { RiListSettingsLine } from "react-icons/ri";
import { MdSignalWifiStatusbarConnectedNoInternet1 } from "react-icons/md";
import { CiSettings } from "react-icons/ci";
import { IoMdLogOut } from "react-icons/io";
import { Button, Modal, notification } from "antd";
import { AuthToken } from "../../API/API";
import CurrentTime from "./CurrentTime";
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from '../../redux/slices/authSlice';
import { dashboardSignout } from "../../redux/slices/dashboardSlice";
import { defectSignout, setSelectedDefect, setSelectedDefectReports } from "../../redux/slices/defectSlice";
import { departmentSignout } from "../../redux/slices/departmentSlice";
import { dpmuSignout } from "../../redux/slices/dpmuSlice";
import { machineSignout, setSelectedMachine, setSelectedMachineDpmu } from "../../redux/slices/machineSlice";
import { plantSignOut } from "../../redux/slices/plantSlice";
import { productSignout, setSelectedProduct } from "../../redux/slices/productSlice";
import { productVsDefectSignout } from "../../redux/slices/productvsDefectSlice";
import { reportSignout } from "../../redux/slices/reportSlice";
import { userSignOut } from "../../redux/slices/userSlice";
import useApiInterceptor from "../../hooks/useInterceptor";
import { encryptAES } from "../../redux/middleware/encryptPayloadUtils";
import { setSelectedShift } from "../../redux/slices/shiftSlice";
import { defectTriggerSignOut } from "../../redux/slices/defecTriggerSlice";
import { FaMapLocationDot } from "react-icons/fa6";
const linkStyle =
  "sidemenu-link h-[45px] no-underline flex justify-start items-center px-3 rounded-[3px] gap-2";

const SideMenu = () => {
  const apiCall = useApiInterceptor()
  const dispatch = useDispatch()
  const [modal1Open, setModal1Open] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const refreshToken = useSelector((state) => state.auth.authData[0].refreshToken);

  const isActive = (path) => {
    return location.pathname === path ||
      (location.pathname === "/" && path === "/dashboard")
      ? "bg-red-600 active text-white"
      : "text-grey-500";
  };
  const logout = async () => {
    const encryTedToken = await encryptAES(JSON.stringify({ refresh_token: refreshToken }))
    try {
      await apiCall.post(
        `logout/`,
        {
          data: encryTedToken,
        },
        {
          headers: {
            Authorization: `Bearer ${AuthToken}`,
          },
        }
      );
    } catch (error) {
      //console.log(error);
    }
  };
  const [api, contextHolder] = notification.useNotification();
  const openNotification = () => {
    api.success({
      message: (
        <div style={{ fontWeight: "600", fontSize: "1.1rem" }}>
          Logout Successful
        </div>
      ),
    });
  };

  const clearReduxData = () => {
    dispatch(signOut());
    dispatch(dashboardSignout());
    dispatch(defectSignout());
    dispatch(departmentSignout());
    dispatch(dpmuSignout());
    dispatch(machineSignout());
    dispatch(plantSignOut());
    dispatch(productSignout());
    dispatch(productVsDefectSignout());
    dispatch(reportSignout());
    dispatch(userSignOut());
    dispatch(defectTriggerSignOut())
    // dispatch(ShiftSignout())
  }
  const clearSessionandLocalStorage = () => {
    sessionStorage.removeItem("persist:auth");
    sessionStorage.removeItem("persist:user");
    sessionStorage.removeItem("persist:plant");
    sessionStorage.removeItem("persist:report");
    sessionStorage.removeItem("persist:dashboard");
    sessionStorage.removeItem("persist:machine");
    sessionStorage.removeItem("persist:product");
    sessionStorage.removeItem("persist:department");
    sessionStorage.removeItem("persist:dpmu");
    sessionStorage.removeItem("persist:productVsDefect");
    sessionStorage.removeItem("persist:defect");
    sessionStorage.removeItem("persist:shift");
  }
  const handleLogout = async () => {
    setModal1Open(false);
    navigate("/login");
    openNotification();
    localStorage.clear();
    clearSessionandLocalStorage();
    sessionStorage.clear();
    await logout();
    clearReduxData();
  };


  const handleClick = () => {
    dispatch(setSelectedMachine(null)); // Dispatching action    
    dispatch(setSelectedDefect(null)); // Dispatching action 
    dispatch(setSelectedProduct(null));
    dispatch(setSelectedDefectReports(null))
    dispatch(setSelectedMachineDpmu(null))
    dispatch(setSelectedShift(null))
  }

  const PERMISSION = {
    generalRoutes:[
      {
       name: "Dashboard",
       isActive: true,
      },
      {
        name: "Reports",
        isActive: true,
       },
       {
        name: "Ai Smart View",
        isActive: true,
       },
       {
        name: "Machine Parameter",
        isActive: true,
       },
       {
        name: "System Status",
        isActive: true,
       },
  ],
    organizationRoutes:[
      {
        name: "Locations",
        isActive: true,
       },
       {
        name: "Plant",
        isActive: true,
       },
    ],
    otherRoutes:[
        {
          name: "Settings",
          isActive: true,
        },
       
    ]
  }
  
  const userPermissions = useSelector(
    (state) => state.user.userData[0].permissions
  );

  return (
    <>
    {contextHolder}
    <Modal
      title={
        <div
          style={{
            textAlign: "center",
            padding: "1rem 0",
            fontWeight: "600",
            fontSize: "1.2rem",
          }}
        >
          Are You Sure You Want To Logout?
        </div>
      }
      style={{
        top: 20,
      }}
      open={modal1Open}
      onCancel={() => setModal1Open(false)}
      footer={null}
    >
      <div className="" style={{ display: "flex", justifyContent: "center" }}>
        <Button
          onClick={handleLogout}
         className="commButton"
        >
          LOGOUT
        </Button>
      </div>
    </Modal>
    <div className="sidemenu-container flex flex-col min-h-screen w-[270px] fixed left-0 ">
      <div className="bg-[#06175d]  h-[75px] flex items-center gap-2 border-b-2 justify-center text-white">
        <div className='   rounded-full'>
         <img 
                src="https://eimkeia.stripocdn.email/content/guids/CABINET_8270216c780e362a1fbcd636b59c67ae376eb446dc5f95e17700b638b8c3f618/images/indus_logo_dev.png"
                alt="client logo" className="w-40 h-auto " />
        </div>
      </div>
      <div className="menu-items-w h-full flex flex-col flex-1 justify-between">
        <ul className="menu-list list-none py-3 px-3 flex flex-col gap-2">
          <li className="text-[13px] font-normal">
            {/* <div className="mb-1 menu-category-name"> Min</div> */}
            <ul className="text-[15px] font-normal">
              {
                userPermissions.generalRoutes.map((item, index) => {
                  return (
                    item.isActive && (
                      <li key={index} className="menu-item">
                        <Link
                          to={item.name === "Dashboard" ? "/" : `/${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                          onClick={handleClick}
                          className={`${linkStyle} ${isActive(item.name === "Dashboard" ? "/" : `/${item.name.toLowerCase().replace(/\s+/g, '-')}`)}`}
                        >
                          {item.name === "Dashboard" ? <TbLayoutDashboard /> : item.name === "Reports" ? <HiOutlineDocumentReport /> : item.name === "Ai Smart View" ? <LuView /> : item.name === "Machine Parameter" ? <RiListSettingsLine /> : <MdSignalWifiStatusbarConnectedNoInternet1 />}
                          {item.name}
                        </Link>
                      </li>
                    )
                  )
                } )  
              }
            </ul>
          </li>
          {
            userPermissions?.organizationRoutes && userPermissions.organizationRoutes.some(item => item.isActive) && (
          <li className="text-[13px] font-normal">
            <div className="mb-1 menu-category-name"> Organization</div>
            <ul className="text-[15px] font-normal">
              {
                userPermissions.organizationRoutes.map((item, index) => {
                  return (
                    item.isActive && (
                      <li key={index} className="menu-item">
                        <Link
                          to={item.name === "Locations" ? "/location" : "/plant"}
                          onClick={handleClick}
                          className={`${linkStyle} ${isActive(item.name === "Locations" ? "/location" : "/plant")}`}
                        >
                          {item.name === "Locations" ? <FaMapLocationDot /> : <HiFlag />}
                          {item.name}
                        </Link>
                      </li>
                    )
                  )
                } )
              }
            </ul>
          </li>)
          }
          <li className="text-[13px] font-normal">
            <div className="mb-1 menu-category-name"> Other</div>
            <ul className="text-[15px] font-normal">
              {
                userPermissions.otherRoutes.map((item, index) => {
                  return (
                    item.isActive && (
                      <li key={index} className="menu-item">
                        <Link
                          to={item.name === "Settings" ? "/settings" : "/logout"}
                          onClick={handleClick}
                          className={`${linkStyle} ${isActive(item.name === "Settings" ? "/settings" : "/logout")}`}
                        >
                          {item.name === "Settings" ? <CiSettings /> : <IoMdLogOut />}
                          {item.name}
                        </Link>
                      </li>
                    )
                  )
                } )
              }
              <li className="menu-item">
                <Link
                  onClick={() => setModal1Open(true)}
                  className={`${linkStyle} ${isActive("/logout")}`}
                >
                  <IoMdLogOut />
                  Logout
                </Link>
              </li>
            </ul>
          </li>
        </ul>
        <CurrentTime />
      </div>
    </div>
  </>
  );
};

export default SideMenu;
