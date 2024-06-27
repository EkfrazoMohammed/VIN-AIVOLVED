import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {Button, Select ,Space, Card, Col, Row ,Typography} from 'antd';
import "../index.css"
import {RightOutlined ,LeftOutlined} from '@ant-design/icons';
import { AuthToken,baseURL } from "../API/API";
const { Title } = Typography;

const Camera = () => {
  const localItems = localStorage.getItem("PlantData")
  const localPlantData = JSON.parse(localItems) 

    const [camera, setCamera]= useState()
    console.log(camera)

    // const data = Array(12).fill({
    //   title: "Machine 1",
    //   cameras: ["Camera 1", "Camera 2"]
    // });


    const getMachines = () => {
      const domain = `${baseURL}`;
      let url = `${domain}machine/?plant_name=${localPlantData.plant_name}`;
      axios.get(url,{
        headers:{
          'Authorization': `Bearer ${AuthToken}`
        }
      })
        .then(response => {
          console.log(response)
          const formattedMachines = response.data.results.map(machine => ({
            id: machine.id,
            name: machine.name,
          }));
          console.log(formattedMachines)
          setCamera(formattedMachines);
        })
        .catch(error => {
          console.error('Error fetching machine data:', error);
        });
    };

    useEffect(()=>{
      getMachines()
    },[])
console.log(camera)
  return (
    <div className="">

<Select

placeholder="Select Camera"
      // defaultValue="Camera 1"
      size="large"
      style={{ width: 200 }}
    >

{
  camera?.map(machine => (
    <Select.Option>{machine.name}</Select.Option>))
}

    </Select>
    <Button type="primary" style={{fontSize:"1rem",backgroundColor:"#ec522d",margin:"1rem",display:'inline-flex',justifyContent:'center',alignItems:'center'}} ><RightOutlined /></Button>


    <div className="flex">
    <Space direction="vertical" size={16}>
    <Row  style={{}}>
    <Col style={{width:'100%',display:'flex',flexWrap:'wrap',gap:'1rem'}}>
 
    {camera?.map((item, index) => (
        <Card
          key={index}
          title={<Title level={2} style={{ fontWeight: '700' }}>{item.name}</Title>}
          bordered={false}
          style={{ width: 300, display: "flex", flexDirection: "column", gap: "1rem", alignItems: 'center', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', fontSize: "2rem" }}
        >
          <Row style={{ display: 'flex', gap: '1rem', justifyContent: 'space-around' }}>
              <div
                key={index}
                className=""
                style={{ width: '100px', background: '#fff', height: '50px', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',cursor:'pointer' }}
              >
                <h6>Camera {index + 1}</h6>
              </div>
          
          </Row>
        </Card>
      ))}

    </Col>
    {/* <Col span={8}>
      <Card title="Card title" bordered={false}>
        Card content
      </Card>
    </Col> */}
  </Row>
    
  </Space>
    </div> 

    </div>
);}

export default Camera;
