import { Row, Col, Card } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../assets/styles/Plant.css";
import { Hourglass } from 'react-loader-spinner';
import { setPlantData } from "../redux/slices/plantSlice"; // Import setPlantData action
import useApiInterceptor from "../hooks/useInterceptor";
import { useNavigate } from 'react-router-dom';




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
          return;
        }

        const res = await apiCallInterceptor.get(`/plant/`)
        const { results } = res.data

        if (results) {
          setPlant(results);
        } 
      } catch (err) {
        console.log("Error fetching plant data:");
        if (err.response && err.response.data.code === "token_not_valid") {
          console.log("Token is invalid or expired.");
         
        } else {
          console.log("Error:", err.message || "Unknown log occurred");
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
    <Row className="h-screen  overflow-hidden flex   justify-center items-center w-full px-0 bg-white ">
    <Col span={5} className="flex justify-start flex-col gap-0 items-center  p-2">
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
            <div className="mytab-content  flex gap-3  flex-col w-full justify-start ">
              <div className="flex  items-center w-full justify-center ">
                  <img
                            src='https://aivolved.in/wp-content/uploads/2022/11/ai-logo.png'
                            style={{ width: "60px", height: "auto", }}
                            alt=""
                          /> 
              </div>
            <Card
                        className=" bg-[#06175d] h-[80px]"
                      >
                        <div className=" flex justify-center items-center gap-2">
                          <img
                            src='https://eimkeia.stripocdn.email/content/guids/CABINET_8270216c780e362a1fbcd636b59c67ae376eb446dc5f95e17700b638b8c3f618/images/hindunilvrns_bigd9791ee3bremovebgpreview.png'
                            style={{ width: "50px", height: "auto", }}
                            alt=""
                          />
                        </div>
                      </Card>
                      <div className="flex flex-col">

              <span className="text-[#43996a] text-2xl font-bold ">Plants</span>
              <span className="text-md  font-bold text-gray-400">
                Please Choose Plant
                {/* <span className="bg-[#2734c1] w-[90%] h-0.5"></span> */}
              </span>
                      </div>
              {plant.length > 0 && (
                <Row  className=" my-3 flex justify-between flex-col gap-3 " >
                  {plant.map((plant) => (
                    <Col col={1}  key={plant.id}  >
                      
                      <Card
                        hoverable
                        className="custom-card bg-[#f6f6f6] h-full text-black hover:bg-[#43996a] hover:!text-white"
                        onClick={() => handleStorage([plant])}
                      >
                        <div className="custom-card-content flex justify-between items-center h-[30px] gap-2">
                          <div className="w-14 h-12  rounded-full bg-white">
                            <img className="w-full h-full rounded-full" src="https://s3-alpha-sig.figma.com/img/1df3/f7bb/8089ce03b9dcd7fd2e4a17888333dfa8?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=e7hqe3Vu98VmQvT93vA4LXL7m8x5OfLY39w1YCDp0rCfOChfv0K4X4zQVhaRq~VWmbbuGgPQ2K5iJ6Gx5HPUyOcXarkk6rIm2q7xWPKKzDa7ju~K9OCt11VQu4j~CaTPSJ-yXAPiVhdwc09aX3QYFtB6wNHTKpUR7DVLGSKWdFKHYQpsfbvsPASfZewe9G4MpfjRhKEsLlREK-ytL5QCUEaV77M9P4xSaSG4ogyRFabWE4hztMz4gX8EV6ZdnhTbYIjum8Tw5XyIcDQDeqwzSlbnPIvE89ThOM6Lo52Hv9MJUJI-BYarKC7rFyuREy1Vp~BuBUCrjBa34oA1QgDmLw__" />
                            </div> 
                       
                          <span className="font-bold text-[16px] w-[85%]  text-start whitespace-nowrap overflow-hidden  text-ellipsis ">{plant.plant_name}</span>
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
    <Col span={18} className="flex flex-col justify-center   rounded-3xl h-full">

      <div className="scroll-container">
        <div className="scroll-content ">
        <div class="flex h-[70vh]  w-full gap-3 p-2 ">
        
        <div className="flex flex-col gap-2 w-[70%]" >
          <div className="item">
          <img  src="https://s3-alpha-sig.figma.com/img/2e6b/c8e4/45406a4b562a079cf3e7d0cc91eaa540?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=HpimTgNvQzlJDvNLtOCwJFMgB0RdYmUQBlsFetHEIno9~LVWa7votNKjW-owB1-R~3J~O64U07ZF3rWLeqDgWHCqssDpvFZ8mvgirdPj3giXfJ7L92S7tgRKo~UDOVgtz24V22tHakXBKs7-U639dEwl8RK~MN7i4xwldPWoX9XkcQFoBWFX9WswMLWCGx3vO0DusVUiR7UyQZzpVwYtM0w-yutB-0CwDxxtbxyF~-wEeCHqZ8aoMlCg12EyjhcazZ-YwDkWGLcR70rE5Q7aQWlRi2buOGphGO--KliAz3jyl6DOWbhPRLO6zN4Z7Kn0bc6rEbYJ7byP2ITUhIpr7w__"  className="image" />
        
          </div>
          <div className="item">
          <img  src="https://s3-alpha-sig.figma.com/img/0e9c/bec6/1b45e2e06d6fd3959e73643715fcc498?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ED~xdqUOOQtrF~D9ZdiFREc01ynKa0P~oWVp7yOAz~KqcdVzAI8wts8unAHj~1YsQmQdgIZ08kmoasxpA5tGt699VwC30iZapKh4EKejJZInBULOuWaZFvZxbBCQTygjDIqkK4jrH0ZaSbHHubCs99Zsxec4E~J3c5Qh7VlSNf2VPAEfH4Ucm3RkWsvluNfpULNbs~1BEjZ0fXphnv6hVpuqV39e6yUMotYnb9O09Yl1eCMi7uc~URc6DKHFmHOuaS4V-M8i4aQT-jJKgV~29~SDn~4U6q4R4ssVjx1-3A3AGJ9Vj2UN9PZfiheFOWwz1IXNNryqZVNQgmgPBG4i1A__"  className="image" />
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full"> 
           <div className="item">
           <img  src="https://s3-alpha-sig.figma.com/img/968c/e8f1/7a864f79fc2c811635569cda994586e0?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=qIB5DllxfloOugc8mhy1OC0AwSds8Dx7m07tWEEplpMa6UIPT2Jaze1KeLDNLgt2fkqj~knfGptBDhkKs4U8Jv3s~nnW9ABBFKEwsmcXiJXG59FG6y1TKI005YRtLpzaJSQ~hDycWxE4iieLBneOkBBBEcdiaE3Vsnm4cssyooBgA9iyl9i3puE6pkeOxbD7UAbpAIgi77LoWcDc-WVpo91HZ3BSP-vZj8jhJ3Q9bE4rxBOqgJugc3yG9RxJC1urfjSiwVBpkwH8Krdg0xM4Cp7sebC4TLmfhfe~U6LsdHzhF72Z7KcSWPyFhqK8~~fLTZM2XCY0XC46KvBRgUWbiA__"  className="image" />
           </div>
        <div className="item">
        <img  src="    https://s3-alpha-sig.figma.com/img/a198/cead/eeba04b84e594f5b3c97cceb24f5c160?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=aYmVnPb0Zhm3I0Ek4HymOvjQNwu9Ueknxmf-K6VfU64mFG5-LmD5kcJlAT0UZa9T8dBsM8tpnPq-eYDinnsiK9DuC1TttCSoEjqEL-XAoXA4sAPBpS7zqdBs2jGzK00lvIoo~NTwaXxPIU87Xm18Riv93FPKG7EclZnQs~UCr6zlrSUk5f7frBqiMLywKOFiXOlI~j~-xGbN6hg6um3xH1Y2ImL8od0M~W6T53tXj6tLOBfM9~AbFRXzbKyUN24SdecxEwKSlWky368-EkPj9HLCKIB4Xv~PMiGsmVG9~SsKMSEdstlmTpGUqvzucf6Ve-hyTwv66QS1w8alSCqQMA__
        "  className="image" />
        </div>
        <div className="item">
        <img  src="https://s3-alpha-sig.figma.com/img/0abe/5d84/00c7f9ae5d5bd2536be6c67bf7e006ca?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=qdUUrbBLallAqVSE84cTzE4H8bzZFN04SlpDB85CddcmUo~9w4Y-Sv1uitV-V-M8TZyWVObDzpD0E56M7zFGYnh45dSFE2sKTf3P5xbkilrIrqRfdqRlcuBxOdp7ovdvyixTgvIxTNZgJs8xmH2egx~JVTJDWmPEfW88SVM6gv7v9q37UOOqe29rTr9J1hCUqN~QxwNz5ejoxm0nQYa1-kvMTibndFLEQkUHIq8TxQohYh00bGXdnZ5~7ARGTs-A5UWaA3AQMK70sa5GXaAk5hm3tkmd81uTPX16otwsKRJFgQcOePye11TiLbxYiNULKi9fNyYC94X4lvQSDCESgw__"  className="image" />
        
        </div>
        
        
        </div>
        <div className="flex flex-col gap-2 w-[70%]" >
          <div className="item">
          <img  src=" https://s3-alpha-sig.figma.com/img/7ecb/476d/0a7279122b4dee63657d3266e7c99f3c?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=lRoB3WBaf6g-Gg6Enr7NhB~9oyfNia3YwmGAoQMcdCxxqtz~YMhx74lVd27M6wOoOF4bizSyMml~pKylpAiq2F~XfxbSSrmngY8iQ7gY1-AtXT1lpQkgibgr8CVPs8dqETwjDK5EqpRg44lWD33ABTLTFj92gb50SExSxBAkfh4uArFNANpDVqLghxUwc4TO-gIaUJ6evRfnScFB-Z-6e6iewGU1su3PDKyGnHnIjUyAbHWRA986a95SpUpbj0wGQvTf17OYZPouMG8bR5JAp0hosNZex1aXQxruYOBuFqs~L1H~25qVDbmXaiaVoutvOEVe2cPoZLT4koKHh05CFw__"  className="image" />
        
          </div>
          <div className="item">
          <img  src="https://s3-alpha-sig.figma.com/img/39dd/f61b/96f0026fab686ab53df8600b1790c8ef?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=EtOhyxEO3SAlLStFBKazHYEmRl~asol1J7sv5alzgweY5SSuWlNmu6BMNbTY55taiasxTEfo~jgwShQ3dDJvhCyjwLSIxZMpvjzVCWDqapNQYnaIrtbIpWtQirUx4A2EU-UJIUjnPp6EtXeBLjFIrqrjw6vlOGoPSy6jxgEFob1C0~0qskpOwBQZL7rk6bfpKFg2SUlHvdZxeU9PBXajCKJPPxBWLVlTXdtkcjUWSOzai9kEc~hrLdn2jjlVsfoSV28yE6RB7vjkAyA~92ohuCc5iR9GHZEm8mkMsSWKzvJ0wxj-6Pyh7aVW3mQiXXRF7kCs9Ly~IAx5MxyY~YVrqQ__"  className="image" />
        </div>
        </div>
        
        <div className="flex flex-col gap-2 w-full"> 
           <div className="item">
           <img  src="https://s3-alpha-sig.figma.com/img/e3fe/522d/b04ea5843b628aa4b0ca914d6efd70b9?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=eUlK7KAoXdX6u3b4wJaduABJSbFQEz210mw13yeFESW9mbQXaOZGF8GGZ7z6R9wRgCcK7Jlz0vUjXFk83VlMehBtZqPAickbMCVVT4~JDkhr41PmOIYgDImCA6GjbHAVrMhXXbBWtiFVORcDkFZbD3eT21QPdHgczcgHBNW~kyqivqdcl268QwNCUpc2W-cSWfL7JZPaHWP6H7C~oh31o0aKGeyRP8QVOZZc~OV3Ev22ACPQX7PoknZgACWVnglvsdmLXHnSyynVVOrk4ZQN4VWKFNHph-p3hbFYU0ycLsTxC3FErbA-c7aW5W~WVEDH7EJ65wo2EV6VRGsCT0fu4w__"  className="image" />
           </div>
        <div className="item">
        <img  src="https://s3-alpha-sig.figma.com/img/4a2e/3f42/68c024c5174e53dea50f8df3baf5fc40?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=DFGxxbI4tm4VTeDSlgYrLqG46r5Mny7N9Hn-gpEdNuE4lm1OlmE9ZxD3t01pFYSRCCNhKNnuOtZYxmxkARxdoF52532D4eoPLkIr17FUYKxZ~jNuoaqK6dPWzp58p-XlQ7OxoIyXKkyOalmwjawcKHTLtYwK1ulbs2QNrUWtmJERMq81VDlDzh41ts9FSPK~ksI1iCFKSYgc3iCXN-RcRMgXyTr8MuAHkRj16AtJYR4bLmYuilMopecmoHWIibN88wGV7aDUYwUSv7j~iwaGUQKggB0SY6fONrqMUlzWlYwHLlmcZxTqRStJXYwfHq5Zv2bL56rGpAxum4lRzfrtZQ__"  className="image" />
        </div>
        <div className="item">
        <img  src="https://s3-alpha-sig.figma.com/img/05eb/16c0/f0580ad43567c2a57b01abd3808cfca4?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=KoKyZEq-h0hn1e671UD9T2B9bLJj-avI7HxqubeAj8OItX8E~K~lSscVviTaBwM33m7geu4EInoVgjkd65leW3jm-6eJVFeVsSReIy8JMDHBOqFi5NivK0Od4WiYebsYJ1UL~nZz2GmAIcVtApCn2TiRanZwCAwOoeyVezAn4QJK6mKvgdeldkM1Cj0ToEB-VssfjGe-YnZJcDwDuGeopMbHsLgCLFLKQ9KZn430NwoKOvIjUiwSjAOgtsgsv9OfnbVNHupj3e~E9nQXjgNg96oYM-091p01IFtHXo2RXNLAW0rJXu4VZ54jUW2f7Mfu2hozBThcHZurEVZgIBz8xg__"  className="image" />
        </div>
        
        
        </div>
        
         
        </div>
        <div class="flex h-[70vh]  w-full gap-3 p-2 ">
        
        <div className="flex flex-col gap-2 w-[70%]" >
          <div className="item">
          <img  src="https://s3-alpha-sig.figma.com/img/2e6b/c8e4/45406a4b562a079cf3e7d0cc91eaa540?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=HpimTgNvQzlJDvNLtOCwJFMgB0RdYmUQBlsFetHEIno9~LVWa7votNKjW-owB1-R~3J~O64U07ZF3rWLeqDgWHCqssDpvFZ8mvgirdPj3giXfJ7L92S7tgRKo~UDOVgtz24V22tHakXBKs7-U639dEwl8RK~MN7i4xwldPWoX9XkcQFoBWFX9WswMLWCGx3vO0DusVUiR7UyQZzpVwYtM0w-yutB-0CwDxxtbxyF~-wEeCHqZ8aoMlCg12EyjhcazZ-YwDkWGLcR70rE5Q7aQWlRi2buOGphGO--KliAz3jyl6DOWbhPRLO6zN4Z7Kn0bc6rEbYJ7byP2ITUhIpr7w__"  className="image" />
        
          </div>
          <div className="item">
          <img  src="https://s3-alpha-sig.figma.com/img/0e9c/bec6/1b45e2e06d6fd3959e73643715fcc498?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ED~xdqUOOQtrF~D9ZdiFREc01ynKa0P~oWVp7yOAz~KqcdVzAI8wts8unAHj~1YsQmQdgIZ08kmoasxpA5tGt699VwC30iZapKh4EKejJZInBULOuWaZFvZxbBCQTygjDIqkK4jrH0ZaSbHHubCs99Zsxec4E~J3c5Qh7VlSNf2VPAEfH4Ucm3RkWsvluNfpULNbs~1BEjZ0fXphnv6hVpuqV39e6yUMotYnb9O09Yl1eCMi7uc~URc6DKHFmHOuaS4V-M8i4aQT-jJKgV~29~SDn~4U6q4R4ssVjx1-3A3AGJ9Vj2UN9PZfiheFOWwz1IXNNryqZVNQgmgPBG4i1A__"  className="image" />
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full"> 
           <div className="item">
           <img  src="https://s3-alpha-sig.figma.com/img/968c/e8f1/7a864f79fc2c811635569cda994586e0?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=qIB5DllxfloOugc8mhy1OC0AwSds8Dx7m07tWEEplpMa6UIPT2Jaze1KeLDNLgt2fkqj~knfGptBDhkKs4U8Jv3s~nnW9ABBFKEwsmcXiJXG59FG6y1TKI005YRtLpzaJSQ~hDycWxE4iieLBneOkBBBEcdiaE3Vsnm4cssyooBgA9iyl9i3puE6pkeOxbD7UAbpAIgi77LoWcDc-WVpo91HZ3BSP-vZj8jhJ3Q9bE4rxBOqgJugc3yG9RxJC1urfjSiwVBpkwH8Krdg0xM4Cp7sebC4TLmfhfe~U6LsdHzhF72Z7KcSWPyFhqK8~~fLTZM2XCY0XC46KvBRgUWbiA__"  className="image" />
           </div>
        <div className="item">
        <img  src="    https://s3-alpha-sig.figma.com/img/a198/cead/eeba04b84e594f5b3c97cceb24f5c160?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=aYmVnPb0Zhm3I0Ek4HymOvjQNwu9Ueknxmf-K6VfU64mFG5-LmD5kcJlAT0UZa9T8dBsM8tpnPq-eYDinnsiK9DuC1TttCSoEjqEL-XAoXA4sAPBpS7zqdBs2jGzK00lvIoo~NTwaXxPIU87Xm18Riv93FPKG7EclZnQs~UCr6zlrSUk5f7frBqiMLywKOFiXOlI~j~-xGbN6hg6um3xH1Y2ImL8od0M~W6T53tXj6tLOBfM9~AbFRXzbKyUN24SdecxEwKSlWky368-EkPj9HLCKIB4Xv~PMiGsmVG9~SsKMSEdstlmTpGUqvzucf6Ve-hyTwv66QS1w8alSCqQMA__
        "  className="image" />
        </div>
        <div className="item">
        <img  src="https://s3-alpha-sig.figma.com/img/0abe/5d84/00c7f9ae5d5bd2536be6c67bf7e006ca?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=qdUUrbBLallAqVSE84cTzE4H8bzZFN04SlpDB85CddcmUo~9w4Y-Sv1uitV-V-M8TZyWVObDzpD0E56M7zFGYnh45dSFE2sKTf3P5xbkilrIrqRfdqRlcuBxOdp7ovdvyixTgvIxTNZgJs8xmH2egx~JVTJDWmPEfW88SVM6gv7v9q37UOOqe29rTr9J1hCUqN~QxwNz5ejoxm0nQYa1-kvMTibndFLEQkUHIq8TxQohYh00bGXdnZ5~7ARGTs-A5UWaA3AQMK70sa5GXaAk5hm3tkmd81uTPX16otwsKRJFgQcOePye11TiLbxYiNULKi9fNyYC94X4lvQSDCESgw__"  className="image" />
        
        </div>
        
        
        </div>
        <div className="flex flex-col gap-2 w-[70%]" >
          <div className="item">
          <img  src=" https://s3-alpha-sig.figma.com/img/7ecb/476d/0a7279122b4dee63657d3266e7c99f3c?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=lRoB3WBaf6g-Gg6Enr7NhB~9oyfNia3YwmGAoQMcdCxxqtz~YMhx74lVd27M6wOoOF4bizSyMml~pKylpAiq2F~XfxbSSrmngY8iQ7gY1-AtXT1lpQkgibgr8CVPs8dqETwjDK5EqpRg44lWD33ABTLTFj92gb50SExSxBAkfh4uArFNANpDVqLghxUwc4TO-gIaUJ6evRfnScFB-Z-6e6iewGU1su3PDKyGnHnIjUyAbHWRA986a95SpUpbj0wGQvTf17OYZPouMG8bR5JAp0hosNZex1aXQxruYOBuFqs~L1H~25qVDbmXaiaVoutvOEVe2cPoZLT4koKHh05CFw__"  className="image" />
        
          </div>
          <div className="item">
          <img  src="https://s3-alpha-sig.figma.com/img/39dd/f61b/96f0026fab686ab53df8600b1790c8ef?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=EtOhyxEO3SAlLStFBKazHYEmRl~asol1J7sv5alzgweY5SSuWlNmu6BMNbTY55taiasxTEfo~jgwShQ3dDJvhCyjwLSIxZMpvjzVCWDqapNQYnaIrtbIpWtQirUx4A2EU-UJIUjnPp6EtXeBLjFIrqrjw6vlOGoPSy6jxgEFob1C0~0qskpOwBQZL7rk6bfpKFg2SUlHvdZxeU9PBXajCKJPPxBWLVlTXdtkcjUWSOzai9kEc~hrLdn2jjlVsfoSV28yE6RB7vjkAyA~92ohuCc5iR9GHZEm8mkMsSWKzvJ0wxj-6Pyh7aVW3mQiXXRF7kCs9Ly~IAx5MxyY~YVrqQ__"  className="image" />
        </div>
        </div>
        
        <div className="flex flex-col gap-2 w-full"> 
           <div className="item">
           <img  src="https://s3-alpha-sig.figma.com/img/e3fe/522d/b04ea5843b628aa4b0ca914d6efd70b9?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=eUlK7KAoXdX6u3b4wJaduABJSbFQEz210mw13yeFESW9mbQXaOZGF8GGZ7z6R9wRgCcK7Jlz0vUjXFk83VlMehBtZqPAickbMCVVT4~JDkhr41PmOIYgDImCA6GjbHAVrMhXXbBWtiFVORcDkFZbD3eT21QPdHgczcgHBNW~kyqivqdcl268QwNCUpc2W-cSWfL7JZPaHWP6H7C~oh31o0aKGeyRP8QVOZZc~OV3Ev22ACPQX7PoknZgACWVnglvsdmLXHnSyynVVOrk4ZQN4VWKFNHph-p3hbFYU0ycLsTxC3FErbA-c7aW5W~WVEDH7EJ65wo2EV6VRGsCT0fu4w__"  className="image" />
           </div>
        <div className="item">
        <img  src="https://s3-alpha-sig.figma.com/img/4a2e/3f42/68c024c5174e53dea50f8df3baf5fc40?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=DFGxxbI4tm4VTeDSlgYrLqG46r5Mny7N9Hn-gpEdNuE4lm1OlmE9ZxD3t01pFYSRCCNhKNnuOtZYxmxkARxdoF52532D4eoPLkIr17FUYKxZ~jNuoaqK6dPWzp58p-XlQ7OxoIyXKkyOalmwjawcKHTLtYwK1ulbs2QNrUWtmJERMq81VDlDzh41ts9FSPK~ksI1iCFKSYgc3iCXN-RcRMgXyTr8MuAHkRj16AtJYR4bLmYuilMopecmoHWIibN88wGV7aDUYwUSv7j~iwaGUQKggB0SY6fONrqMUlzWlYwHLlmcZxTqRStJXYwfHq5Zv2bL56rGpAxum4lRzfrtZQ__"  className="image" />
        </div>
        <div className="item">
        <img  src="https://s3-alpha-sig.figma.com/img/05eb/16c0/f0580ad43567c2a57b01abd3808cfca4?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=KoKyZEq-h0hn1e671UD9T2B9bLJj-avI7HxqubeAj8OItX8E~K~lSscVviTaBwM33m7geu4EInoVgjkd65leW3jm-6eJVFeVsSReIy8JMDHBOqFi5NivK0Od4WiYebsYJ1UL~nZz2GmAIcVtApCn2TiRanZwCAwOoeyVezAn4QJK6mKvgdeldkM1Cj0ToEB-VssfjGe-YnZJcDwDuGeopMbHsLgCLFLKQ9KZn430NwoKOvIjUiwSjAOgtsgsv9OfnbVNHupj3e~E9nQXjgNg96oYM-091p01IFtHXo2RXNLAW0rJXu4VZ54jUW2f7Mfu2hozBThcHZurEVZgIBz8xg__"  className="image" />
        </div>
        
        
        </div>
        
         
        </div>
        {/* DUPLICATE SET */}
        <div class="flex h-[70vh]  w-full gap-3 p-2 ">
        
        <div className="flex flex-col gap-2 w-[70%]" >
          <div className="item">
          <img  src="https://s3-alpha-sig.figma.com/img/2e6b/c8e4/45406a4b562a079cf3e7d0cc91eaa540?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=HpimTgNvQzlJDvNLtOCwJFMgB0RdYmUQBlsFetHEIno9~LVWa7votNKjW-owB1-R~3J~O64U07ZF3rWLeqDgWHCqssDpvFZ8mvgirdPj3giXfJ7L92S7tgRKo~UDOVgtz24V22tHakXBKs7-U639dEwl8RK~MN7i4xwldPWoX9XkcQFoBWFX9WswMLWCGx3vO0DusVUiR7UyQZzpVwYtM0w-yutB-0CwDxxtbxyF~-wEeCHqZ8aoMlCg12EyjhcazZ-YwDkWGLcR70rE5Q7aQWlRi2buOGphGO--KliAz3jyl6DOWbhPRLO6zN4Z7Kn0bc6rEbYJ7byP2ITUhIpr7w__"  className="image" />
        
          </div>
          <div className="item">
          <img  src="https://s3-alpha-sig.figma.com/img/0e9c/bec6/1b45e2e06d6fd3959e73643715fcc498?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ED~xdqUOOQtrF~D9ZdiFREc01ynKa0P~oWVp7yOAz~KqcdVzAI8wts8unAHj~1YsQmQdgIZ08kmoasxpA5tGt699VwC30iZapKh4EKejJZInBULOuWaZFvZxbBCQTygjDIqkK4jrH0ZaSbHHubCs99Zsxec4E~J3c5Qh7VlSNf2VPAEfH4Ucm3RkWsvluNfpULNbs~1BEjZ0fXphnv6hVpuqV39e6yUMotYnb9O09Yl1eCMi7uc~URc6DKHFmHOuaS4V-M8i4aQT-jJKgV~29~SDn~4U6q4R4ssVjx1-3A3AGJ9Vj2UN9PZfiheFOWwz1IXNNryqZVNQgmgPBG4i1A__"  className="image" />
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full"> 
           <div className="item">
           <img  src="https://s3-alpha-sig.figma.com/img/968c/e8f1/7a864f79fc2c811635569cda994586e0?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=qIB5DllxfloOugc8mhy1OC0AwSds8Dx7m07tWEEplpMa6UIPT2Jaze1KeLDNLgt2fkqj~knfGptBDhkKs4U8Jv3s~nnW9ABBFKEwsmcXiJXG59FG6y1TKI005YRtLpzaJSQ~hDycWxE4iieLBneOkBBBEcdiaE3Vsnm4cssyooBgA9iyl9i3puE6pkeOxbD7UAbpAIgi77LoWcDc-WVpo91HZ3BSP-vZj8jhJ3Q9bE4rxBOqgJugc3yG9RxJC1urfjSiwVBpkwH8Krdg0xM4Cp7sebC4TLmfhfe~U6LsdHzhF72Z7KcSWPyFhqK8~~fLTZM2XCY0XC46KvBRgUWbiA__"  className="image" />
           </div>
        <div className="item">
        <img  src="    https://s3-alpha-sig.figma.com/img/a198/cead/eeba04b84e594f5b3c97cceb24f5c160?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=aYmVnPb0Zhm3I0Ek4HymOvjQNwu9Ueknxmf-K6VfU64mFG5-LmD5kcJlAT0UZa9T8dBsM8tpnPq-eYDinnsiK9DuC1TttCSoEjqEL-XAoXA4sAPBpS7zqdBs2jGzK00lvIoo~NTwaXxPIU87Xm18Riv93FPKG7EclZnQs~UCr6zlrSUk5f7frBqiMLywKOFiXOlI~j~-xGbN6hg6um3xH1Y2ImL8od0M~W6T53tXj6tLOBfM9~AbFRXzbKyUN24SdecxEwKSlWky368-EkPj9HLCKIB4Xv~PMiGsmVG9~SsKMSEdstlmTpGUqvzucf6Ve-hyTwv66QS1w8alSCqQMA__
        "  className="image" />
        </div>
        <div className="item">
        <img  src="https://s3-alpha-sig.figma.com/img/0abe/5d84/00c7f9ae5d5bd2536be6c67bf7e006ca?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=qdUUrbBLallAqVSE84cTzE4H8bzZFN04SlpDB85CddcmUo~9w4Y-Sv1uitV-V-M8TZyWVObDzpD0E56M7zFGYnh45dSFE2sKTf3P5xbkilrIrqRfdqRlcuBxOdp7ovdvyixTgvIxTNZgJs8xmH2egx~JVTJDWmPEfW88SVM6gv7v9q37UOOqe29rTr9J1hCUqN~QxwNz5ejoxm0nQYa1-kvMTibndFLEQkUHIq8TxQohYh00bGXdnZ5~7ARGTs-A5UWaA3AQMK70sa5GXaAk5hm3tkmd81uTPX16otwsKRJFgQcOePye11TiLbxYiNULKi9fNyYC94X4lvQSDCESgw__"  className="image" />
        
        </div>
        
        
        </div>
        <div className="flex flex-col gap-2 w-[70%]" >
          <div className="item">
          <img  src=" https://s3-alpha-sig.figma.com/img/7ecb/476d/0a7279122b4dee63657d3266e7c99f3c?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=lRoB3WBaf6g-Gg6Enr7NhB~9oyfNia3YwmGAoQMcdCxxqtz~YMhx74lVd27M6wOoOF4bizSyMml~pKylpAiq2F~XfxbSSrmngY8iQ7gY1-AtXT1lpQkgibgr8CVPs8dqETwjDK5EqpRg44lWD33ABTLTFj92gb50SExSxBAkfh4uArFNANpDVqLghxUwc4TO-gIaUJ6evRfnScFB-Z-6e6iewGU1su3PDKyGnHnIjUyAbHWRA986a95SpUpbj0wGQvTf17OYZPouMG8bR5JAp0hosNZex1aXQxruYOBuFqs~L1H~25qVDbmXaiaVoutvOEVe2cPoZLT4koKHh05CFw__"  className="image" />
        
          </div>
          <div className="item">
          <img  src="https://s3-alpha-sig.figma.com/img/39dd/f61b/96f0026fab686ab53df8600b1790c8ef?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=EtOhyxEO3SAlLStFBKazHYEmRl~asol1J7sv5alzgweY5SSuWlNmu6BMNbTY55taiasxTEfo~jgwShQ3dDJvhCyjwLSIxZMpvjzVCWDqapNQYnaIrtbIpWtQirUx4A2EU-UJIUjnPp6EtXeBLjFIrqrjw6vlOGoPSy6jxgEFob1C0~0qskpOwBQZL7rk6bfpKFg2SUlHvdZxeU9PBXajCKJPPxBWLVlTXdtkcjUWSOzai9kEc~hrLdn2jjlVsfoSV28yE6RB7vjkAyA~92ohuCc5iR9GHZEm8mkMsSWKzvJ0wxj-6Pyh7aVW3mQiXXRF7kCs9Ly~IAx5MxyY~YVrqQ__"  className="image" />
        </div>
        </div>
        
        <div className="flex flex-col gap-2 w-full"> 
           <div className="item">
           <img  src="https://s3-alpha-sig.figma.com/img/e3fe/522d/b04ea5843b628aa4b0ca914d6efd70b9?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=eUlK7KAoXdX6u3b4wJaduABJSbFQEz210mw13yeFESW9mbQXaOZGF8GGZ7z6R9wRgCcK7Jlz0vUjXFk83VlMehBtZqPAickbMCVVT4~JDkhr41PmOIYgDImCA6GjbHAVrMhXXbBWtiFVORcDkFZbD3eT21QPdHgczcgHBNW~kyqivqdcl268QwNCUpc2W-cSWfL7JZPaHWP6H7C~oh31o0aKGeyRP8QVOZZc~OV3Ev22ACPQX7PoknZgACWVnglvsdmLXHnSyynVVOrk4ZQN4VWKFNHph-p3hbFYU0ycLsTxC3FErbA-c7aW5W~WVEDH7EJ65wo2EV6VRGsCT0fu4w__"  className="image" />
           </div>
        <div className="item">
        <img  src="https://s3-alpha-sig.figma.com/img/4a2e/3f42/68c024c5174e53dea50f8df3baf5fc40?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=DFGxxbI4tm4VTeDSlgYrLqG46r5Mny7N9Hn-gpEdNuE4lm1OlmE9ZxD3t01pFYSRCCNhKNnuOtZYxmxkARxdoF52532D4eoPLkIr17FUYKxZ~jNuoaqK6dPWzp58p-XlQ7OxoIyXKkyOalmwjawcKHTLtYwK1ulbs2QNrUWtmJERMq81VDlDzh41ts9FSPK~ksI1iCFKSYgc3iCXN-RcRMgXyTr8MuAHkRj16AtJYR4bLmYuilMopecmoHWIibN88wGV7aDUYwUSv7j~iwaGUQKggB0SY6fONrqMUlzWlYwHLlmcZxTqRStJXYwfHq5Zv2bL56rGpAxum4lRzfrtZQ__"  className="image" />
        </div>
        <div className="item">
        <img  src="https://s3-alpha-sig.figma.com/img/05eb/16c0/f0580ad43567c2a57b01abd3808cfca4?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=KoKyZEq-h0hn1e671UD9T2B9bLJj-avI7HxqubeAj8OItX8E~K~lSscVviTaBwM33m7geu4EInoVgjkd65leW3jm-6eJVFeVsSReIy8JMDHBOqFi5NivK0Od4WiYebsYJ1UL~nZz2GmAIcVtApCn2TiRanZwCAwOoeyVezAn4QJK6mKvgdeldkM1Cj0ToEB-VssfjGe-YnZJcDwDuGeopMbHsLgCLFLKQ9KZn430NwoKOvIjUiwSjAOgtsgsv9OfnbVNHupj3e~E9nQXjgNg96oYM-091p01IFtHXo2RXNLAW0rJXu4VZ54jUW2f7Mfu2hozBThcHZurEVZgIBz8xg__"  className="image" />
        </div>
        
        
        </div>
        
         
        </div>
        <div class="flex h-[70vh]  w-full gap-3 p-2 ">
        
        <div className="flex flex-col gap-2 w-[70%]" >
          <div className="item">
          <img  src="https://s3-alpha-sig.figma.com/img/2e6b/c8e4/45406a4b562a079cf3e7d0cc91eaa540?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=HpimTgNvQzlJDvNLtOCwJFMgB0RdYmUQBlsFetHEIno9~LVWa7votNKjW-owB1-R~3J~O64U07ZF3rWLeqDgWHCqssDpvFZ8mvgirdPj3giXfJ7L92S7tgRKo~UDOVgtz24V22tHakXBKs7-U639dEwl8RK~MN7i4xwldPWoX9XkcQFoBWFX9WswMLWCGx3vO0DusVUiR7UyQZzpVwYtM0w-yutB-0CwDxxtbxyF~-wEeCHqZ8aoMlCg12EyjhcazZ-YwDkWGLcR70rE5Q7aQWlRi2buOGphGO--KliAz3jyl6DOWbhPRLO6zN4Z7Kn0bc6rEbYJ7byP2ITUhIpr7w__"  className="image" />
        
          </div>
          <div className="item">
          <img  src="https://s3-alpha-sig.figma.com/img/0e9c/bec6/1b45e2e06d6fd3959e73643715fcc498?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ED~xdqUOOQtrF~D9ZdiFREc01ynKa0P~oWVp7yOAz~KqcdVzAI8wts8unAHj~1YsQmQdgIZ08kmoasxpA5tGt699VwC30iZapKh4EKejJZInBULOuWaZFvZxbBCQTygjDIqkK4jrH0ZaSbHHubCs99Zsxec4E~J3c5Qh7VlSNf2VPAEfH4Ucm3RkWsvluNfpULNbs~1BEjZ0fXphnv6hVpuqV39e6yUMotYnb9O09Yl1eCMi7uc~URc6DKHFmHOuaS4V-M8i4aQT-jJKgV~29~SDn~4U6q4R4ssVjx1-3A3AGJ9Vj2UN9PZfiheFOWwz1IXNNryqZVNQgmgPBG4i1A__"  className="image" />
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full"> 
           <div className="item">
           <img  src="https://s3-alpha-sig.figma.com/img/968c/e8f1/7a864f79fc2c811635569cda994586e0?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=qIB5DllxfloOugc8mhy1OC0AwSds8Dx7m07tWEEplpMa6UIPT2Jaze1KeLDNLgt2fkqj~knfGptBDhkKs4U8Jv3s~nnW9ABBFKEwsmcXiJXG59FG6y1TKI005YRtLpzaJSQ~hDycWxE4iieLBneOkBBBEcdiaE3Vsnm4cssyooBgA9iyl9i3puE6pkeOxbD7UAbpAIgi77LoWcDc-WVpo91HZ3BSP-vZj8jhJ3Q9bE4rxBOqgJugc3yG9RxJC1urfjSiwVBpkwH8Krdg0xM4Cp7sebC4TLmfhfe~U6LsdHzhF72Z7KcSWPyFhqK8~~fLTZM2XCY0XC46KvBRgUWbiA__"  className="image" />
           </div>
        <div className="item">
        <img  src="    https://s3-alpha-sig.figma.com/img/a198/cead/eeba04b84e594f5b3c97cceb24f5c160?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=aYmVnPb0Zhm3I0Ek4HymOvjQNwu9Ueknxmf-K6VfU64mFG5-LmD5kcJlAT0UZa9T8dBsM8tpnPq-eYDinnsiK9DuC1TttCSoEjqEL-XAoXA4sAPBpS7zqdBs2jGzK00lvIoo~NTwaXxPIU87Xm18Riv93FPKG7EclZnQs~UCr6zlrSUk5f7frBqiMLywKOFiXOlI~j~-xGbN6hg6um3xH1Y2ImL8od0M~W6T53tXj6tLOBfM9~AbFRXzbKyUN24SdecxEwKSlWky368-EkPj9HLCKIB4Xv~PMiGsmVG9~SsKMSEdstlmTpGUqvzucf6Ve-hyTwv66QS1w8alSCqQMA__
        "  className="image" />
        </div>
        <div className="item">
        <img  src="https://s3-alpha-sig.figma.com/img/0abe/5d84/00c7f9ae5d5bd2536be6c67bf7e006ca?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=qdUUrbBLallAqVSE84cTzE4H8bzZFN04SlpDB85CddcmUo~9w4Y-Sv1uitV-V-M8TZyWVObDzpD0E56M7zFGYnh45dSFE2sKTf3P5xbkilrIrqRfdqRlcuBxOdp7ovdvyixTgvIxTNZgJs8xmH2egx~JVTJDWmPEfW88SVM6gv7v9q37UOOqe29rTr9J1hCUqN~QxwNz5ejoxm0nQYa1-kvMTibndFLEQkUHIq8TxQohYh00bGXdnZ5~7ARGTs-A5UWaA3AQMK70sa5GXaAk5hm3tkmd81uTPX16otwsKRJFgQcOePye11TiLbxYiNULKi9fNyYC94X4lvQSDCESgw__"  className="image" />
        
        </div>
        
        
        </div>
        <div className="flex flex-col gap-2 w-[70%]" >
          <div className="item">
          <img  src=" https://s3-alpha-sig.figma.com/img/7ecb/476d/0a7279122b4dee63657d3266e7c99f3c?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=lRoB3WBaf6g-Gg6Enr7NhB~9oyfNia3YwmGAoQMcdCxxqtz~YMhx74lVd27M6wOoOF4bizSyMml~pKylpAiq2F~XfxbSSrmngY8iQ7gY1-AtXT1lpQkgibgr8CVPs8dqETwjDK5EqpRg44lWD33ABTLTFj92gb50SExSxBAkfh4uArFNANpDVqLghxUwc4TO-gIaUJ6evRfnScFB-Z-6e6iewGU1su3PDKyGnHnIjUyAbHWRA986a95SpUpbj0wGQvTf17OYZPouMG8bR5JAp0hosNZex1aXQxruYOBuFqs~L1H~25qVDbmXaiaVoutvOEVe2cPoZLT4koKHh05CFw__"  className="image" />
        
          </div>
          <div className="item">
          <img  src="https://s3-alpha-sig.figma.com/img/39dd/f61b/96f0026fab686ab53df8600b1790c8ef?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=EtOhyxEO3SAlLStFBKazHYEmRl~asol1J7sv5alzgweY5SSuWlNmu6BMNbTY55taiasxTEfo~jgwShQ3dDJvhCyjwLSIxZMpvjzVCWDqapNQYnaIrtbIpWtQirUx4A2EU-UJIUjnPp6EtXeBLjFIrqrjw6vlOGoPSy6jxgEFob1C0~0qskpOwBQZL7rk6bfpKFg2SUlHvdZxeU9PBXajCKJPPxBWLVlTXdtkcjUWSOzai9kEc~hrLdn2jjlVsfoSV28yE6RB7vjkAyA~92ohuCc5iR9GHZEm8mkMsSWKzvJ0wxj-6Pyh7aVW3mQiXXRF7kCs9Ly~IAx5MxyY~YVrqQ__"  className="image" />
        </div>
        </div>
        
        <div className="flex flex-col gap-2 w-full"> 
           <div className="item">
           <img  src="https://s3-alpha-sig.figma.com/img/e3fe/522d/b04ea5843b628aa4b0ca914d6efd70b9?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=eUlK7KAoXdX6u3b4wJaduABJSbFQEz210mw13yeFESW9mbQXaOZGF8GGZ7z6R9wRgCcK7Jlz0vUjXFk83VlMehBtZqPAickbMCVVT4~JDkhr41PmOIYgDImCA6GjbHAVrMhXXbBWtiFVORcDkFZbD3eT21QPdHgczcgHBNW~kyqivqdcl268QwNCUpc2W-cSWfL7JZPaHWP6H7C~oh31o0aKGeyRP8QVOZZc~OV3Ev22ACPQX7PoknZgACWVnglvsdmLXHnSyynVVOrk4ZQN4VWKFNHph-p3hbFYU0ycLsTxC3FErbA-c7aW5W~WVEDH7EJ65wo2EV6VRGsCT0fu4w__"  className="image" />
           </div>
        <div className="item">
        <img  src="https://s3-alpha-sig.figma.com/img/4a2e/3f42/68c024c5174e53dea50f8df3baf5fc40?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=DFGxxbI4tm4VTeDSlgYrLqG46r5Mny7N9Hn-gpEdNuE4lm1OlmE9ZxD3t01pFYSRCCNhKNnuOtZYxmxkARxdoF52532D4eoPLkIr17FUYKxZ~jNuoaqK6dPWzp58p-XlQ7OxoIyXKkyOalmwjawcKHTLtYwK1ulbs2QNrUWtmJERMq81VDlDzh41ts9FSPK~ksI1iCFKSYgc3iCXN-RcRMgXyTr8MuAHkRj16AtJYR4bLmYuilMopecmoHWIibN88wGV7aDUYwUSv7j~iwaGUQKggB0SY6fONrqMUlzWlYwHLlmcZxTqRStJXYwfHq5Zv2bL56rGpAxum4lRzfrtZQ__"  className="image" />
        </div>
        <div className="item">
        <img  src="https://s3-alpha-sig.figma.com/img/05eb/16c0/f0580ad43567c2a57b01abd3808cfca4?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=KoKyZEq-h0hn1e671UD9T2B9bLJj-avI7HxqubeAj8OItX8E~K~lSscVviTaBwM33m7geu4EInoVgjkd65leW3jm-6eJVFeVsSReIy8JMDHBOqFi5NivK0Od4WiYebsYJ1UL~nZz2GmAIcVtApCn2TiRanZwCAwOoeyVezAn4QJK6mKvgdeldkM1Cj0ToEB-VssfjGe-YnZJcDwDuGeopMbHsLgCLFLKQ9KZn430NwoKOvIjUiwSjAOgtsgsv9OfnbVNHupj3e~E9nQXjgNg96oYM-091p01IFtHXo2RXNLAW0rJXu4VZ54jUW2f7Mfu2hozBThcHZurEVZgIBz8xg__"  className="image" />
        </div>
        
        
        </div>
        
         
        </div>
       
        
        </div>
      </div>
 
    </Col>
    {/* <Col span={4} className="my-3 bg-white rounded-3xl flex justify-center h-[95VH]" >

      <div className="scroll-container">
        <div className="scroll-content ">
          {[...images1, ...images1].map((img, index) => (
            <img key={index} src={img} alt={`img-${index}`} className="image" />
          ))}
        </div>
      </div>

    </Col> */}
  </Row>
  );
};

export default Plant;