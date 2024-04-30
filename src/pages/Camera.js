import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {Button, Select ,Space, Card, Col, Row ,Typography} from 'antd';
import "../index.css"
const { Title } = Typography;
const Camera = () => {

    const [camera, setCamera]= useState({
        "camera1":{
            "a":'a',
            "b":'b'
        }
    })

    const data = Array(12).fill({
      title: "Machine 1",
      cameras: ["Camera 1", "Camera 2"]
    });

  return (
    <div className="">

<Select

placeholder="Select Camera"
      // defaultValue="Camera 1"
      size="large"
      style={{ width: 200 }}
      options={[{ value: 'camera1', label: 'camera1' },{ value: 'camera2', label: 'camera2' }]}
    />
    <Button type="primary" style={{fontSize:"1rem",backgroundColor:"#ec522d",margin:"1rem"}} >></Button>


    <div className="flex">
    <Space direction="vertical" size={16}>
    <Row  style={{}}>
    <Col style={{width:'100%',display:'flex',flexWrap:'wrap',gap:'2rem'}}>
 
    {data.map((item, index) => (
        <Card
          key={index}
          title={<Title level={2} style={{ fontWeight: '700' }}>{item.title}</Title>}
          bordered={false}
          style={{ width: 300, display: "flex", flexDirection: "column", gap: "1rem", alignItems: 'center', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', fontSize: "2rem" }}
        >
          <Row style={{ display: 'flex', gap: '1rem', justifyContent: 'space-around' }}>
            {item.cameras.map((camera, cameraIndex) => (
              <div
                key={cameraIndex}
                className=""
                style={{ width: '100px', background: '#fff', height: '50px', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',cursor:'pointer' }}
              >
                <h6>{camera}</h6>
              </div>
            ))}
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
