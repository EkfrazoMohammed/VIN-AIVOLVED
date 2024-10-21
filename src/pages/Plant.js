import { Row, Col, Card } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Slider from "react-slick";
import "../assets/styles/Plant.css";
import { Hourglass } from 'react-loader-spinner';
import { setPlantData } from "../redux/slices/plantSlice"; // Import setPlantData action
import useApiInterceptor from "../hooks/useInterceptor";
import { useNavigate } from 'react-router-dom';

const settings = {
  dots: false,
  infinite: true,
  slidesToShow: 3,
  slidesToScroll: 1,
  vertical: true,
  verticalSwiping: false,
  autoplay: true,
  speed: 1000,
  autoplaySpeed: 5,
};


const Plant = () => {

  const apiCallInterceptor = useApiInterceptor()
  const [plant, setPlant] = useState([]);
  const [loader, setLoader] = useState(true);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.auth.authData[0].accessToken);



  const handleStorage = (plantData) => {
    if (plantData && Array.isArray(plantData) && plantData.length > 0) {
      dispatch(setPlantData(plantData)); // Dispatch valid plant data to Redux
      navigate('/');
    } else {
      console.log('Invalid or empty plant data:', plantData); // Handle invalid data
    }
  };


  useEffect(() => {
    const fetchPlantData = async () => {
      try {
        if (!accessToken) {
          //console.log("Authorization token is missing");
          return;
        }

        const res = await apiCallInterceptor.get(`/plant/`)
        const { results } = res.data

        if (results) {
          setPlant(results);
        } else {
          //console.warn("No results found in the response");
        }
      } catch (err) {
        //console.log("Error fetching plant data:", err);
        if (err.response && err.response.data.code === "token_not_valid") {
          //console.log("Token is invalid or expired.");
          // Handle token refresh logic here, or redirect to login
        } else {
          //console.log("Error:", err.message || "Unknown log occurred");
        }
      } finally {
        setLoader(false);
      }
    };

    fetchPlantData();
  }, [accessToken]);

  const images1 = [
    'https://aactxg.stripocdn.email/content/guids/CABINET_a08f84c963ba97ae8e54a37bd01dd75bb5bb673089fc68f65ed61fa0eb796f86/images/clinicplus.png',
    'https://aactxg.stripocdn.email/content/guids/CABINET_a08f84c963ba97ae8e54a37bd01dd75bb5bb673089fc68f65ed61fa0eb796f86/images/lifebuoy.png',
    'https://aactxg.stripocdn.email/content/guids/CABINET_a08f84c963ba97ae8e54a37bd01dd75bb5bb673089fc68f65ed61fa0eb796f86/images/surfexcel.png',
    'https://aactxg.stripocdn.email/content/guids/CABINET_a08f84c963ba97ae8e54a37bd01dd75bb5bb673089fc68f65ed61fa0eb796f86/images/comfortgreen.png',
    'https://aactxg.stripocdn.email/content/guids/CABINET_a08f84c963ba97ae8e54a37bd01dd75bb5bb673089fc68f65ed61fa0eb796f86/images/comfortpink.png',
    'https://aactxg.stripocdn.email/content/guids/CABINET_a08f84c963ba97ae8e54a37bd01dd75bb5bb673089fc68f65ed61fa0eb796f86/images/comfortblue.png',

  ];
  const images2 = [
    'https://aactxg.stripocdn.email/content/guids/CABINET_a08f84c963ba97ae8e54a37bd01dd75bb5bb673089fc68f65ed61fa0eb796f86/images/clinicplus.png',
    'https://aactxg.stripocdn.email/content/guids/CABINET_a08f84c963ba97ae8e54a37bd01dd75bb5bb673089fc68f65ed61fa0eb796f86/images/dovesachet.png',
    'https://aactxg.stripocdn.email/content/guids/CABINET_a08f84c963ba97ae8e54a37bd01dd75bb5bb673089fc68f65ed61fa0eb796f86/images/hamamsoap.png',
    "https://aactxg.stripocdn.email/content/guids/CABINET_a08f84c963ba97ae8e54a37bd01dd75bb5bb673089fc68f65ed61fa0eb796f86/images/surfexcel.png",
    "https://aactxg.stripocdn.email/content/guids/CABINET_a08f84c963ba97ae8e54a37bd01dd75bb5bb673089fc68f65ed61fa0eb796f86/images/sunsilksaceht.png"
  ]
  return (
    <Row className="h-screen  overflow-hidden flex  bg-[#dfefff] justify-center items-center gap-4 p-2">
      <Col span={15} className="flex justify-start flex-col gap-0 items-center my-2 p-0">
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
            <Col className=" w-full">
              <div className="mytab-content  flex gap-2  flex-col w-full ">
                <h3 className="text-black text-3xl font-bold ">Plants</h3>
                <span className="text-xl flex-col flex w-[130px] justify-center items-center gap-1">
                  <span>Choose Plants</span>
                  <span className="bg-[#2734c1] w-[90%] h-0.5"></span>
                </span>
                {plant.length > 0 && (
                  <Row gutter={[24, 24]} className="plant-row my-3  justify-between">
                    {plant.map((plant) => (
                      <Col span={8} key={plant.id} >
                        <Card
                          hoverable
                          className="custom-card"
                          onClick={() => handleStorage([plant])}
                        >
                          <div className="custom-card-content flex flex-col items-center">

                            <img
                              src='https://eimkeia.stripocdn.email/content/guids/CABINET_8270216c780e362a1fbcd636b59c67ae376eb446dc5f95e17700b638b8c3f618/images/131321hulremovebgpreview.png'
                              style={{ width: "100%", height: "50%", borderRadius: "50%", }}
                              alt=""
                            />
                            <h3 className="font-bold text-[18px]  text-center whitespace-nowrap overflow-hidden w-[95%] text-ellipsis">{plant.plant_name}</h3>
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
      <Col span={4} className="flex justify-center my-3 bg-white rounded-3xl h-[95vh]">

        <div className="scroll-container">
          <div className="scroll-content2 ">
            {[...images2, ...images2].map((img, index) => (
              <img key={index} src={img} alt={`img-${index}`} className="image" />
            ))}
          </div>
        </div>
      </Col>
      <Col span={4} className="my-3 bg-white rounded-3xl flex justify-center h-[95VH]" >

        <div className="scroll-container">
          <div className="scroll-content ">
            {[...images1, ...images1].map((img, index) => (
              <img key={index} src={img} alt={`img-${index}`} className="image" />
            ))}
          </div>
        </div>

      </Col>
    </Row>
  );
};

export default Plant;