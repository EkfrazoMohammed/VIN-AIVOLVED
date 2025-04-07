import React, { useEffect, useState } from 'react';
import { Button, Modal, Select, Table, Form, Input, notification, Row, Col ,ConfigProvider } from 'antd';
import axios from 'axios';
import { EditOutlined, ReloadOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { baseURL } from "../../API/API"
import {  getDefects, } from "../../services/dashboardApi";
import useApiInterceptor from '../../hooks/useInterceptor';
import axiosInstance from '../../API/axiosInstance';
import PropTypes from 'prop-types';
import ColorPickerComponent from '../../components/common/ColorPickerComponent';
import SelectComponent from '../../components/common/Select';


const Defects = ({ defectsdata }) => {

  const apiCallInterceptor = useApiInterceptor();

  const localPlantData = useSelector((state) => state.plant.plantData);
  const AuthToken = useSelector((state) => state.auth.authData.access_token);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const [tableData, setTableData] = useState(defectsdata);
  const [selectedValue, setSelectedValue] = useState(null);
  const [color, setColor] = useState('#1677ff');
  const [form] = Form.useForm();
  const [notificationApi, contextHolder] = notification.useNotification();

  useEffect(() => {
    getDefects(localPlantData?.plant_name, AuthToken, apiCallInterceptor)
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (text) => <div>{text}</div>,
    },
    {
      title: 'Defect Name',
      dataIndex: 'name',
      render: (text) => <div>{text}</div>,
    },
    {
      title: 'Color',
      dataIndex: 'color_code',
      render: (col) => (
        <div style={{ height: '40px', width: '40px', borderRadius: '20px', background: col }}></div>
      ),
    },
    {
      title: 'Color Code',
      dataIndex: 'color_code',
    },
    {
      title: 'Edit',
      render: (record) => (
        <button  style={{ cursor: 'pointer' }} onClick={() => handleEdit(record)}>
          <EditOutlined />
        </button>
      ),
    },
  ];

  const handleEdit = async (record) => {
     setEditData(record);
     setColor(record.color_code);
     setEditModalOpen(true);
  };

  const handleDefectChange = (value) => {
    if(value == null){
     return setTableData(defectsdata)
    }
    setSelectedValue(value);
    const filteredData = defectsdata.filter((item) => value === item.id);
    
    setTableData(filteredData);
 
  };
  const [data, setData] = useState("")
  const handlePost = async () => {
    if (!data) {
      notificationApi.open({
        message: 'Please fill out required fields',
        placement: 'top',
      });
      return;
    }

    const payload = {
      name: data,
      color_code: color,
      plant: localPlantData.id,
    };

    try {
      const url = `defect/`;
      await axiosInstance.post(url, payload, {
        headers: {
          Authorization: `Bearer ${AuthToken}`,
        },
      });
      notificationApi.open({
        message: 'Defect created',
        placement: 'top',
      });

      setModalOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handlePut = async () => {
    const data = form.getFieldValue('name');
    // if (!data) {
    //   notificationApi.open({
    //     message: 'Please fill out required fields',
    //     placement: 'top',
    //   });
    //   return;
    // }

    const payload = {
      name: data,
      color_code: color,
      plant: localPlantData.id,
    };

    // try {
    //   const url = `${baseURL}defect/${editData.id}/`;
    //   await axios.put(url, payload, {
    //     headers: {
    //       Authorization: `Bearer ${AuthToken}`,
    //     },
    //   });
    //   notificationApi.open({
    //     message: 'Defect updated',
    //     placement: 'top',
    //   });
    //   setEditModalOpen(false);
    // } catch (err) {
    //   console.log(err);
    // }
  };

  const handleRefresh = () => {
    setTableData(defectsdata)
    setSelectedValue(null);
  };
  return (
    <>
      {contextHolder}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', margin: '1rem 0' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
        <SelectComponent placeholder={"Select Defects"} selectedData={selectedValue}  action={(val) => handleDefectChange(val)} data={defectsdata} style={{ minWidth: "200px", zIndex: 1 }} size={"large"} />

          <Button onClick={handleRefresh} className='commButton flex items-center justify-center' style={{ background: '#EC522D', color: '#fff' }}>
            <ReloadOutlined style={{ width: '50px' }} />
          </Button>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button className='commButton' style={{ color: '#fff' }} onClick={() => setModalOpen(true)}>
            Add Defects
          </Button>
        </div>
      </div>

      <Modal
        open={modalOpen}
        title="Create Defects"
        onCancel={() => setModalOpen(false)}
        footer={[
          <Button  className='commButton border-0' type="primary" style={{  color: '#fff' }} onClick={() => setModalOpen(false)}>
            Cancel


          </Button>,
          <Button yy className='commButton border-0' type="primary" style={{  color: '#fff' }} onClick={handlePost}>
            Create Defects
          </Button>,
        ]}
      >
        <Row gutter={24} style={{ margin: '1rem', display: 'flex', flexDirection: 'column' }}>
          <Col style={{ margin: '1rem' }}>
            <Form form={form} size="large" layout="vertical">
              <Form.Item name="name" rules={[{ required: true, message: 'Please enter defect name *' }]}>
                <h6>Defects Name <span style={{ fontWeight: '600', color: 'red' }}>*</span></h6>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <Input placeholder="Enter Defect Name" name="name" onChange={(e) => { setData(e.target.value) }} />
                </div>
              </Form.Item>

              <Form.Item rules={[{ required: true, message: 'Please enter color code *' }]}>
                <h6>Select Color <span style={{ fontWeight: '600', color: 'red' }}>*</span></h6>
                <div style={{ display: "flex", gap: "1rem" }}>
                <ColorPickerComponent
        value={color}
        onChange={ setColor}
        showText={color}
      />                </div>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Modal>

      <Modal
        open={editModalOpen}
        title="Edit Defect"
        onCancel={() => setEditModalOpen(false)}
        footer={[
          <Button className='commButton border-0' key="cancel" onClick={() => { setEditModalOpen(false) }}>
            Cancel
          </Button>,
          <Button className='commButton border-0' key="submit"   onClick={handlePut}>
            Edit Defect
          </Button>,
        ]}
      >
        <Row gutter={24} style={{ margin: '1rem', display: 'flex', flexDirection: 'column' }}>
          <Col style={{ margin: '1rem' }}>
            <Form form={form} size="large" layout="vertical" >
              <Form.Item name="name" label="Defects Name" rules={[{ required: true, message: 'Please enter defect name' }]}>
                <Input placeholder="Enter Defect Name" value={editData?.name} />
                <input type="text" value={editData?.name} style={{ display: 'none' }} />
              </Form.Item>
              <Form.Item label="Select Color">
              <ColorPickerComponent
        value={color}
        onChange={ setColor}
        showText={color}
      />              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Modal>
        <ConfigProvider
          theme={{
            components: {
              Table: {
                colorBgContainer: '#fff',
                colorPrimary: '#000',
                colorFillAlter: '#fff',
                controlHeight: 48,
                headerBg: '#43996a',
                headerColor: '#fff',
                rowHoverBg: '#e6f7ff',
                padding: '1rem',
                boxShadowSecondary:
                  '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
                fontWeightStrong: 500,
              },
            },
          }}
        >
      <Table className='custom-table' columns={columns} dataSource={tableData} pagination={{ pageSize: 6 }} locale={{ triggerAsc: 'Click to sort in ascending order', triggerDesc: 'Click to sort in descending order', cancelSort: 'Click to cancel sorting' }} />
        </ConfigProvider>
    </>
  );
};
Defects.propTypes= {
  defectsdata:PropTypes.any
}
export default Defects;
