import { Row, Col, Button, Card, Space, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { Link ,useLocation, useNavigation} from "react-router-dom";
import { baseURL } from "../API/API";
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

const navigate  = useNavigation()

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
     Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE5MjA1NjMzLCJpYXQiOjE3MTg3NzM2MzMsImp0aSI6IjI1NTQ2ZTQ1OWM2MDRhOWRiMTNjM2IwNDFjNjZlZjRjIiwidXNlcl9pZCI6Mn0.68CBeuBUsQRYWDD0FVLoekKWRy_iO_g8sBoGLXrj0J0`,
   } 
   }
      )

      .then((res) => {
        setOrganization(res.data.results);
       })
      .catch((err) => {
        //console.log(err);
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
      //console.log(error);
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
if(error.imageError !== "" || error.nameError !== "" || formData.organization_name === "" || formData.organization_logo === ""){
   return
  }
else{
   createOrganization();
}

  };
 
  const handleStorage =(id)=>{
    const organizationAndplant = {"pID":null,"oID":id}
    localStorage.setItem("dataOrgPlant", JSON.stringify(organizationAndplant));
   
  }

  return (
    <>
      <Row gutter={24} style={{ display: "flex", justifyContent: "end" }}>
        <Col span={3}>
          <Button
            type="primary"
            style={{ width: "100%", padding: "0" }}
            danger
            onClick={() =>  { return( setModal2Open(true),navigate("/organization") )}}
          >
            Create Organization
          </Button>{" "}
        </Col>
      </Row>

      <Row
        gutter={24}
        style={{
          margin: "2rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        {organization?.map((item, index) => {
          return (
            <Link to={`/Plants/${item.id}`} key={item.id} onClick={()=>handleStorage(item.id)}>
              <Card
                size="small"
                style={{
                  width: "250px",
                  display: "flex",
                  justifyContent: "center",
                  height: "200px",
                  alignItems: "center",
                  boxShadow: "none",
                  border: "1px solid #0000004a",
                }}
              >
                <div
                  style={{
                    width: "100px",
                    height: "100px",
                    background: "rgb(0 0 0 / 4%)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "50%",
                  }}
                >
                  <img
                    src={item.organization_logo}
                    style={{ width: "60%" }}
                    alt=""
                  />
                </div>
                <h3 style={{ textAlign: "center" }}>
                  {item.organization_name}
                </h3>
              </Card>
            </Link>
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
