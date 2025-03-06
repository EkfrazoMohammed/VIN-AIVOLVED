import React, {  useRef, useState , forwardRef }  from "react";
import Slider from "react-slick";
import { useDispatch, useSelector } from "react-redux";
import { CaretRightOutlined , CaretLeftOutlined } from "@ant-design/icons";
import { Hourglass } from "react-loader-spinner";
import useApiInterceptor from "../hooks/useInterceptor";
import { decryptAES } from "../redux/middleware/encryptPayloadUtils";
import {getAiSmartView } from "../services/dashboardApi";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SelectComponent from "../components/common/Select";
import { setSelectedDefect } from "../redux/slices/defectSlice";
import { Pagination ,ConfigProvider, Spin, Image } from 'antd';



const ImageRenderer = forwardRef(({ image_b64, item, handleImageClick , index}, ref) => {
  if (!image_b64) return null;

  return (
    <div
      ref={ref}
      className={`w-20 h-20 flex cursor-pointer justify-center items-center overflow-hidden bg-gray-200 rounded-md border-2 border-[#43996a]`}
      onClick={() => handleImageClick(item , index)} // Pass item on click
    >
      <Image
        src={image_b64}
        alt="Defect Image"
        preview={false}
        style={{ width: "100%", height: "100%", objectFit: "contain" }} // Ensures it stays within the div
        placeholder={
          <div className="flex justify-center items-center w-full h-full">
            <Spin />
          </div>
        }
      />
    </div>
  );
});






const AiSmartView = () => {

  const dispatch = useDispatch();

  const [aismartviewData, setAismartviewData] = useState([]);
  const localPlantData = useSelector((state) => state.plant.plantData[0]);
  const AuthToken = useSelector((state) => state.auth.authData[0].accessToken);
  const defectsData = useSelector((state) => state.defect.defectsData);
  const [mainImageSrc, setMainImageSrc] = useState("");  // Add state to manage main image src
  const selectedDefect = useSelector((state) => state.defect.selectedDefect);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [pagination, setPagination] = useState({ currentPage: 1, pageSize: 10, total: 0 });
  const [loader, setLoader] = useState(false);

  const apiCallInterceptor = useApiInterceptor();
  const sliderRef = useRef(null);
  const sideImage = useRef();
  const mainImage = useRef();

  const handleDefectChange = async (value) => {
    if (!value) {
      setAismartviewData(null);
      return dispatch(setSelectedDefect(null));
    }
    const selectedId = value;
    dispatch(setSelectedDefect(Number(value)));

    setCurrentSlideIndex(0);
    setMainImageSrc(""); // Reset the main image source

    try {
      setLoader(true);
      const aiSmartViewData = await getAiSmartView(localPlantData.id, AuthToken, apiCallInterceptor, 1, selectedId);
      setAismartviewData(aiSmartViewData.results);
      setPagination({ ...pagination, currentPage: 1, total: aiSmartViewData.total_pages });
    } catch (error) {
      throw new Error(error);
    } finally {
      setLoader(false);
    }
  };

  const handleNext = async () => {
    sliderRef.current.slickNext();
  };

  const handlePrev = async () => {
    sliderRef.current.slickPrev();
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (index) => setCurrentSlideIndex(index),
  };

  const handleChange = async (pagination) => {
    try {
      setLoader(true);
      const aiSmartViewData = await getAiSmartView(localPlantData.id, AuthToken, apiCallInterceptor, pagination, selectedDefect);
      setAismartviewData(aiSmartViewData.results);
      setCurrentSlideIndex(0);
      setMainImageSrc("")
      setPagination((prev) => ({ ...prev, currentPage: pagination }));
    } catch (error) {
      throw new Error(error);
    } finally {
      setLoader(false);
    }
  };

  const handleImageClick = (item, index) => {
    const decrypt = decryptAES(item.image);
    setMainImageSrc(decrypt); 
    setCurrentSlideIndex(index);
    sliderRef.current.slickGoTo(index);
  };

  return (
    <div className="flex min-h-[calc(100vh-120px)] gap-2">
      <div className="defect-image-container w-9/12 border p-2 rounded-md bg-cover bg-center flex flex-col">
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
            <Hourglass visible={true} height="40" width="40" ariaLabel="hourglass-loading" colors={["#06175d"]} />
          </div>
        ) : (
          <>
            {selectedDefect !== null ? (
              <>
                {aismartviewData?.length > 0 ? (
                  <>
                    <div className="AISmartContainer">
                      <div className="AISmartContainer-top">
                        <div>
                          <strong>Machine:</strong> {decryptAES(aismartviewData[currentSlideIndex]?.machine_name)}
                        </div>
                        <div>
                          <strong>Recorded Date & Time:</strong>{" "}
                          {decryptAES(aismartviewData[currentSlideIndex]?.recorded_date_time).split("T").join(" ")}
                        </div>
                      </div>

                      <Slider {...settings} ref={sliderRef} className="w-full flex items-center justify-center p-3 !relative">
                        {aismartviewData?.map((item, index) => (
                          <div key={index + 1} className="w-[300px] aismart-item flex items-center justify-center h-[50vh]">
                            <img
                              src={mainImageSrc !==  "" ?   mainImageSrc :  decryptAES(item.image)} // Use mainImageSrc state or the initial image
                              alt={`Slide ${index + 1}`}
                              style={{ minWidth: "300px", width: "100%", height: "100%", display: "block", margin: "0 auto", objectFit: "contain" }}
                            />
                          </div>
                        ))}
                      </Slider>

                      {aismartviewData?.length > 2 && (
                        <button onClick={handlePrev} className="commButton py-2 px-3 rounded-lg text-white absolute top-1/2">
                          <CaretLeftOutlined style={{ fontSize: '24px', color: '#fff' }} />
                        </button>
                      )}

                      {aismartviewData.length > 2 && (
                        <button onClick={handleNext} className="commButton py-2 px-3 rounded-lg text-white absolute top-1/2 right-[23%]">
                          <CaretRightOutlined style={{ fontSize: '24px', color: '#fff' }} />
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="" style={{ height: "100%", maxHeight: "70vh", width: '100%', display: "flex", fontWeight: "800", justifyContent: "center", alignItems: "center" }}>
                    NO DATA
                  </div>
                )}
              </>
            ) : (
              <p className="text-lg text-black">Select a defect to view images.</p>
            )}
          </>
        )}
      </div>

      <div className="defect-selection flex flex-col w-3/12 gap-2 ">
        <div className="bg-[#43996a] flex flex-col p-2 gap-1 rounded-md text-white font-bold border-0">
          <label>Select Defect</label>
          <SelectComponent
            placeholder={"Select Defects"}
            selectedData={selectedDefect}
            setSelectedData={setSelectedDefect}
            action={(val) => handleDefectChange(val)}
            data={defectsData}
            style={{ minWidth: "150px", zIndex: 1 }}
            size={"large"}
          />
        </div>

        {loader ? (
          <div className="flex justify-center items-center h-full">
            <Hourglass visible={true} height="40" width="40" ariaLabel="hourglass-loading" colors={["#06175d"]} />
          </div>
        ) : (
          aismartviewData?.length > 0 && (
            <>
              <div className="flex justify-end w-full py-2">
                <ConfigProvider
                  theme={{
                    token: {
                      colorText: "#43996a",
                      itemLinkBg: "#000",
                    },
                  }}
                >
                  <Pagination
                    className="font-bold text-[#06175d]"
                    size="large"
                    simple
                    defaultCurrent={pagination.currentPage}
                    total={pagination.total}
                    showSizeChanger={false}
                    onChange={handleChange}
                  />
                </ConfigProvider>
              </div>

              <div className="flex flex-wrap gap-3 justify-center items-center mt-3">
                {aismartviewData?.map((item, index) => {
                  const decrypt = decryptAES(item?.image);
                  return (
                    <ImageRenderer key={index} image_b64={decrypt} ref={sideImage} item={item} index={index} handleImageClick={handleImageClick} />
                  );
                })}
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
};


export default AiSmartView;
