import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Slider from "react-slick";
import LazyLoad from "react-lazyload";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Select } from "antd";
import "../index.css";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import { Hourglass } from "react-loader-spinner";
import "../assets/styles/ai-smart.css";
import { useSelector } from "react-redux";
import axiosInstance from "../API/axiosInstance";
import gridBg from "../assets/images/grid-bg.jpg";

const AiSmartView = () => {
  const localPlantData = useSelector((state) => state.plant.plantData[0]);
  const AuthToken = useSelector((state) => state.auth.authData[0].accessToken);
  const [defectImages, setDefectImages] = useState([]);
  const [defects, setDefects] = useState([]);
  const [selectedDefect, setSelectedDefect] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const sliderRef = useRef(null);
  const [loader, setLoader] = useState(false);
  const [imageThumbPageCount, setImageThumbPageCount] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
  });

  const [nextFourIndexes, setNextFourIndexes] = useState([]);

  useEffect(() => {
    axiosInstance
      .get(`defect/?plant_name=${localPlantData.plant_name}`, {
        headers: { Authorization: `Bearer ${AuthToken}` },
      })
      .then((response) => {
        setDefects(response.data.results);
      })
      .catch((error) => {
        console.error("Error fetching defects:", error);
      });
  }, []);

  useEffect(() => {
    aiViewAPi();
  }, [selectedDefect, pagination.currentPage]);

  useEffect(() => {
    const updateThumbImages = () => {
      const arry = [];
      for (
        let i = currentSlideIndex + 1;
        i <= currentSlideIndex + 8 && i < defectImages.length;
        i++
      ) {
        arry.push(i);
      }
      setNextFourIndexes(arry);
    };

    // console.log("sliderRef.current", sliderRef.current);
    
    updateThumbImages();
  }, [currentSlideIndex, defectImages]);

  const aiViewAPi = () => {
    if (selectedDefect) {
      setLoader(true);
      axiosInstance
        .get(
          `ai-smart/?plant_id=${localPlantData.id}&page=${pagination.currentPage}&defect_id=${selectedDefect.id}`,
          {
            headers: {
              Authorization: `Bearer ${AuthToken}`,
            },
          }
        )
        .then((response) => {
          if (response.data.results.length > 0) {
            setErrorMessage("");
            setDefectImages(response.data.results);
            setPagination((prev) => ({
              ...prev,
              pageSize: response.data.page_size,
              totalPages: Math.ceil(
                response.data.total_count / response.data.page_size
              ),
            }));
          } else {
            setDefectImages([]);
            setErrorMessage("NO DATA");
          }
          setLoader(false);
        })
        .catch((error) => {
          setLoader(false);
          console.error("Error fetching defect images:", error);
          setErrorMessage("No Images to display for this selected defect");
        });
    } else {
      setDefectImages([]);
      setErrorMessage("");
    }
  };

  const handleDefectChange = (value) => {
    const selectedId = value;
    const selectedDefect = defects.find((defect) => defect.id === selectedId);
    setSelectedDefect(selectedDefect);
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));
  };


  const settings = {
    dots: false,
    adaptiveHeight: true,
    infinite: false,
    lazyLoad: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (index) => setCurrentSlideIndex(index),
    customPaging: function (slider, i) {
      console.log("slider", slider);
      return  (i + 1) + '/' + slider.slideCount;
  }
  };

  const sideThumbImages = () => {
    return nextFourIndexes.map((index) => (
      <div key={index} className="w-full h-[80px] bg-black border-2 border-red-500">
        <img
          src={`${defectImages[index]?.image}`}
          alt={`Defect ${index + 1}`}
          className="w-full h-full object-contain"
          loading="lazy"
        />
        {/* LOCAL DASHBOARD */}
        {/* <img src={`http://localhost:8000${defectImages[index].image}`} alt={`Defect ${index + 1}`} style={{ width: '80px', height: '80px',objectFit:"cover" ,margin: '5px' }} /> */}
      </div>
    ));
  };
  // style={{backgroundImage:`url(${gridBg})`}}
  return (
    <div className="flex min-h-[calc(100vh-120px)] gap-2">
      <div
        className={`defect-image-container flex w-9/12 h-[calc(100vh-113px)] border rounded-md object-cover bg-center bg-cover justify-center items-center`}
        style={{ backgroundImage: `url(${gridBg})` }}
      >
        {loader ? (
          <div
            className=""
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
              marginTop: "1rem",
              borderRadius: "10px",
            }}
          >
            <Hourglass
              visible={true}
              height="40"
              width="40"
              ariaLabel="hourglass-loading"
              wrapperStyle={{}}
              wrapperClass=""
              colors={["#ec522d", "#ec522d"]}
            />
          </div>
        ) : (
          <>
            {errorMessage ? (
              <p className="text-lg text-white">{errorMessage}</p>
            ) : selectedDefect ? (
              <>
                <div className="AISmartContainer flex flex-col bg-gray-200 w-full h-full">
                  <div className="slider-container w-full min-h-[calc(100%-100px)] p-2">
                    <Slider {...settings} ref={sliderRef}>
                      {defectImages
                        ? defectImages.map((imageData, index) => (
                            <div key={index}>
                              <img
                                src={`${
                                  imageData.image ? imageData.image : ""
                                }`}
                                alt={`Defect ${index + 1}`}
                                className="ai-smart-slider-img"
                                style={{
                                  width: "100%",
                                  height: "auto",
                                  margin: "0 auto",
                                  maxWidth: "500px",
                                }}
                                loading="lazy"
                              />
                            </div>
                          ))
                        : null}
                    </Slider>
                  </div>
                  <div className="h-[100px] py-4 px-3 text-xl">
                    <div className="">
                      <span className="font-bold ">Machine:</span>{" "}
                      {defectImages[currentSlideIndex]?.machine_name}{" "}
                    </div>
                    <div>
                      <strong>Recorded Date & Time:</strong>{" "}
                      {defectImages[currentSlideIndex]?.recorded_date_time
                        .split("T")
                        .join(" ")}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <p
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "2rem",
                  fontWeight: "600",
                  color: "white",
                }}
              >
                Please select a defect to display images.
              </p>
            )}
          </>
        )}
      </div>
      <div className="filter-side-menu-container w-3/12 flex flex-col justify-start items-center bg-gray-200 rounded pt-3">
        <div className="filter-dropdown w-full p-2">
          <div className="text-md mb-1">Select Defect Type:</div>
          <Select
            showSearch
            className="w-full h-[45px]"
            placeholder="Select Defects"
            size="large"
            onChange={handleDefectChange}
            defaultValue={null}
            filterOption={(input, defects) =>
              (defects.children ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {defects.map((defects) => (
              <Select.Option key={defects.id} value={defects.id}>
                {defects.name}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div className="next-img-title w-full text-left p-2">Next Images</div>
        <div className="grid grid-cols-2 gap-2 w-full p-2">
          {sideThumbImages()}
        </div>
        <div className="pagination-controls">
          <span>
            {/* Page {pagination.currentPage} of {pagination.totalPages} */}
            {/* Page: {defectImages.length / 8} of {defectImages.length} */}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AiSmartView;
