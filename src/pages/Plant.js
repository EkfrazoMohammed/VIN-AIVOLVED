import { Row, Col, Button, Card, Space, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { Link ,useLocation, useNavigate} from "react-router-dom";
import { AuthToken, baseURL } from "../API/API";
import axios from "axios";
import { Switch } from "antd";
import Slider from "react-slick";
import "../assets/styles/Plant.css"

const Organisation = () => {
  const [modal2Open, setModal2Open] = useState(false);
  const [ImageFile, setImageFile] = useState(null);
  const [organization, setOrganization] = useState();


  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
    autoplay: true,
    speed: 1500,
    autoplaySpeed: 1,
    // beforeChange: function(currentSlide, nextSlide) {
    //   console.log("before change", currentSlide, nextSlide);
    // },
    // afterChange: function(currentSlide) {
    //   console.log("after change", currentSlide);
    // }
  };

  const [error, setError] = useState({
    imageError: "",
    nameError: "",
  });
  const [formData, setFormData] = useState({
    organization_name: "",
    is_active: false,
    organization_logo: "",
  });

const navigate  = useNavigate()

  const handleImageUpload = async (e) => {
    setError((err) => ({ ...err, imageError: "" }));

    const file = await e.target.files[0];
    const image = URL.createObjectURL(file);
    setImageFile(image);
    const reader = new FileReader();

    reader.onloadend = () => {
      const data = reader.result;
      const base64String = data.split("data:image/png;base64,")[1];
      setFormData((prev) => ({ ...prev, organization_logo: base64String }));
    };

    reader.readAsDataURL(file);
  };

const location = useLocation();

useEffect(()=>{
  localStorage.setItem("componentPath",location.pathname)
},[])

  useEffect(() => {
    axios
      .get(`${baseURL}plant/`,

        {

          headers: {
     Authorization: `Bearer ${AuthToken}`,
   } 
   }
      )

      .then((res) => {
        setOrganization(res.data.results);
        console.log(res.data)
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const createOrganization = async () => {
    try {
      const res = await axios.post(`${baseURL}organization/`, formData, {
      
      });
      if(res.status == 201){
        setModal2Open(false);
          window.location.reload()
           }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSwitch = (checked) => {
    setFormData((prev) => ({ ...prev, is_active: checked }));
  };

  const handleChange = (e) => {
    setError((err) => ({ ...err, nameError: "" }));
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      organization_name: value,
    }));
  };

  const handlepost = () => {

  if(formData.organization_name === ""){
  setError((prev)=>({...prev,nameError:"Please Enter Organization namre"}))
  }else{
    setError((prev)=>({...prev,nameError:""}))

  }
  if(formData.organization_logo === ""){
    setError((prev)=>({...prev,imageError:"Please Enter Organization namre"}))
  }
  else{
    setError((prev)=>({...prev,imageError:""}))

  }
console.log(formData)
console.log(error)
if(error.imageError !== "" || error.nameError !== "" || formData.organization_name === "" || formData.organization_logo === ""){
   return
  }
else{
   createOrganization();
}

  };
 
  const handleStorage =(Plant)=>{
    localStorage.setItem("PlantData", JSON.stringify(Plant));
   
  }

  return (
    <>

  <Row gutter={24} style={{display:'flex',height:'100vh',margin:'0',padding:'0',overflow:"hidden"}}> 
<Col span={5} style={{display:'flex',justifyContent:'center',padding:"0",margin:'0'}}>
<div className="slider-container">
      <Slider {...settings}>
      <div className="image_wrapper">
    <img 
        style={{height: '100%', width: '200px', objectFit: 'contain',objectPosition:'center'}} 
        src="https://s3-alpha-sig.figma.com/img/035a/6f40/87e7613608bdc9faaca82ed31705cee8?Expires=1720396800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=kLl2A6K3K-C1K--OeA0Fo8CiKvvwGW1bZGVy3BAeIDGvp8anUkwQXor1059KqlH95gpbpGLKzCCXYJOjJ-fZeOS4TiNr74rk5z3nvnsUbHO4e3wG4PEa3g~UM1xlNlxXixkr7H65MJy2C8CHUrgBcbQms5MDI~tOzL6GwscGs8IcXu0h3d69AYsBvM-CBChYfrJsxyyf0z8uMXUIqbrkir8EBo~OIMGw5GwBYaIFfmdHhocarqD4v0KBWhlSxww3O0g6IWIZ1941qgVD1-whN5WtHDMlpo8SmsKdcanuoTnFTjoh~E5CwuBZBnVJcr1UUukkt~kIWtqPnv-BTo6kDg__" 
        alt="" 
    />
</div>
        <div  className="image_wrapper" >

        <img style={{height: '100%', width: '200px',  objectFit: 'contain',objectPosition:'center'}} src="https://s3-alpha-sig.figma.com/img/a83c/4ec6/c998364287e665a5fc0e14a8d7e311ba?Expires=1720396800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=MtrVbSh1bznKTVsb3E7pEM~XNRcAI6NSI1E5d1EAxNOzXBI1eCxQOvKs0G5xLc14k6rOfFlaHMPsqJ1OpA9R6Xlb8a6I0CwiBvf0EUviikJKEAeqnFzXSoH8cmKeOsfYKJvi4YHeLRgjbU-psjXZjw2QriIgM0CaqFKz3oh5IQWEpzdjyhd78U1ssFrYUVQjzXVopqDQwFD86yx6pHVImLYcA72U4tSTBZEXGsciOtpwa2LSO60JLnW8yMbo-am0cpMJnQnMUbA84mJBO6ZE2V3cO6eNxpgypjdtKfgh~KIM5cN7PDH~mHaev3EiFM6JyxcfhnfnlyAe8KghZuWhoA__" alt="" />        </div>
        <div  className="image_wrapper" >
        <img style={{height: '100%', width: '200px',  objectFit: 'contain',objectPosition:'center'}}src="https://s3-alpha-sig.figma.com/img/c1d7/8886/e04da020929e75872a1f0bf711a53253?Expires=1720396800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=jN5kBFbY0P6jzo88hxbZKqL3p6w4DhcGNPifoZXV-0uyxP-ACb1QwV55yadSHOpMHfQEbDmEBTfeNCYyPylP3CbQGpVFPw37EhFWHu-ZA3cyENTyiBMo40FeSYnxW7SpxJtBGzF~kkFUxY5pjRdzP6~orLTQ0R90rB745R-nDkOpWoJfPe4HKPGWyTtDVXxOAUgK~XiY~jJTXdfUwjElOPFNZMHhC2tXJn-AKCaoYAUnsvimCfNh9lMT4Z04ZPcsY2QgV4MACzyRi0AKa8KlMiwC28XJ~W7wYCEel9Z0Hty96pDFF2O55c0bGEQqp8pw-tqfST~9givVmDaThheZrA__" alt="" />        </div>
        <div  className="image_wrapper" >
        <img style={{height: '100%', width: '200px',  objectFit: 'contain',objectPosition:'center'}}src="https://eimkeia.stripocdn.email/content/guids/CABINET_8270216c780e362a1fbcd636b59c67ae376eb446dc5f95e17700b638b8c3f618/images/1311011231removebgpreview.png" alt="" />        </div>
  
      </Slider>
    </div>
</Col>
<Col span={14} style={{display:'flex',justifyContent:"start",background:'#dfefff',flexDirection:'column',gap:"2rem",alignItems:"center"}}>
<Row gutter={24} style={{display:'flex',justifyContent:'center',}}>
  <Col span={24} style={{display:'flex',justifyContent:'center',}}>  
  
  <img style={{width:'60%'}} src="https://eimkeia.stripocdn.email/content/guids/CABINET_8270216c780e362a1fbcd636b59c67ae376eb446dc5f95e17700b638b8c3f618/images/131321hulremovebgpreview.png" alt="" />
  </Col>
</Row>
<Col  style={{display:'flex',justifyContent:'center'}}>

<div className="mytab-content" >
<div className="" style={{padding:'0 0.5rem',display:'flex',gap:'0.5rem',flexDirection:'column'}}>
  <h3 style={{color:'#000'}}>Plants</h3>
  <h5 >Choose Plants </h5>
  <h6 style={{borderBottom:'2px solid #2186eb',width:'125px'}} >   </h6>
</div>
<div className="" style={{display:'flex',flexWrap:'wrap',justifyContent:'center',width:'100%',gap:'0.5rem'}}>

{organization?.map((item, index) => {
          return (
            <>
            
            <div   key={item.id} onClick={()=>{handleStorage(item);navigate('/dashboard-home')}}>
              <Card
                size="small"
                style={{
                  width: "250px",
                  display: "flex",
                  justifyContent: "center",
                  height: "200px",
                  alignItems: "center",
                  border: "none",
                  cursor:'pointer',
                  boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src='https://media.licdn.com/dms/image/C4E12AQHw3bPisn1x0g/article-inline_image-shrink_1000_1488/0/1595858405291?e=1724284800&v=beta&t=mHKkjIq_LELHb3yT9Euo1vDxlSfmjlBlZwhTZPdJsDs'
                    style={{     width: "90%",
                        height: "90%",  borderRadius: "50%", }}
                    alt=""
                  />
                </div>
                <h5 style={{ textAlign: "center" }}>
                  {item.plant_name}
                </h5>
              </Card>
            </div>
     
        
            </>
          );
        })}
</div>
</div>
</Col>

</Col>
<Col span={5} style={{display:'flex',justifyContent:'center'}}>
<div className="slider-container">
<Slider {...settings}>
<div className="slider-container">
      <Slider {...settings}>
      <div className="image_wrapper">
    <img 
        style={{height: '100%', width: '200px', objectFit: 'contain',objectPosition:'center'}} 
        src="https://eimkeia.stripocdn.email/content/guids/CABINET_8270216c780e362a1fbcd636b59c67ae376eb446dc5f95e17700b638b8c3f618/images/61qwovinplremovebgpreview_1.png" 
        alt="" 
    />
</div>
        <div  className="image_wrapper" >

        <img style={{height: '100%', width: '200px',  objectFit: 'contain',objectPosition:'center'}} src="https://s3-alpha-sig.figma.com/img/5b02/7503/aa613a0127d47c63d6c53175511462f7?Expires=1720396800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=eR1wnQGB3bs6o9AdisoXOgBOqyT2Ysy2te6LkP~~cVuEKJcm5lukiEz0NGfpZ89jAB6wXmOj6v~UkdjSzESoTQgfU-l1c5loQbLaAq33ZocYmgrsCHle3t213GFM3FRNzXr2dx4uGpphaEbXpLpqfSyvMfYKKx25CG7NaYO-1M4rhWXzaTBQn3bmy4X6F7HgxSD9jGshWVNfnEKiOlGUTI4WfnnTvCt-zb8Csz~rz-ab1JnVYr6nhUghI24o8c1Wt-ruMPe5B8y43niIsQAYGsPKt6YicIlE6teeu4TyYYOzJxOsGpFWgjYqZliPy6z7gLoGgrMmREy0vGUsPRLL0Q__" alt="" />        </div>
        <div  className="image_wrapper" >
        <img style={{height: '100%', width: '200px',  objectFit: 'contain',objectPosition:'center'}}src="https://s3-alpha-sig.figma.com/img/c1d7/8886/e04da020929e75872a1f0bf711a53253?Expires=1720396800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=jN5kBFbY0P6jzo88hxbZKqL3p6w4DhcGNPifoZXV-0uyxP-ACb1QwV55yadSHOpMHfQEbDmEBTfeNCYyPylP3CbQGpVFPw37EhFWHu-ZA3cyENTyiBMo40FeSYnxW7SpxJtBGzF~kkFUxY5pjRdzP6~orLTQ0R90rB745R-nDkOpWoJfPe4HKPGWyTtDVXxOAUgK~XiY~jJTXdfUwjElOPFNZMHhC2tXJn-AKCaoYAUnsvimCfNh9lMT4Z04ZPcsY2QgV4MACzyRi0AKa8KlMiwC28XJ~W7wYCEel9Z0Hty96pDFF2O55c0bGEQqp8pw-tqfST~9givVmDaThheZrA__" alt="" />        </div>
        <div  className="image_wrapper" >
        <img style={{height: '100%', width: '200px',  objectFit: 'contain',objectPosition:'center'}}src="https://s3-alpha-sig.figma.com/img/94f9/ffd6/ca383853a2de012239930453b2d3a4e2?Expires=1720396800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=SAflhOOKixrlJHHslTxBsffu9ce2bV6pUF78U~3v6zOcP8C3KoZpZUbt7JCHPNeMw4pF44c5Z2XzvOy44Nhn0zIwPGwMlVaoEtORJzIIz4JqC06pkz0BldO47BCL524E~fiZ~4pW9syYY1rq2hXPwSaIkK1s3XpTpGyNCaIHzaX4XStp2VZ8UVMKqddOCHsM7ZctTnK83a6tC~BQTUblJiAFEkme4irixRGSyzriXTyr986IUpHLJCzBd7uZ53SBfHNqWbrCNc8PI4nLYZ2dr0pU6U0BbcKCofk3jlBJ6abbU2OPfUSQMRuDW0Xakc6mfrVbpT7Y8Wn4Vpfb84aAUQ__" alt="" />        </div>
        <div  className="image_wrapper" >
        <img style={{height: '100%', width: '200px',  objectFit: 'contain',objectPosition:'center'}}src="https://s3-alpha-sig.figma.com/img/2af6/4532/dcef1170d1a17ec0cfdbf63308f5dd35?Expires=1720396800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=nbN6OoYwjoa94X5izZIV8XbKH~YhiO8l8Gv2OKy8Fa7VOCu-n3GLdgb866pAuK5dPmBVMUbYSlMSN6gEsGBR6mUrQM12clbdEi~zCchN~NcsLYYhp0BCWg574fDl02woRKspexMoFB09Sq0Do8Bh8Oi6i7NTS6LRLE9JNpLI38VDAoQr5lQZjeIUzvBkXCVXAt~QlWGJD35XVUTM9xyUxjqEEvMAAjy-KiQA5Y-UdceThKsJz8osTj5J3GZzwmAfYAeS~Slb~dBIOTAAenklZrv6f399ntLcXRvTiJyxlCquqLq75OYNIZ~wM7fVx1OmESs2WG1rGy7flw1tpqtAOg__" alt="" />        </div>
  
      </Slider>
    </div>
      </Slider>
    </div>
</Col>

  </Row>

{/* 
      <Row gutter={24} style={{ display: "flex", justifyContent: "center",margin:"1rem 0" }}>
        <Col span={12} style={{textAlign:'center'}}>
          <Button
            type="primary"
            style={{ width: "100%", padding: "0" }}
            danger
            onClick={() =>  { return( setModal2Open(true),navigate("/organization") )}}
          >
            Create Organization
          </Button>{" "}
         <h3 >Choose Plants</h3>
         <hr />
        </Col>
      </Row>

      <Row
        gutter={24}
        style={{
          margin: "2rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          justifyContent:'center',
          alignItems:'center',
          borderRadius:'10px',
          padding:'1rem'
        }}
      >
    
   
      </Row> */}

      {/* <Modal
        width={"400px"}
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              fontSize: "1.5rem",
            }}
          >
            Create Organization
          </div>
        }
        centered
        open={modal2Open}
        onOk={() => setModal2Open(false)}
        onCancel={() => setModal2Open(false)}
        footer={null}
      >
        <div
          className=""
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            padding: "1rem 1rem",
            alignItems: "center",
          }}
        >
          {ImageFile ? (
            <img
              src={ImageFile}
              style={{
                width: "100px",
                height: "100px",
                background: "grey",
                borderRadius: "50%",
                objectFit: "contain",
              }}
              alt=""
            />
          ) : null}
          <label>
            Upload image
            <input
              name="myImage"
              type="file"
              onChange={handleImageUpload}
              accept="image/*"
            />
          </label>
          {error.imageError ? (
            <span style={{ fontWeight: "bolder", color: "red" }}>
              *{error.imageError}
            </span>
          ) : (
            ""
          )}

          <input
            type="text"
            style={{
              height: "1.5rem",
              width: "100%",
              padding: "0.5rem",
              border: "0.5px solid grey",
              borderRadius: "5px",
              outline: "none",
            }}
            placeholder="Enter Organization Name"
            onChange={handleChange}
          />
          {error.nameError ? (
            <span
              style={{
                fontWeight: "bolder",
                color: "red",
                textAlign: "start",
                width: "100%",
              }}
            >
              *{error.nameError}
            </span>
          ) : (
            ""
          )}

          <div
            className=""
            style={{
              display: "flex",
              justifyContent: "flex-start",
              width: "100%",
            }}
          >
            <Switch onChange={handleSwitch} />
          </div>
        </div>
        <div
          className=""
          style={{ display: "flex", justifyContent: "end", gap: "1rem" }}
        >
          <Button
            type="primary"
            danger
            onClick={() => setModal2Open(false)}
            style={{ background: "transparent", color: "#000" }}
          >
            Cancel
          </Button>{" "}
          <Button type="primary" danger onClick={() => handlepost()}>
            Save
          </Button>{" "}
        </div>
      </Modal> */}
    </>
  );
};

export default Organisation;
