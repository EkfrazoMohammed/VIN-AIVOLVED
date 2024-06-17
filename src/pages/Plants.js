import { Row, Col, Button, Card, Space, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useParams,useLocation } from "react-router-dom";
import { baseURL } from "../API/API";
import axios from "axios";
import { Switch } from "antd";

const Plants = () => {
  const [modal2Open, setModal2Open] = useState(false);
  const [ImageFile, setImageFile] = useState(null);
  const [plants, setPlants] = useState([]);
  const [organization, setOrganization] = useState();

  const [error, setError] = useState({
    nameError: "",
  });
 
  const localData = localStorage.getItem("dataOrgPlant");
  const parsedLocaldata=  JSON.parse(localData);


  const [formData, setFormData] = useState({
    plant_name: "",
    is_active: false,
    organization_name:parsedLocaldata?.oID
  });

console.log(parsedLocaldata)
  const { id } = useParams();
  const numberID = id.replace(/\D/g, '');

  useEffect(()=>{
    localStorage.setItem("componentPath",location.pathname)
  },[])

  useEffect(() => {
    axios
      .get(`http://159.65.157.118:8001/api/plant/?organization_id=${id}`,
        {

               headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE4NTE2OTUzLCJpYXQiOjE3MTgwODQ5NTMsImp0aSI6IjFmZjY5NzdhZTc3NzQzZmM4NjAyNGY0YzI0ZDJjOTZmIiwidXNlcl9pZCI6MTR9.pz_-fAeda7ANIzHeOWgDSvcXF6Q1T9I1K997f5aAM9E`,
        } 
        }
     )
      .then((res) => {
        setPlants(res.data.results);
        console.log(res)
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(()=>{
    axios
    // .get(`${baseURL}organization/${numberID}`, {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // })
    

    .get(`http://159.65.157.118:8001/api/organization/${numberID}`, {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        })
    .then((res) => {
      setOrganization([res.data.results]);
    })
    .catch((err) => console.log(err));
  },[]);

  const location = useLocation();

  // const handleImageUpload = (e) => {
  //   const file = e.target.files[0];
  //   const image = URL.createObjectURL(file);
  //   setImageFile(image);
  // };
  console.log(id)

  const createPlant = async () => {
    try {
      const res = await axios.post(`${baseURL}plant/`,formData,  {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
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
      plant_name: value,
    }));
    // setFormData((prev)=>({...prev,"organization_name":organization[0]?.organization_name}))

  };

  const handlepPost = () => {

  if(formData.plant_name === ""){
  setError((prev)=>({...prev,nameError:"Please Enter Plant name"}))
  }else{
    setError((prev)=>({...prev,nameError:""}))

  }

console.log(formData)
console.log(error)
if( error.nameError !== "" || formData.plant_name === ""){
   return
  }
else{
  createPlant();
}

  };
  const handleStorage =(id)=>{
    const organizationAndplant = {"pID":id,"oID": organization[0].id}
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
            onClick={() => setModal2Open(true)}
          >
            Create Plants
          </Button>{" "}
        </Col>
      </Row>
      <Row>
        {
          organization?.map((val,index)=>{
            return(
        <Card
        key={val.id}
          size="small"
          style={{
            width: "400px",
            display: "flex",
            justifyContent: "center",
            height: "200px",
            alignItems: "center",
            boxShadow: "none",
            border: "1px solid #0000004a",
          }}
        >
          <div
            className=""
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
              src={val.organization_logo}
              style={{ width: "60%" }}
              alt=""
            />
          </div>{" "}
          <h3>{val.organization_name}</h3>
        </Card>
            )
          })
        }
      </Row>

      <Row
        gutter={24}
        style={{
          margin: "1rem 0",
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        {plants?.map((item, index) => (
          <Link to={`/Organization-Dashboard/${item.id}`} onClick={()=>handleStorage(item.id)}>
            <Card
              key={index}
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
                className=""
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
                  src="https://aivolved.in/wp-content/uploads/2022/11/ai-logo.png"
                  style={{ width: "60%" }}
                  alt=""
                />
              </div>
              <h3 style={{ textAlign: "center" }}>{item.plant_name}</h3>
            </Card>
          </Link>
        ))}
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
            Create Plants
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
          {/* {ImageFile ? (
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
          )} */}

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
            placeholder="Enter Plant Name"
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
          <Button type="primary" danger onClick={() => handlepPost()}>
            Save
          </Button>{" "}
        </div>
      </Modal>
    </>
  );
};

export default Plants;
