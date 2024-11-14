
import { useState, useEffect } from "react";
import {
  Row,
  Col,

  Button,


  notification,
Modal} from "antd";



import {  useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";


const Clock=()=>{
  const [date, setDate] = useState(new Date());
  function refreshClock() {
    setDate(new Date());
  }
  useEffect(() => {
    const timerId = setInterval(refreshClock, 1000);
    return function cleanup() {
      clearInterval(timerId);
    };
  }, []);
  return (
    <span >
      {date.toLocaleTimeString()}
    </span>
  );
}
const DateContainer=()=>{
  const date = new Date().toLocaleDateString();
  return(<>
  {date}

  </>)
}
function Header({

  subName,

}) {
  const navigate = useNavigate()

const localPlantData = useSelector((state) => state.plant.plantData[0]);
const PlantName =localPlantData.plant_name ;




  const [modal1Open, setModal1Open] = useState(false);


  useEffect(() => window.scrollTo(0, 0));



  const [api, contextHolder] = notification.useNotification();
  const openNotification = () => {
    api.success({
      message:<div style={{fontWeight:"600",fontSize:"1.1rem"}}>Logout Successful</div> ,
   
    });
  };



  
  const handleLogout  = async ()=>{
      setModal1Open(false)
     openNotification()
       navigate('/login');
     await logout()
      localStorage.clear();

  }
  return (
    <>
    {contextHolder}
      <Modal
        title={<div style={{textAlign:'center',padding:'1rem 0',fontWeight:'600',fontSize:'1.2rem'}}>Are You Sure You Want To Logout?</div>}
        style={{
          top: 20,
        }}
        open={modal1Open}
        onCancel={() => setModal1Open(false)}
        footer={null}
      >
        <div className="" style={{display:'flex',justifyContent:'center'}}>
        <Button onClick={handleLogout} style={{background:'orangeRed',color:'#fff'}}>LOGOUT</Button>
        </div>
      </Modal>

      <Row gutter={[24, 0]}>
      <Col span={12}>
      <div  className="" style={{padding:"0.5rem 2rem", borderRadius:'10px',background:'#fafafa',    boxShadow: '0 20px 27px rgb(0 0 0 / 5%)',width:"100%",textAlign:"center",color:'#000',fontWeight:'600',fontSize:'1.6rem',maxWidth:"350px"}}>
    
         {PlantName.plant_name}
        </div>
      </Col>
        <Col span={12}  style={{display:'flex',justifyContent:'end'}}>
        
        <button  onClick={()=>setModal1Open(true)} className="" style={{padding:"0.5rem 2rem", borderRadius:'10px',cursor:'pointer',background:'#fafafa',boxShadow:'rgba(0, 0, 0, 0.1) 0px 2px 4px',border:'0.5px solid #8080806e',display:'flex',justifyContent:'center',alignItems:'center'}}>
        <img src="https://w7.pngwing.com/pngs/253/714/png-transparent-logout-heroicons-ui-icon-thumbnail.png" style={{height:'30px',width:'30px'}} alt="" />

         <span style={{color:"#000",fontWeight:'700'}}> Logout</span>
        </button>
        </Col>
            
      </Row>
      <Row gutter={[24, 0]} style={{marginTop:'2rem'}}>
        <Col span={24} md={6} style={{display:'flex',alignItems:'center'}}>
 
          <div className="ant-page-header-heading">
            <span
              className="ant-page-header-heading-title"
              style={{ textTransform:'capitalize',fontSize:'1.4rem' }}
            >
              {subName.replace("/", "")}
            </span>
          </div>
        </Col>
        <Col span={24} md={18} className="header-control"  >
          <div className="" style={{display:"flex",gap:"2rem", fontSize:"1rem",fontWeight:"500",}}> 
          <div className="" style={{padding:'0.1rem 1rem',display:"flex",gap:"2rem", fontSize:"1rem",fontWeight:"500",border:'0.5px solid #c6c6c6',alignItems:'center',justifyContent:'center',borderRadius:'10px'}}>
          <DateContainer/>
          <Clock />
          </div>
          <div className="" style={{height:"50px",width:'50px',border:'0.5px solid #c6c6c6',borderRadius:'50%'}}>
            <img src="https://xtemko.stripocdn.email/content/guids/CABINET_d8f211887c57378d14d80cfb73c09f4b2db394a5cf71f6e0cdda10e02f8c454f/images/vin_logo.jpeg" alt="" width={100} style={{padding:'0.5rem'}} />
          </div>
          </div>
  
    
  
        </Col> 
      </Row>
    </>
  );
}
Header.propTypes = {
subName:PropTypes.any
};

export default Header;
