import { Row, Col, Card } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../assets/styles/Plant.css";
import { Hourglass } from "react-loader-spinner";
import { setPlantData } from "../redux/slices/plantSlice"; // Import setPlantData action
import useApiInterceptor from "../hooks/useInterceptor";
import { useNavigate } from "react-router-dom";

const Plant = () => {
  const apiCallInterceptor = useApiInterceptor();
  const [plant, setPlant] = useState([]);
  const [loader, setLoader] = useState(true);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const accessToken = useSelector(
    (state) => state.auth.authData[0].accessToken
  );

  const handleStorage = (plantData) => {
    if (plantData && Array.isArray(plantData) && plantData.length > 0) {
      dispatch(setPlantData(plantData)); // Dispatch valid plant data to Redux
      navigate("/");
    } else {
      console.log("Invalid or empty plant data:", plantData); // Handle invalid data
    }
  };

  useEffect(() => {
    const fetchPlantData = async () => {
      try {
        if (!accessToken) {
          return;
        }

        const res = await apiCallInterceptor.get(`/plant/`);
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

    fetchPlantData();
  }, [accessToken]);

  const VideoSource = [
    {
      id: 1,
      url: "https://indusvision.ai/wp-content/uploads/2024/12/Edge-Powered.mp4",
    },
    {
      id: 2,
      url: "https://indusvision.ai/wp-content/uploads/2024/12/Performance-At-apr.mp4",
    },
    {
      id: 3,
      url: "https://indusvision.ai/wp-content/uploads/2024/12/Assembly-Inspection.mp4",
    },
    {
      id: 4,
      url: "https://indusvision.ai/wp-content/uploads/2024/12/Edge-Powered.mp4",
    },
  ];


  return (
    <Row className="h-screen  overflow-hidden  flex w-full px-0 m-0  justify-between">
      <Col
        className="flex justify-start flex-col gap-0 items-center w-[25%] p-4"
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
                            src='https://eimkeia.stripocdn.email/content/guids/CABINET_8270216c780e362a1fbcd636b59c67ae376eb446dc5f95e17700b638b8c3f618/images/indus_logo_dev.png'
                            style={{ width: "60px", height: "auto", }}
                            alt="loadingError"
                          /> 
              </div> */}
              <Card className=" bg-[#06175d] h-[90px]">
                <div className=" flex justify-center items-center gap-2">
                  <img
                    src="https://eimkeia.stripocdn.email/content/guids/CABINET_8270216c780e362a1fbcd636b59c67ae376eb446dc5f95e17700b638b8c3f618/images/indus_logo_dev.png"
                    style={{ width: "180px", height: "auto" }}
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
        className="  justify-center  h-full flex-wrap flex gap-4  w-[75%]
        "
      >
            <video
            style={{objectFit:"cover" , width:"100%"}}
            class="elementor-video "
            src="https://indusvision.ai/wp-content/uploads/2024/11/No-rework-no-waste—just-efficiency-1.mp4"
            autoplay=""
            loop
            muted="muted"
            playsinline=""
            controlslist="nodownload"
          ></video>

      </Col>
    </Row>
  );
};

export default Plant;
