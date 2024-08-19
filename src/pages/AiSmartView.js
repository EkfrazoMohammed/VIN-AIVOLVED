import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import LazyLoad from "react-lazyload";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Select } from "antd";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import { Hourglass } from "react-loader-spinner";
import gridBg from "../assets/images/grid-bg.jpg";
import useApiInterceptor from "../hooks/useInterceptor";
import {
  setAismartviewData,
  setSelectedDefectAismartview,
  setErrorMessage,
  setLoading,
  setLoader,
  updatePagination,
  setCurrentSlideIndex, // Export the action
} from "../redux/slices/aismartviewSlice"

import { getDefects, getAiSmartView } from "../services/dashboardApi";

const AiSmartView = () => {
    const dispatch = useDispatch();
    const apiCallInterceptor = useApiInterceptor();
    const localPlantData = useSelector((state) => state.plant.plantData[0]);
    const AuthToken = useSelector((state) => state.auth.authData[0].accessToken);
    const aismartviewData = useSelector((state) => state.aismartview.aismartviewData);
    console.log(aismartviewData)
    const selectedDefect = useSelector((state) => state.aismartview.selectedDefectAismartview);
    const errorMessage = useSelector((state) => state.aismartview.errorMessage);
    const currentSlideIndex = useSelector((state) => state.aismartview.currentSlideIndex);
    const loader = useSelector((state) => state.aismartview.loader);
    const pagination = useSelector((state) => state.aismartview.pagination);
    const defectsData = useSelector((state) => state.defect.defectsData);
    const sliderRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            dispatch(setLoading(true));
            try {
                const { data } = await getDefects(localPlantData.plant_name, AuthToken, apiCallInterceptor);
                dispatch(setAismartviewData({
                    aismartviewData: data.results,
                    pageSize: data.page_size,
                    totalPages: Math.ceil(data.total_count / data.page_size),
                }));
            } catch (err) {
                dispatch(setErrorMessage(err.message || "Failed to fetch data"));
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchData();
    }, [localPlantData.plant_name, AuthToken, apiCallInterceptor, dispatch]);

  
    const handleDefectChange = async (value) => {
      const selectedId = value;
      const defect = defectsData.find((defect) => defect.id === selectedId);
      dispatch(setSelectedDefectAismartview(defect));
      dispatch(updatePagination({ currentPage: 1, pageSize: pagination.pageSize }));
  };
  

    const handleNext = () => {
        if (pagination.currentPage < pagination.totalPages) {
            dispatch(updatePagination({ currentPage: pagination.currentPage + 1, pageSize: pagination.pageSize }));
        } else if (sliderRef.current) {
            sliderRef.current.slickNext();
        }
    };

    const handlePrev = () => {
        if (pagination.currentPage > 1) {
            dispatch(updatePagination({ currentPage: pagination.currentPage - 1, pageSize: pagination.pageSize }));
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
        afterChange: (index) => dispatch(setCurrentSlideIndex(index)),
    };
    return (
      <div className="flex min-h-[calc(100vh-120px)] gap-2">
          <div
              style={{ backgroundImage: `url(${gridBg})` }}
              className="defect-image-container flex w-9/12 border p-2 rounded-md bg-cover bg-center"
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
                      {errorMessage ? (
                          <p className="text-lg text-white">{errorMessage}</p>
                      ) : selectedDefect ? (
                          <>
                              <div className="AISmartContainer">
                                  <div className="AISmartContainer-top">
                                      <div>
                                          <strong>Machine:</strong>{" "}
                                          {aismartviewData[currentSlideIndex]?.machine_name}
                                      </div>
                                      <div>
                                          <strong>Recorded Date & Time:</strong>{" "}
                                          {aismartviewData[currentSlideIndex]?.recorded_date_time.split("T").join(" ")}
                                      </div>
                                  </div>
                                  <Slider {...settings} ref={sliderRef} className="max-w-[100vh]">
                                      {aismartviewData?.map((item, index) => (
                                          <div key={index} className="aismart-item">
                                              <LazyLoad height={400} offset={100}>
                                                  <img
                                                      src={`data:image/jpeg;base64,${item.encoded_image}`}
                                                      alt={`Slide ${index}`}
                                                      className="max-h-[70vh] mx-auto"
                                                  />
                                              </LazyLoad>
                                          </div>
                                      ))}
                                  </Slider>
                              </div>
                              <div className="flex items-center justify-between mt-4">
                                  <button
                                      onClick={handlePrev}
                                      disabled={pagination.currentPage <= 1}
                                      className="bg-blue-500 text-white py-2 px-4 rounded"
                                  >
                                      <LeftOutlined />
                                  </button>
                                  <button
                                      onClick={handleNext}
                                      disabled={pagination.currentPage >= pagination.totalPages}
                                      className="bg-blue-500 text-white py-2 px-4 rounded"
                                  >
                                      <RightOutlined />
                                  </button>
                              </div>
                          </>
                      ) : (
                          <p className="text-lg text-white">Select a defect to view images.</p>
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