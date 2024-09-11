import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import { Select } from "antd";
import { useSelector } from "react-redux";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import { Hourglass } from "react-loader-spinner";
import gridBg from "../assets/images/grid-bg.jpg";
import useApiInterceptor from "../hooks/useInterceptor";
import { decryptAES } from "../redux/middleware/encryptPayloadUtils";
import { getDefects, getAiSmartView } from "../services/dashboardApi";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const AiSmartView = () => {
  const [aismartviewData, setAismartviewData] = useState([]);
  const [selectedDefect, setSelectedDefect] = useState(null);
  const localPlantData = useSelector((state) => state.plant.plantData[0]);
  const AuthToken = useSelector((state) => state.auth.authData[0].accessToken);
  const next = useSelector((state) => state.aismartview.next);
  const prev = useSelector((state) => state.aismartview.prev);
  const defectsData = useSelector((state) => state.defect.defectsData);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [pagination, setPagination] = useState({ currentPage: 1, pageSize: 10 });
  const [loader, setLoader] = useState(false);

  const apiCallInterceptor = useApiInterceptor();
  const sliderRef = useRef(null);


  const handleDefectChange = async (value) => {
    const selectedId = value;
    const defect = defectsData.find((defect) => defect.id === selectedId);
    setSelectedDefect(defect);
    setPagination({ ...pagination, currentPage: 1 });
    setCurrentSlideIndex(0);

    try {
      setLoader(true);
      const aiSmartViewData = await getAiSmartView(localPlantData.id, AuthToken, apiCallInterceptor, 1, selectedId);
      //console.log(aismartviewData.results)
      setAismartviewData(aiSmartViewData.results);
    } catch (error) {
      //console.error("Failed to fetch AI Smart View data:", error.message);
    } finally {
      setLoader(false);
    }
  };

  const handleNext = async () => {
    if (currentSlideIndex === pagination.pageSize - 1) {
      const nextPage = pagination.currentPage + 1;
      setPagination((prev) => ({ ...prev, currentPage: nextPage }));

      try {
        setLoader(true);
        const aiSmartViewData = await getAiSmartView(localPlantData.id, AuthToken, apiCallInterceptor, nextPage, selectedDefect.id);
        setAismartviewData(aiSmartViewData.results);
        setCurrentSlideIndex(0);
      } catch (error) {
        //console.error("Failed to fetch AI Smart View data:", error.message);
      } finally {
        setLoader(false);
      }
    } else if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  const handlePrev = async () => {
    if (currentSlideIndex === 0 && pagination.currentPage !== 1) {
      const prevPage = pagination.currentPage - 1;
      setPagination((prev) => ({ ...prev, currentPage: prevPage }));

      try {
        setLoader(true);
        const aiSmartViewData = await getAiSmartView(localPlantData.id, AuthToken, apiCallInterceptor, prevPage, selectedDefect.id);
        setAismartviewData(aiSmartViewData);
        setCurrentSlideIndex(0);
      } catch (error) {
        //console.error("Failed to fetch AI Smart View data:", error.message);
      } finally {
        setLoader(false);
      }
    } else if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (index) => setCurrentSlideIndex(index),
  };

  return (
    <div className="flex min-h-[calc(100vh-120px)] gap-2">
      <div
        className="defect-image-container  w-9/12 border p-2 rounded-md bg-cover bg-center flex flex-col"
      >
        {loader ? (
          <div
            className="loader-container"
            style={{
              height: "60vh",
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
              colors={["#ec522d", "#ec522d"]}
            />
          </div>
        ) : (
          <>
            {selectedDefect !== null && aismartviewData?.length > 0 ? (
              <>
                <div className="AISmartContainer">
                  <div className="AISmartContainer-top">
                    <div>
                      <strong>Machine:</strong>{" "}
                      {decryptAES(aismartviewData[currentSlideIndex]?.machine_name)}
                    </div>
                    <div>
                      <strong>Recorded Date & Time:</strong>{" "}
                      {decryptAES(aismartviewData[currentSlideIndex]?.recorded_date_time).split("T").join(" ")}
                    </div>
                  </div>
                  <Slider {...settings} ref={sliderRef} className="max-w-[100vh]">
                    {aismartviewData?.map((item, index) => (
                      <>
                        <div key={index} className="aismart-item">
                          <img
                            src={decryptAES(item.image)}
                            alt={`Slide ${index}`}
                            style={{ maxHeight: "70vh", width: '40vw', display: "block", margin: "0 auto" }}
                          />
                        </div>
                      </>
                    ))}
                  </Slider>

                </div>
                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={handlePrev}
                    disabled={currentSlideIndex === 0}
                    className="bg-[#f50909] text-white py-2 px-4 rounded"
                  >
                    <LeftOutlined />
                  </button>
                  <button
                    onClick={(i) => handleNext(i)}
                    disabled={currentSlideIndex === 10}
                    className="bg-[#f50909] text-white py-2 px-4 rounded"
                  >
                    <RightOutlined />
                  </button>
                </div>
              </>
            ) : (
              <p className="text-lg text-black">Select a defect to view images.</p>
            )}
          </>
        )}
      </div>
      <div className="defect-selection flex flex-col w-3/12 gap-2">
        <Select
          placeholder="Select a Defect"
          onChange={handleDefectChange}
          style={{ width: "100%" }}
        >
          {defectsData.map((defect) => (
            <Select.Option key={defect.id} value={defect.id}>
              {defect.name}
            </Select.Option>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default AiSmartView;
