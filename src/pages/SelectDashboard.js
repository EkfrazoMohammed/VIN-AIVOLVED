import { Row, Col, Button, Card, Space, Modal } from "antd";
import React, { useState, Link, useEffect } from "react";
// import Person from ".././assets/images/person.png";
// import Download from ".././assets/images/material.png";
import { DownloadOutlined } from "@ant-design/icons";
import axios from "axios";
import { baseURL } from "../API/API";
import { useParams } from "react-router-dom";

const Select_dashboard = () => {
  const {id} = useParams()
  const numId = id.replace(/\D/g, '');
  const [modal2Open, setModal2Open] = useState(false);
  const [ImageFile, setImageFile] = useState(null);
  const [dataplant, setDataPlant] = useState(null);
  const [dataOrg, setDataOrg] = useState(null);
  let parsedLocaldata;

useEffect(()=>{
  const localData = localStorage.getItem("dataOrgPlant");
   parsedLocaldata=  JSON.parse(localData);
},[])


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const image = URL.createObjectURL(file);
    setImageFile(image);
  };
  let token;
  useEffect(()=>{
    const localToken =  localStorage.getItem("token")
    token = JSON.parse(localToken)

  })
useEffect(()=>{
  // axios.get(`${BASEURL}plant/${parsedLocaldata.pID}`,{
  //   headers:{
  //     Authorization:`Bearer ${token}`
  //   }
  // })
  axios.get(`http://159.65.157.118:8001/api/plant/${parsedLocaldata.pID}`,   {

    headers: {
Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE4NTE2OTUzLCJpYXQiOjE3MTgwODQ5NTMsImp0aSI6IjFmZjY5NzdhZTc3NzQzZmM4NjAyNGY0YzI0ZDJjOTZmIiwidXNlcl9pZCI6MTR9.pz_-fAeda7ANIzHeOWgDSvcXF6Q1T9I1K997f5aAM9E`,
} 
})
  .then((res)=>{
    setDataPlant([res.data])
  })
  .then(err=>console.log(err))
},[])

useEffect(()=>{
  // axios.get(`${BASEURL}organization/${parsedLocaldata.oID}`,{
  //   headers:{
  //     Authorization:token
  //   }
  // })
  axios.get(`http://159.65.157.118:8001/api/organization/${parsedLocaldata.oID}`,{
    headers:{
      Authorization:token
    }
  })
  .then((res)=>{
    setDataOrg([res.data.results])
  })
  .then(err=>console.log(err))
},[])
console.log(dataOrg)
  return (
    <>
      <Row style={{ display: "flex", gap: "1rem" }}>
     {
dataOrg?.map((val,index)=>{
return (


        <Card
     
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
              background:'rgb(0 0 0 / 4%)',              display: "flex",
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
        {
dataplant?.map((val,index)=>{
return (
        <Card
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
              background:'rgb(0 0 0 / 4%)',              display: "flex",
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
          </div>{" "}
          <h3>{val.plant_name}</h3>
        </Card>)
})
        }
      </Row>

      <Row
        gutter={24}
        style={{
          margin: "1rem 0",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          border: "1px solid grey",
          height: "400px",
          borderRadius: "10px",
        }}
      >
        <h2>What is this dashboard for?</h2>
        <div className="" style={{ display: "flex", gap: "1rem" }}>
          <div
            className="organization_tab"
            size="small"
            style={{
              width: "200px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100px",
              boxShadow: "none",
              border: "1px solid #0000004a",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            {/* <img src={Person} alt="error" /> */}
            <span style={{ fontWeight: "550" }}>Human Detection</span>
          </div>
          <div
            className="organization_tab"
            size="small"
            style={{
              width: "200px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100px",
              boxShadow: "none",
              border: "1px solid #0000004a",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            {/* <img src={Download} alt="error" /> */}
            <span style={{ fontWeight: "550" }}>Object Detection</span>
          </div>
        </div>
      </Row>
    </>
  );
};

export default Select_dashboard;
