import { Row, Col, Card } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../assets/styles/Plant.css";
import { Hourglass } from "react-loader-spinner";
import { setPlantData } from "../redux/slices/plantSlice"; // Import setPlantData action
import useApiInterceptor from "../hooks/useInterceptor";
import { useNavigate } from "react-router-dom";
import { encryptAES } from "../redux/middleware/encryptPayloadUtils";

const Plant = () => {
  const apiCallInterceptor = useApiInterceptor();
  const [plant, setPlant] = useState([]);
  const [loader, setLoader] = useState(true);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const accessToken = useSelector(
    (state) => state.auth.authData[0].accessToken
  );
   
  const locationData = useSelector(
    (state) => state.location.locationData[0]
  );  
  const currentUserData = useSelector((state) => state.user.userData[0]);

  const handleStorage = (plantData) => {
    console.log(plantData)
    if (plantData && Array.isArray(plantData) && plantData.length > 0) {
      dispatch(setPlantData({
        id: plantData[0].id,
        plant_name: plantData[0].plant_name,
        is_active: plantData[0].is_active,
      })); // Dispatch valid plant data to Redux
      navigate("/dashboard");
    } else {
      console.log("Invalid or empty plant data:", plantData); // Handle invalid data
    }
  };

  const fetchPlantData = async (location) => {
    try {
      if (!accessToken) {
        return;
      }
   
      const ecncryptedLocationId = encryptAES(JSON.stringify(location));
 
      const res = await apiCallInterceptor.get(`/plant/?location_id=${ecncryptedLocationId}`);
      const { results } = res.data;

      if (results) {
        setPlant(results);
      }
    } catch (err) {
      console.log("Error fetching plant data:");
      if (err.response && err.response.data.code === "token_not_valid") {
        console.log("Token is invalid or expired.");
      } else {
        console.log("Error:", err.message || "Unknown log occurred");
      }
    } finally {
      setLoader(false);
    }
  };
  useEffect(() => {
  
    if (currentUserData.roleName === "Manager") { 
      fetchPlantData(currentUserData.locationId);
    }
    else{
      fetchPlantData(locationData.id)
    }
    


 
  }, [accessToken]);

  const images1 = [
    {
      id: 1,
      url: "https://eimkeia.stripocdn.email/content/guids/CABINET_8270216c780e362a1fbcd636b59c67ae376eb446dc5f95e17700b638b8c3f618/images/image_22.png",
    },
    {
      id: 2,
      url: "https://eimkeia.stripocdn.email/content/guids/CABINET_8270216c780e362a1fbcd636b59c67ae376eb446dc5f95e17700b638b8c3f618/images/hul.png",
    },
    {
      id: 3,
      url: "https://eimkeia.stripocdn.email/content/guids/CABINET_8270216c780e362a1fbcd636b59c67ae376eb446dc5f95e17700b638b8c3f618/images/hul_2.png",
    },
    {
      id: 4,
      url: "https://eimkeia.stripocdn.email/content/guids/CABINET_8270216c780e362a1fbcd636b59c67ae376eb446dc5f95e17700b638b8c3f618/images/hul_3.png",
    },
    {
      id: 5,
      url: "https://eimkeia.stripocdn.email/content/guids/CABINET_8270216c780e362a1fbcd636b59c67ae376eb446dc5f95e17700b638b8c3f618/images/hul_4.png",
    },
    {
      id: 6,
      url: "https://eimkeia.stripocdn.email/content/guids/CABINET_8270216c780e362a1fbcd636b59c67ae376eb446dc5f95e17700b638b8c3f618/images/hul_5.png",
    },
  ];

  const images2 = [
    {
      id: 1,
      url: "https://eimkeia.stripocdn.email/content/guids/CABINET_8270216c780e362a1fbcd636b59c67ae376eb446dc5f95e17700b638b8c3f618/images/hul_6.png",
    },
    {
      id: 2,
      url: "https://eimkeia.stripocdn.email/content/guids/CABINET_8270216c780e362a1fbcd636b59c67ae376eb446dc5f95e17700b638b8c3f618/images/hul_8.png",
    },
    {
      id: 3,
      url: "https://eimkeia.stripocdn.email/content/guids/CABINET_8270216c780e362a1fbcd636b59c67ae376eb446dc5f95e17700b638b8c3f618/images/comfortfabricconditionerremovebgpreview.png",
    },
    {
      id: 4,
      url: "https://eimkeia.stripocdn.email/content/guids/CABINET_8270216c780e362a1fbcd636b59c67ae376eb446dc5f95e17700b638b8c3f618/images/510wnj0cxtl_sl1000_removebgpreview_1.png",
    },
    {
      id: 5,
      url: "https://eimkeia.stripocdn.email/content/guids/CABINET_8270216c780e362a1fbcd636b59c67ae376eb446dc5f95e17700b638b8c3f618/images/51d3ux9kygl_sl1000_removebgpreview_1.png",
    },
  ];

  return (
    <Row className="h-screen  overflow-hidden flex   justify-center items-center w-full px-0 bg-white ">
      <Col
        span={5}
        className="flex justify-start flex-col gap-0 items-center  p-2"
      >
        {loader ? (
          <div className="h-[50vh] flex justify-center items-center">
            <Hourglass
              visible={true}
              height="40"
              width="40"
              ariaLabel="hourglass-loading"
              colors={["#293dbe", "#293dbe"]}
            />
          </div>
        ) : (
          <Col className=" w-full">
            <div className="mytab-content  flex gap-3  flex-col w-full justify-start ">
              {/* <div className="flex  items-center w-full justify-center ">
                  <img
                            src='https://aivolved.in/wp-content/uploads/2022/11/ai-logo.png'
                            style={{ width: "60px", height: "auto", }}
                            alt="loadingError"
                          /> 
              </div> */}
              <Card className=" bg-[#06175d] h-[90px]">
                <div className=" flex justify-center items-center gap-2">
                  <img
                    src="https://eimkeia.stripocdn.email/content/guids/CABINET_8270216c780e362a1fbcd636b59c67ae376eb446dc5f95e17700b638b8c3f618/images/hindunilvrns_bigd9791ee3bremovebgpreview.png"
                    style={{ width: "50px", height: "auto" }}
                    alt="loadingError"
                  />
                </div>
              </Card>
              <div className="flex flex-col">
                <span className="text-[#43996a] text-2xl font-bold ">
                  Plants
                </span>
                <span className="text-md  font-bold text-gray-400">
                  Please Choose Plant
                  {/* <span className="bg-[#2734c1] w-[90%] h-0.5"></span> */}
                </span>
              </div>
              {plant.length > 0 && (
                <Row className=" my-3 flex justify-between flex-col gap-3 ">
                  {plant.map((plant) => (
                    <Col col={1} key={plant.id}>
                      <Card
                        hoverable
                        className="custom-card bg-[#f6f6f6] h-full text-black hover:bg-[#43996a] hover:!text-white"
                        onClick={() => handleStorage([plant])}
                      >
                        <div className="custom-card-content flex justify-between items-center h-[16px] gap-2">
                          <div className="w-14 h-12  rounded-full bg-white">
                            <img
                              className="w-full h-full rounded-full"
                              alt="loadingImageError"
                              src="https://eimkeia.stripocdn.email/content/guids/CABINET_8270216c780e362a1fbcd636b59c67ae376eb446dc5f95e17700b638b8c3f618/images/plant.png"
                            />
                          </div>

                          <span className="font-bold text-[16px] w-[85%]  text-start whitespace-nowrap overflow-hidden  text-ellipsis ">
                            {plant.plant_name}
                          </span>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </div>
          </Col>
        )}
      </Col>
      <Col
        span={18}
        className="flex flex-col justify-center   rounded-3xl h-full"
      >
        <div className="scroll-container">
          <div className="scroll-content ">
            {Array.from({ length: 4 }, (_, index) => (
              <div
                key={"id" + index + 1}
                className="flex h-[85vh]  w-full gap-3 p-2 "
              >
                <div className="flex flex-col gap-2 w-[70%]">
                  {[...images1, ...images2].slice(0, 2).map((item) => [
                    <div key={item.id} className="item">
                      <img
                        alt="loadingError"
                        src={item.url}
                        className="w-full h-auto"
                      />
                    </div>,
                  ])}
                </div>
                <div className="flex flex-col gap-2 w-full">
                  {[...images1, ...images2].slice(2, 5).map((item) => [
                    <div key={item.id} className="item">
                      <img
                        src={item.url}
                        alt="loadingError"
                        className="w-full h-auto"
                      />
                    </div>,
                  ])}
                </div>
                <div className="flex flex-col gap-2 w-[70%]">
                  {[...images2, ...images2].slice(0, 2).map((item) => [
                    <div key={item.id} className="item">
                      <img
                        src={item.url}
                        alt="loadingError"
                        className="w-full h-auto"
                      />
                    </div>,
                  ])}
                </div>

                <div className="flex flex-col gap-2 w-full">
                  {[...images2, ...images2].slice(2, 5).map((item) => [
                    <div key={item.id} className="item">
                      <img
                        src={item.url}
                        alt="loadingError"
                        className="w-full h-auto"
                      />
                    </div>,
                  ])}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default Plant;
