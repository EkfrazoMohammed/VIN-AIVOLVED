import { Row, Col, Button, Card, Space, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { Link ,useLocation, useNavigate} from "react-router-dom";
import { AuthToken, baseURL } from "../API/API";
import axios from "axios";
import { Switch } from "antd";

const Organisation = () => {
  const [modal2Open, setModal2Open] = useState(false);
  const [ImageFile, setImageFile] = useState(null);
  const [organization, setOrganization] = useState();

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
      <Row gutter={24} style={{ display: "flex", justifyContent: "center",margin:"1rem 0" }}>
        <Col span={12} style={{textAlign:'center'}}>
          {/* <Button
            type="primary"
            style={{ width: "100%", padding: "0" }}
            danger
            onClick={() =>  { return( setModal2Open(true),navigate("/organization") )}}
          >
            Create Organization
          </Button>{" "} */}
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
    
        {organization?.map((item, index) => {
          return (
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
          );
        })}
      </Row>

      <Modal
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
      </Modal>
    </>
  );
};

export default Organisation;
