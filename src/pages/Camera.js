import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {Button, Select ,Space, Card, Col, Row } from 'antd';
import "../index.css"

const Camera = () => {

    const [camera, setCamera]= useState({
        "camera1":{
            "a":'a',
            "b":'b'
        }
    })

  return (
    <div className="">

<Select

placeholder="Select Camera"
      defaultValue="Camera 1"
      size="large"
      style={{ width: 200 }}
      options={[{ value: 'camera1', label: 'camera1' },{ value: 'camera2', label: 'camera2' }]}
    />
    <Button type="primary" style={{fontSize:"1rem",backgroundColor:"#ec522d",margin:"1rem"}} >></Button>

{/* 
    <div className="flex">
    <Space direction="vertical" size={16}>
    <Row gutter={16}>
    <Col span={16}>
      <Card title="Card title" bordered={false} style={{width:500,display:"flex",flexDirection:"column",gap:"1rem"}}>
      <Card title="Card title" bordered={false} style={{width:200}}>
        Card content
      </Card>
      <Card title="Card title" bordered={false} style={{width:200}}>
        Card content
      </Card>
      </Card>
    </Col>
    <Col span={8}>
      <Card title="Card title" bordered={false}>
        Card content
      </Card>
    </Col>
  </Row>
    
  </Space>
    </div> */}

    </div>
);}

export default Camera;
