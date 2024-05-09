import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {Select } from "antd";
import "../index.css"
import {RightOutlined ,LeftOutlined} from '@ant-design/icons';


const AiSmartView = () => {
  const [defectImages, setDefectImages] = useState([]);
  const [defects, setDefects] = useState([]);
  const [selectedDefect, setSelectedDefect] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); 
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0); 
  const sliderRef = useRef(null); 

  useEffect(() => {
    axios.get("http://143.110.184.45:8100/defect/")
      .then(response => {
        setDefects(response.data);
      })
      .catch(error => {
        console.error("Error fetching defects:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedDefect) {
      axios.get(`http://143.110.184.45:8100/aismart/${selectedDefect.id}/`)
        .then(response => {
          if (response.data.message) {
            setErrorMessage(response.data.message);
            setDefectImages([]); 
          } else {
            setDefectImages(response.data.defect_images);
            setErrorMessage(""); 
          }
        })
        .catch(error => {
          console.error("Error fetching defect images:", error);
          setErrorMessage("No Images to display for this selected defect");
        });
    } else {

      setDefectImages([]);
      setErrorMessage("");
    }
  }, [selectedDefect]);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (index) => setCurrentSlideIndex(index) 
  };

  const handleDefectChange = (value) => {
    const selectedId = value;
    const selectedDefect = defects.find(defect => defect.id === selectedId);
    setSelectedDefect(selectedDefect);
  };

 const renderNextFourImages = () => {
    const nextFourIndexes = [];
    for (let i = currentSlideIndex + 1; i <= currentSlideIndex + 4 && i < defectImages.length; i++) {
      nextFourIndexes.push(i);
    }
    return nextFourIndexes.map((index) => (
      <div key={index} className="d-flex justify-content-center">
        <img src={defectImages[index].image_url} alt={`Defect ${index + 1}`} style={{ width: '80px', height: '80px',objectFit:"cover" ,margin: '5px' }} />
      </div>
    ));
  };
  return (
    <div className="">

        <Select
        style={{ minWidth: "200px", marginRight: "10px" }}
        placeholder="Select Defects"
        size="large"
        onChange={handleDefectChange}
        defaultValue={null}
      >
        {defects.map(defects => (
          <Select.Option key={defects.id} value={defects.id}>{defects.name}</Select.Option>
        ))}
      </Select>

        {errorMessage ? (
            <p style={{ textAlign: 'center', marginTop: '10vh', fontSize: '3rem', fontWeight: '500' }}>{errorMessage}</p>
        ) : selectedDefect ? (
            <>
            <div className="AISmartContainer">

       
                <div className="AISmartContainer-top">
                  <div>
                   <strong> Machine:</strong> {defectImages[currentSlideIndex]?.machine_name}{" "}

                  </div>
                    <div>

                   <strong>Recorded Date & Time:</strong>  {defectImages[currentSlideIndex]?.recorded_date_time}
                    </div>
                </div>

                <Slider {...settings} ref={sliderRef}>
                    {defectImages.map((imageData, index) => (
                        <div key={index} className="d-flex justify-content-center">
                            <img src={imageData.image_url} alt={`Defect ${index + 1}`} style={{ width: '100%', height: '55vh',margin:"0 auto",maxWidth:'900px' }} />
                        </div>
                    ))}
                </Slider>
 <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            {renderNextFourImages()}
          </div>
                <button className="prev-button btn btn-primary " style={{backgroundColor:"rgb(236, 82, 45)",border:"none",outline:"none"}} onClick={() => sliderRef.current.slickPrev()}>
                <LeftOutlined />
                </button>
                <button className="next-button btn btn-primary"  style={{backgroundColor:"rgb(236, 82, 45)",border:"none",outline:"none"}} onClick={() => sliderRef.current.slickNext()}>
                <RightOutlined />
                </button>
                </div>
            </>
        ) : (
            <p style={{ display:"flex",justifyContent:"center", alignItems:"center", fontSize: '2rem', fontWeight: '600' }}>Please select a defect to display images.</p>
        )}
    </div>
);}

export default AiSmartView;
