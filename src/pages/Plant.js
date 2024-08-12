import { Row, Col, Card } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import useAxiosInstance from "../API/useAxiosInstance";
import Slider from "react-slick";
import "../assets/styles/Plant.css";
import { Hourglass } from 'react-loader-spinner';
import { setPlantData } from "../redux/slices/plantSlice"; // Import setPlantData action
import useApiInterceptor from "../hooks/useInterceptor";

import { useNavigate } from 'react-router-dom';
const Plant = () => {

  const api = useApiInterceptor()


  const [plant, setPlant] = useState([]);
  const [loader, setLoader] = useState(true);

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: false,
    autoplay: true,
    speed: 1500,
    autoplaySpeed: 1,
  };

  const axiosInstance = useAxiosInstance();
  const dispatch = useDispatch();


  useEffect(() => {
    api.get(`/plant/`)
      .then((res) => {
        if (res.data.results) {
          setLoader(false);
        }
        setPlant(res.data.results);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const navigate = useNavigate();
  const handleStorage = (plantData) => {

    if (plantData) {
      dispatch(setPlantData(plantData)); // Dispatch plant data to Redux
      navigate('/dashboard-home'); // Navigate to dashboard if plantData is valid
    } else {
      console.error('Invalid plant data:', plantData); // Handle cases where plantData is not valid
    }
  };


  return (
    <Row className="h-screen m-0 p-0 overflow-hidden">
      <Col span={5} className="flex justify-center p-0 m-0">

        <div className="slider-container">
          <Slider {...settings}>
            <div className="image_wrapper">
              <img
                style={{ height: '100%', width: '200px', objectFit: 'contain', objectPosition: 'center' }}
                src="https://aactxg.stripocdn.email/content/guids/CABINET_a08f84c963ba97ae8e54a37bd01dd75bb5bb673089fc68f65ed61fa0eb796f86/images/hamamsoap.png"
                alt=""
              />
            </div>
            <img
              style={{ height: '100%', width: '200px', objectFit: 'contain', objectPosition: 'center' }}
              src="https://aactxg.stripocdn.email/content/guids/CABINET_a08f84c963ba97ae8e54a37bd01dd75bb5bb673089fc68f65ed61fa0eb796f86/images/surfexcel.png"
              alt=""
            />
            <div className="image_wrapper" >

              <img style={{ height: '100%', width: '200px', objectFit: 'contain', objectPosition: 'center' }} src="https://aactxg.stripocdn.email/content/guids/CABINET_a08f84c963ba97ae8e54a37bd01dd75bb5bb673089fc68f65ed61fa0eb796f86/images/dovesachet.png" alt="" />        </div>
            <div className="image_wrapper" >
              <img style={{ height: '100%', width: '200px', objectFit: 'contain', objectPosition: 'center' }} src="https://aactxg.stripocdn.email/content/guids/CABINET_a08f84c963ba97ae8e54a37bd01dd75bb5bb673089fc68f65ed61fa0eb796f86/images/sunsilksaceht.png" alt="" />        </div>
            <div className="image_wrapper" >
              <img style={{ height: '100%', width: '200px', objectFit: 'contain', objectPosition: 'center' }} src="https://aactxg.stripocdn.email/content/guids/CABINET_a08f84c963ba97ae8e54a37bd01dd75bb5bb673089fc68f65ed61fa0eb796f86/images/clinicplus.png" alt="" />        </div>

          </Slider>
        </div>
      </Col>
      <Col span={14} className="flex justify-start bg-[#dfefff] flex-col gap-0 items-center">
        <Row className="flex justify-center">
          <Col span={24} className="flex justify-center">
            <img className="w-1/2" src="https://eimkeia.stripocdn.email/content/guids/CABINET_8270216c780e362a1fbcd636b59c67ae376eb446dc5f95e17700b638b8c3f618/images/131321hulremovebgpreview.png" alt="" />
          </Col>
        </Row>
        {loader ?
          <div className="h-[50vh] flex justify-center items-center">
            <Hourglass
              visible={true}
              height="40"
              width="40"
              ariaLabel="hourglass-loading"
              colors={['#293dbe', '#293dbe']}
            />
          </div>
          :
          <>
            <Col className="flex justify-center">
              <div className="mytab-content p-2 flex gap-2  min-w-[40vw] flex-col">
                <h3 className="text-black text-xl font-bold">Plants</h3>
                <h5>Choose Plants</h5>

                {plant.length > 0 && (
                  <Row gutter={[24, 24]} className="plant-row">
                    {plant.map((plant) => (
                      <Col span={8} key={plant.id}>
                        <Card
                          hoverable
                          className="custom-card"
                          onClick={() => handleStorage(plant)}
                        >
                          <div className="custom-card-content flex flex-col items-center">
                            {/* <img
                            src={plant.plant_logo}
                            alt=""
                            className="custom-card-image"
                          /> */}
                            <img
                              src='https://media.licdn.com/dms/image/C4E12AQHw3bPisn1x0g/article-inline_image-shrink_1000_1488/0/1595858405291?e=1724284800&v=beta&t=mHKkjIq_LELHb3yT9Euo1vDxlSfmjlBlZwhTZPdJsDs'
                              style={{ width: "90%", height: "90%", borderRadius: "50%", }}
                              alt=""
                            />
                            <h3>{plant.plant_name}</h3>
                          </div>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )}
              </div>
            </Col>
          </>
        }
      </Col>

      <Col span={5} style={{ display: 'flex', justifyContent: 'center' }}>

        <div className="slider-container">
          <Slider {...settings}>
            <div className="image_wrapper">
              <img
                style={{ height: '100%', width: '200px', objectFit: 'contain', objectPosition: 'center' }}
                src="https://aactxg.stripocdn.email/content/guids/CABINET_a08f84c963ba97ae8e54a37bd01dd75bb5bb673089fc68f65ed61fa0eb796f86/images/surfexcel.png"
                alt=""
              />
            </div>
            <div className="image_wrapper" >

              <img style={{ height: '100%', width: '200px', objectFit: 'contain', objectPosition: 'center' }} src="https://aactxg.stripocdn.email/content/guids/CABINET_a08f84c963ba97ae8e54a37bd01dd75bb5bb673089fc68f65ed61fa0eb796f86/images/lifebuoy.png" alt="" />        </div>
            <div className="image_wrapper" >
              <img style={{ height: '100%', width: '200px', objectFit: 'contain', objectPosition: 'center' }} src="https://aactxg.stripocdn.email/content/guids/CABINET_a08f84c963ba97ae8e54a37bd01dd75bb5bb673089fc68f65ed61fa0eb796f86/images/comfortgreen.png" alt="" />        </div>
            <div className="image_wrapper" >
              <img style={{ height: '100%', width: '200px', objectFit: 'contain', objectPosition: 'center' }} src="https://aactxg.stripocdn.email/content/guids/CABINET_a08f84c963ba97ae8e54a37bd01dd75bb5bb673089fc68f65ed61fa0eb796f86/images/comfortpink.png" alt="" />        </div>
            <div className="image_wrapper" >
              <img style={{ height: '100%', width: '200px', objectFit: 'contain', objectPosition: 'center' }} src="https://aactxg.stripocdn.email/content/guids/CABINET_a08f84c963ba97ae8e54a37bd01dd75bb5bb673089fc68f65ed61fa0eb796f86/images/comfortblue.png" alt="" />        </div>

          </Slider>
        </div>

      </Col>
    </Row>
  );
};

export default Plant;