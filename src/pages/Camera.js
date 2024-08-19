import React, { useState, useEffect, useRef } from "react";
import { Button, Select, Space, Card, Col, Row, Typography } from 'antd';
import "../index.css"
import { useSelector } from "react-redux";
import { Puff } from "react-loader-spinner"
const { Title } = Typography;
const Camera = () => {
  const camera = useSelector((state) => state.machine.activeMachines);

  return (
    <div className="">
      <div className="flex">
        <Space direction="vertical" size={16}>
          <Row style={{}}>
            <Col style={{ width: '100%', display: 'flex', flexWrap: 'wrap', gap: '3rem' }}>
              {camera?.map((item, index) => (
                <Card
                  key={index}
                  bordered={false}
                  style={{
                    width: 300, display: "flex", flexDirection: "column", alignItems: 'center', fontSize: "2rem", padding: '0', boxShadow: item.system_status
                      ? "green 0px 25px 50px -12px"
                      : " #b30d0d 0px 25px 50px -12px",
                  }}
                >
                  <Row style={{ display: 'flex', gap: '1rem', justifyContent: 'space-around', flexDirection: 'column', width: '300px', alignItems: "center" }}>
                    <div className="" style={{ fontWeight: '700', fontSize: '2rem' }}>{item.machine_name}</div>
                    <div
                      key={index}
                      className=""
                      style={{ width: '200px', height: '50px', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', cursor: 'pointer', fontWeight: '700', fontSize: '1.2rem', background: item.system_status ? "green" : "#b30d0d", color: "#fff" }}
                    >
                      {item.system_status ? "Active" : "Inactive"}
                    </div>
                    {
                      item.system_status ?
                        <Puff
                          visible={true}
                          height="80"
                          width="80"
                          color="#4fa94d"
                          ariaLabel="puff-loading"
                          wrapperStyle={{}}
                          wrapperClass=""
                        /> : null
                    }

                  </Row>
                </Card>
              ))}

            </Col>
          </Row>
        </Space>
      </div>
    </div>
  );
}

export default Camera;
