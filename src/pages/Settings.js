import React from 'react';
import {Button, Select ,Space, Card, Col, Row ,Typography} from 'antd';


const Settings = () => {
  return (
<>
<Row gutter={24} style={{display:'flex',justifyContent:'space-between'}}>
<Col span={9} > 
<h4>User Creation</h4>
</Col>
<Col span={3}  >
<Button type="primary" style={{width:'90%'}} danger>
User Creation
    </Button>   </Col>
</Row>
<Row gutter={24} style={{display:'flex',flexDirection:'column',gap:'2rem',margin:'2rem'}} >
  <Col span={16} style={{display:'flex',justifyContent:'space-between'}}>
<div className="">
  <h6>Email Id</h6>
  <h6>developer@mail.com</h6>
</div>
<div className="">
<h6>Mobile Number</h6>
  <h6>987654310</h6>
</div>
<div className="">
<h6>Password</h6>
  <h6>12345</h6>
</div>
  </Col>
  <Col span={9}><h4>Users</h4></Col>
  <Col span={16} style={{display:'flex',justifyContent:'space-between'}}>
  <div className="">
  <h6>Email Id</h6>
  <h6>developer@mail.com</h6>
</div>
<div className="">
<h6>Mobile Number</h6>
  <h6>987654310</h6>
</div>
<div className="">
<h6>Password</h6>
  <h6>12345</h6>
</div>
  </Col>
</Row>

</>
  )
}

export default Settings