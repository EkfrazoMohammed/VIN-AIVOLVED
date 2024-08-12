import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Slider from "react-slick";
import LazyLoad from "react-lazyload";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Select } from "antd";
import "../index.css";
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import { Hourglass } from 'react-loader-spinner';
import "../assets/styles/ai-smart.css";
// import {API, AuthToken, baseURL, localPlantData} from "./../API/API"
import { useSelector,useDispatch } from "react-redux";
import {baseURL} from "./../API/API"
const AiSmartView = () => {
//   const localItems = localStorage.getItem("PlantData");
//   const localPlantData = JSON.parse(localItems);
const localPlantData = useSelector((state) => state.plant.plantData);
  const AuthToken = useSelector((state) => state.auth.authData.access_token);
  const [defectImages, setDefectImages] = useState([]);
  const [defects, setDefects] = useState([]);
  const [selectedDefect, setSelectedDefect] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); 
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0); 
  const sliderRef = useRef(null); 
  const [loader, setLoader] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
  });
  const [nextFourIndexes, setNextFourIndexes] = useState([]);

  useEffect(() => {
    axios.get(`${baseURL}defect/?plant_name=${localPlantData.plant_name}`, {
      headers: { Authorization: `Bearer ${AuthToken}` }
    })
    .then(response => {
      setDefects(response.data.results);
    })
    .catch(error => {
      console.error("Error fetching defects:", error);
    });
  }, []);

  useEffect(() => {
    aiViewAPi();
  }, [selectedDefect, pagination.currentPage]);

  useEffect(() => {
    const updateNextFourIndexes = () => {
      const arry = [];
      for (let i = currentSlideIndex + 1; i <= currentSlideIndex + 4 && i < defectImages.length; i++) {
        arry.push(i);
      }
      setNextFourIndexes(arry);
    };

    updateNextFourIndexes();
  }, [currentSlideIndex, defectImages]);

  const aiViewAPi = () => {
    if (selectedDefect) {
      setLoader(true);
      axios.get(
        `${baseURL}ai-smart/?plant_id=${localPlantData.id}&page=${pagination.currentPage}&defect_id=${selectedDefect.id}`, {
        headers: {
          Authorization: `Bearer ${AuthToken}`
        }
      })
      .then(response => {
        if (response.data.results.length > 0) {
          setErrorMessage("");
          setDefectImages(response.data.results);
          setPagination(prev => ({
            ...prev,
            pageSize: response.data.page_size,
            totalPages: Math.ceil(response.data.total_count / response.data.page_size)
          }));
        } else {
          setDefectImages([]);
          setErrorMessage("NO DATA");
        }
        setLoader(false);
      })
      .catch(error => {
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
    const selectedDefect = defects.find(defect => defect.id === selectedId);
    setSelectedDefect(selectedDefect);
    setPagination(prev => ({
      ...prev,
      currentPage: 1,
    }));
  };

  const handleNext = () => {
    if (currentSlideIndex < defectImages.length - 1) {
      sliderRef.current.slickNext();
    } else if (pagination.currentPage < pagination.totalPages) {
      setPagination(prev => ({
        ...prev,
        currentPage: prev.currentPage + 1
      }));
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      sliderRef.current.slickPrev();
    } else if (pagination.currentPage > 1) {
      setPagination(prev => ({
        ...prev,
        currentPage: prev.currentPage - 1
      }));
    }
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (index) => setCurrentSlideIndex(index),
  };

  const renderNextFourImages = () => {
    return nextFourIndexes.map((index) => (
      <div key={index} className="d-flex justify-content-center" style={{ alignItems: "center" }}>
        <LazyLoad height={80} offset={100}>
             {/* GLOBAL  */}
        <img src={`${defectImages[index].image}`} alt={`Defect ${index + 1}`} style={{ width: '80px', height: '80px',objectFit:"cover" ,margin: '5px' }} />
        {/* LOCAL DASHBOARD */}
        {/* <img src={`http://localhost:8000${defectImages[index].image}`} alt={`Defect ${index + 1}`} style={{ width: '80px', height: '80px',objectFit:"cover" ,margin: '5px' }} /> */}
        </LazyLoad>
      </div>
    ));
  };

  return (
    <div className="">
      <Select
        showSearch
        style={{ minWidth: "200px", marginRight: "10px" }}
        placeholder="Select Defects"
        size="large"
        onChange={handleDefectChange}
        defaultValue={null}
        filterOption={(input, defects) =>
          (defects.children ?? "").toLowerCase().includes(input.toLowerCase())
        }
      >
        {defects.map(defects => (
          <Select.Option key={defects.id} value={defects.id}>{defects.name}</Select.Option>
        ))}
      </Select>
      {loader ?  
        <div className="" style={{ height: "60vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px", marginTop: '1rem', borderRadius: "10px" }}>
          <Hourglass
            visible={true}
            height="40"
            width="40"
            ariaLabel="hourglass-loading"
            wrapperStyle={{}}
            wrapperClass=""
            colors={['#ec522d', '#ec522d']}
          />
        </div>
        : 
        <>
          {errorMessage ? (
            <p style={{ textAlign: 'center', marginTop: '10vh', fontSize: '2.5rem', fontWeight: '500' }}>{errorMessage}</p>
          ) : selectedDefect ? (
            <>
              <div className="AISmartContainer">
                <div className="AISmartContainer-top">
                  <div>
                    <strong>Machine:</strong> {defectImages[currentSlideIndex]?.machine_name}{" "}
                  </div>
                  <div>
                    <strong>Recorded Date & Time:</strong> {defectImages[currentSlideIndex]?.recorded_date_time.split("T").join(" ")}
                  </div>
                </div>
                <Slider {...settings} ref={sliderRef}>
                  {defectImages.map((imageData, index) => (
                    <div key={index} className="ai-view-image_container d-flex justify-content-center vh-100">
                      <LazyLoad height={200} offset={100}>
              <img src={`${imageData.image}`} alt={`Defect ${index + 1}`} style={{ width: '100%', height: 'auto',margin:"0 auto",maxWidth:'500px' }} />
              {/* <img src={`http://localhost:8000${imageData.image}`} alt={`Defect ${index + 1}`} style={{ width: '100%', height: '55vh',margin:"0 auto",maxWidth:'900px' }} /> */}
                      </LazyLoad>
                    </div>
                  ))}
                </Slider>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                  {renderNextFourImages()}
                </div>
                <button className="prev-button btn btn-primary" style={{ backgroundColor: "rgb(236, 82, 45)", border: "none", outline: "none" }} onClick={handlePrev}>
                  <LeftOutlined />
                </button>
                <button className="next-button btn btn-primary" style={{ backgroundColor: "rgb(236, 82, 45)", border: "none", outline: "none" }} onClick={handleNext}>
                  <RightOutlined />
                </button>
                <div className="pagination-controls">
                  <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
                </div>
              </div>
            </>
          ) : (
            <p style={{ display: "flex", justifyContent: "center", alignItems: "center", fontSize: '2rem', fontWeight: '600' }}>Please select a defect to display images.</p>
          )}
        </>
      }
    </div>
  );
}

export default AiSmartView;
