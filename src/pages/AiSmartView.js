import React, {  useRef, useState } from "react";
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
import { Pagination ,ConfigProvider } from 'antd';
import { current } from "@reduxjs/toolkit";
const AiSmartView = () => {

 const dispatch = useDispatch()

  const [aismartviewData, setAismartviewData] = useState([]);
  const localPlantData = useSelector((state) => state.plant.plantData[0]);
  const AuthToken = useSelector((state) => state.auth.authData[0].accessToken);
  const defectsData = useSelector((state) => state.defect.defectsData);


  const selectedDefect = useSelector((state) => state.defect.selectedDefect);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [pagination, setPagination] = useState({ currentPage: 1, pageSize: 10 , total:0 });
  const [loader, setLoader] = useState(false);

  const apiCallInterceptor = useApiInterceptor();
  const sliderRef = useRef(null);
  const sideImage = useRef();
  

  const handleDefectChange = async (value) => {
    if (!value) {
      setAismartviewData(null);
      return dispatch(setSelectedDefect(null))
    }
    const selectedId = value;
    dispatch(setSelectedDefect(Number(value)))
    
    setCurrentSlideIndex(0);

    try {
      setLoader(true);
      const aiSmartViewData = await getAiSmartView(localPlantData.id, AuthToken, apiCallInterceptor, 1, selectedId);
      setAismartviewData(aiSmartViewData.results);
      setPagination({...pagination,currentPage:1,total:aiSmartViewData.total_pages})
    } catch (error) {
      throw new Error(error)
    } finally {
      setLoader(false);
    }
  };

 

  const handleNext = async (val) => {
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



   const handleChange  = async(pagination)=>{
    try {
  setLoader(true);
      const aiSmartViewData = await getAiSmartView(localPlantData.id, AuthToken, apiCallInterceptor, pagination, selectedDefect);
      setAismartviewData(aiSmartViewData.results);
      setCurrentSlideIndex(0);
      setPagination((prev)=>({...prev,currentPage:pagination}))
    } catch (error) {
      throw new Error(error)
    }
    finally{
      setLoader(false)
    }
   }


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
              colors={["#06175d"]}
            />
          </div>
        ) : (
          <>
            {selectedDefect !== null ? (
              <>
                {
                  aismartviewData?.length > 0 ?
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


                        <Slider {...settings} ref={sliderRef} className=" w-full flex items-center justify-center p-3 !relative">
                          {aismartviewData?.map((item, index) => (
                              <div key={index + 1} className="w-full aismart-item flex items-center justify-center ">
                                <img
                                  src={decryptAES(item.image)}
                                  alt={`Slide ${index + 1}`}
                                  style={{ maxHeight: "60vh", width: '40vw', display: "block", margin: "0 auto" }}
                                />

                              </div>
                          ))}
                        </Slider>
                     
                        {
                          aismartviewData?.length > 2 &&
                          <button

                            onClick={handlePrev}
                            // disabled={currentSlideIndex === 0}
                            className="commButton py-2 px-3 rounded-lg text-white absolute top-1/2 "
                          >
                            <CaretLeftOutlined style={{ fontSize: '24px', color: '#fff' }} />
                          </button>
}
                        
                        {
                          aismartviewData.length > 2 &&
                          <button
                            onClick={(i) => handleNext()}
                            // disabled={currentSlideIndex === 10}
                            className="commButton py-2 px-3 rounded-lg text-white absolute top-1/2 right-1/4"
                          >
                            <CaretRightOutlined style={{ fontSize: '24px', color: '#fff' }} />
                          </button>
                        }
                      </div>

                      <div className="flex items-center justify-between mt-4">



                      </div>
                    </>
                    : <div className="" style={{ height: "100%", maxHeight: "70vh", width: '100%', display: "flex", fontWeight: "800", justifyContent: "center", alignItems: "center" }}>NO DATA</div>

                }
              </>
            ) : (
              <p className="text-lg text-black">Select a defect to view images.</p>
            )}
          </>
        )}
      </div>
      <div className="defect-selection flex flex-col w-3/12  gap-2 ">
      <div className="bg-[#43996a] flex flex-col p-2 gap-1 rounded-md text-white font-bold border-0">
      <label>Select Defect</label>
      <SelectComponent placeholder={"Select Defects"} selectedData={selectedDefect} setSelectedData={setSelectedDefect} action={(val) => handleDefectChange(val)} data={defectsData} style={{ minWidth: "150px", zIndex: 1 }} size={"large"} />
      </div>
      {
        
        loader ? 
        <div className="flex justify-center items-center h-full">

          <Hourglass
          visible={true}
          height="40"
          width="40"
          ariaLabel="hourglass-loading"
          colors={["#06175d"]}
        />
          </div>
        :
        
         aismartviewData?.length > 0 ? 
      <div className="flex flex-wrap gap-3 justify-center items-center mt-3 ">
        {
          aismartviewData?.map((item, index)=>{
            const decrypt = decryptAES(item?.image);
            return(
              <img src={decrypt} ref={sideImage} className={`w-20 h-20 ${currentSlideIndex === index ? " border-2 border-[#43996a] scale-125" : ""}`} />
            )
          })
        }
      <div className="flex justify-around w-full ">
      <ConfigProvider
  theme={{
    token: {
     colorText:"#43996a" ,
     itemLinkBg:"#000",
      },
    
  }}
>
      <Pagination className="font-bold text-[#06175d]
      " size="large" simple defaultCurrent={pagination.currentPage} total={pagination.total} showSizeChanger={false} onChange={handleChange} />
</ConfigProvider>

        
      </div>
      </div>
      : <div className="h-full flex justify-center items-center w-full font-bold"> {selectedDefect !== null ? "NO DATA" : "Please Select Defect"} </div>
      }
      </div>
    </div>
  );
};

export default AiSmartView;
