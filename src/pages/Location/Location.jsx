import { Row, Col, Card } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { images1, images2 } from "./constants/product-images";
import { Hourglass } from "react-loader-spinner";
import { setPlantData } from "../../redux/slices/plantSlice"; // Import setPlantData action
import useApiInterceptor from "../../hooks/useInterceptor";
import { useNavigate } from "react-router-dom";
import "../../assets/styles/Plant.css";
import { fetchLocationData } from "./api/useGetlocation";
import { setLocationData } from "../../redux/slices/locationSlice";

const Location = () => {
  const apiCallInterceptor = useApiInterceptor();
  const [location, setLocation] = useState([]);
  const [loader, setLoader] = useState(true);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const accessToken = useSelector(
    (state) => state.auth.authData[0].accessToken
  );

  const handleStorage = (location) => {
    if (location && Array.isArray(location) && location.length > 0) {
      dispatch(setLocationData(location)); // Dispatch valid plant data to Redux
      navigate("/plant");
    } else {
      console.log("Invalid or empty plant data:", location); // Handle invalid data
    }
  };
  useEffect(() => {
    setLoader(true);
  
    fetchLocationData(accessToken, apiCallInterceptor)
      .then((results) => {
        if (results && Array.isArray(results)) {
          setLocation(results);
        } else {
          console.log("No location data found.");
        }
      })
      .catch((err) => {
        console.log("Error in fetching location data:", err);
      })
      .finally(() => {
        setLoader(false);
      });
  
  }, [accessToken]);

  return (
    <Row className="h-screen  overflow-hidden flex   justify-around items-center w-full px-0 bg-white ">
      <Col
        span={6}
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
              <Card className=" bg-[#06175d] h-[90px] w-full">
                <div className=" flex justify-center items-center gap-2">
                  <img
                    src="https://eimkeia.stripocdn.email/content/guids/CABINET_8270216c780e362a1fbcd636b59c67ae376eb446dc5f95e17700b638b8c3f618/images/hindunilvrns_bigd9791ee3bremovebgpreview.png"
                    style={{ width: "50px", height: "auto" }}
                    alt="loadingError"
                  />
                </div>
              </Card>
              <div className="flex flex-col ">
                <span className="text-[#43996a] text-2xl font-bold ">
                  Locations
                </span>
                <span className="text-md  font-bold text-gray-400">
                  Please Choose Locations
                  {/* <span className="bg-[#2734c1] w-[90%] h-0.5"></span> */}
                </span>
              </div>
              {location?.length > 0 && location && (
                <Row className=" my-3  flex-wrap   gap-3   overflow-y-auto ">
                  {Array.isArray(location) && location.length > 0 && (
                    <Row className="my-3 flex-wrap justify-start gap-3  overflow-y-auto">
                      {location.map((locationItem) => (
                        <Col col={1} key={locationItem.id}>
                          <Card
                            hoverable
                            className="custom-card bg-[#f6f6f6] h-[150px] min-w-[180px] w-full text-black hover:bg-[#43996a] hover:!text-white flex justify-center items-center shadow-md"
                            onClick={() => handleStorage([locationItem])}
                          >
                            <div className="flex justify-center flex-col items-center h-full gap-2">
                              <div className="w-14 h-14 rounded-full bg-white">
                                <img
                                  className="w-full h-full rounded-full"
                                  alt="loadingImageError"
                                  src="https://eimkeia.stripocdn.email/content/guids/CABINET_8270216c780e362a1fbcd636b59c67ae376eb446dc5f95e17700b638b8c3f618/images/plant.png"
                                />
                              </div>
                              <span className="font-bold text-[16px] w-full text-start whitespace-nowrap overflow-hidden text-ellipsis">
                                {locationItem.name}
                              </span>
                            </div>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  )}
                </Row>
              )}
            </div>
          </Col>
        )}
      </Col>
      <Col
        span={17}
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

export default Location;
