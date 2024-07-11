import { Row, Col, Button, Card, Space, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { Link ,useLocation, useNavigate} from "react-router-dom";
import { AuthToken, baseURL } from "../API/API";
import axios from "axios";
import { Switch } from "antd";
import Slider from "react-slick";
import "../assets/styles/Plant.css"
import { Hourglass } from 'react-loader-spinner'


const Organisation = () => {
  const [modal2Open, setModal2Open] = useState(false);
  const [ImageFile, setImageFile] = useState(null);
  const [organization, setOrganization] = useState();
  const [loader, setLoader] = useState(true);


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

        if(res.data.results){
            setLoader(false)
        }
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
        src="https://aactxg.stripocdn.email/content/guids/CABINET_a08f84c963ba97ae8e54a37bd01dd75bb5bb673089fc68f65ed61fa0eb796f86/images/hamamsoap.png" 
        alt="" 
    />
</div>
<img 
        style={{height: '100%', width: '200px', objectFit: 'contain',objectPosition:'center'}} 
        src="https://aactxg.stripocdn.email/content/guids/CABINET_a08f84c963ba97ae8e54a37bd01dd75bb5bb673089fc68f65ed61fa0eb796f86/images/surfexcel.png" 
        alt="" 
    />
        <div  className="image_wrapper" >

        <img style={{height: '100%', width: '200px',  objectFit: 'contain',objectPosition:'center'}} src="https://aactxg.stripocdn.email/content/guids/CABINET_a08f84c963ba97ae8e54a37bd01dd75bb5bb673089fc68f65ed61fa0eb796f86/images/dovesachet.png" alt="" />        </div>
        <div  className="image_wrapper" >
        <img style={{height: '100%', width: '200px',  objectFit: 'contain',objectPosition:'center'}}src="https://aactxg.stripocdn.email/content/guids/CABINET_a08f84c963ba97ae8e54a37bd01dd75bb5bb673089fc68f65ed61fa0eb796f86/images/sunsilksaceht.png" alt="" />        </div>
        <div  className="image_wrapper" >
        <img style={{height: '100%', width: '200px',  objectFit: 'contain',objectPosition:'center'}}src="https://aactxg.stripocdn.email/content/guids/CABINET_a08f84c963ba97ae8e54a37bd01dd75bb5bb673089fc68f65ed61fa0eb796f86/images/clinicplus.png" alt="" />        </div>
  
      </Slider>
    </div>
</Col>
<Col span={14} style={{display:'flex',justifyContent:"start",background:'#dfefff',flexDirection:'column',gap:"0rem",alignItems:"center"}}>
<Row gutter={24} style={{display:'flex',justifyContent:'center',}}>
  <Col span={24} style={{display:'flex',justifyContent:'center',}}>  
  
  <img style={{width:'50%'}} src="https://eimkeia.stripocdn.email/content/guids/CABINET_8270216c780e362a1fbcd636b59c67ae376eb446dc5f95e17700b638b8c3f618/images/131321hulremovebgpreview.png" alt="" />
  </Col>
</Row>
{
  loader ?        
  <div className="" style={{height:"50vh",display:'flex',justifyContent:'center',alignItems:'center'}}>
      <Hourglass
  visible={true}
  height="40"
  width="40"
  ariaLabel="hourglass-loading"
  wrapperStyle={{}}
  wrapperClass=""
  colors={[' #293dbe', '#293dbe']}
  />
  </div>    : 
  <>
  
<Col  style={{display:'flex',justifyContent:'center'}}>

<div className="mytab-content" >
<div className="" style={{padding:'0 0.5rem',display:'flex',gap:'0.5rem',flexDirection:'column'}}>
  <h3 style={{color:'#000'}}>Plants</h3>
  <h5 >Choose Plants </h5>
  <h6 style={{borderBottom:'2px solid #2186eb',width:'125px'}} ></h6>
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
  </>
}

</Col>
<Col span={5} style={{display:'flex',justifyContent:'center'}}>
<div className="slider-container">
<Slider {...settings}>
<div className="slider-container">
      <Slider {...settings}>
      <div className="image_wrapper">
    <img 
        style={{height: '100%', width: '200px', objectFit: 'contain',objectPosition:'center'}} 
        src="https://aactxg.stripocdn.email/content/guids/CABINET_a08f84c963ba97ae8e54a37bd01dd75bb5bb673089fc68f65ed61fa0eb796f86/images/surfexcel.png" 
        alt="" 
    />
</div>
        <div  className="image_wrapper" >

        <img style={{height: '100%', width: '200px',  objectFit: 'contain',objectPosition:'center'}} src="https://aactxg.stripocdn.email/content/guids/CABINET_a08f84c963ba97ae8e54a37bd01dd75bb5bb673089fc68f65ed61fa0eb796f86/images/lifebuoy.png" alt="" />        </div>
        <div  className="image_wrapper" >
        <img style={{height: '100%', width: '200px',  objectFit: 'contain',objectPosition:'center'}}src="https://aactxg.stripocdn.email/content/guids/CABINET_a08f84c963ba97ae8e54a37bd01dd75bb5bb673089fc68f65ed61fa0eb796f86/images/comfortgreen.png" alt="" />        </div>
        <div  className="image_wrapper" >
        <img style={{height: '100%', width: '200px',  objectFit: 'contain',objectPosition:'center'}}src="https://aactxg.stripocdn.email/content/guids/CABINET_a08f84c963ba97ae8e54a37bd01dd75bb5bb673089fc68f65ed61fa0eb796f86/images/comfortpink.png" alt="" />        </div>
        <div  className="image_wrapper" >
        <img style={{height: '100%', width: '200px',  objectFit: 'contain',objectPosition:'center'}}src="https://aactxg.stripocdn.email/content/guids/CABINET_a08f84c963ba97ae8e54a37bd01dd75bb5bb673089fc68f65ed61fa0eb796f86/images/comfortblue.png" alt="" />        </div>
  
      </Slider>
    </div>
      </Slider>
    </div>
</Col>

  </Row>

    </>
  );
};

export default Organisation;