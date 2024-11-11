import React, { useEffect, useState } from 'react';
import { Button, Modal, Select, Table, Form, Input, ColorPicker, notification, Row, Col } from 'antd';
import axios from 'axios';
import { EditOutlined, ReloadOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
// import {API, AuthToken, baseURL, localPlantData} from "./../API/API"
import { baseURL } from "../../API/API"
import { initialDashboardData, getDefects, getMachines, getSystemStatus, getDepartments, initialDpmuData, initialProductionData, getProducts } from "../../services/dashboardApi";
import useApiInterceptor from '../../hooks/useInterceptor';
import axiosInstance from '../../API/axiosInstance';

const Defects = ({ defectsdata }) => {

  const apiCallInterceptor = useApiInterceptor();

  const localPlantData = useSelector((state) => state.plant.plantData);
  const AuthToken = useSelector((state) => state.auth.authData.access_token);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  // const reduxDefectData = data

  console.log(defectsdata)
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
      sorter: (a, b) => a.name.localeCompare(b.name),
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
        <div style={{ cursor: 'pointer' }} onClick={() => handleEdit(record)}>
          <EditOutlined />
        </div>
      ),
    },
  ];

  const handleEdit = async (record) => {
    await setEditData(record);
    await setColor(record.color_code);
    await setEditModalOpen(true);
  };

  const handleDefectChange = (value) => {
    setSelectedValue(value);
    const filteredData = tableData.filter((item) => value === item.id);
    setTableData(filteredData);
  };
  const [data, setData] = useState("")
  const handlePost = async () => {
    // const data = form.getFieldValue('name');
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
      //console.log(err);
    }
  };

  const handlePut = async () => {
    const data = form.getFieldValue('name');
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
      const url = `${baseURL}defect/${editData.id}/`;
      await axios.put(url, payload, {
        headers: {
          Authorization: `Bearer ${AuthToken}`,
        },
      });
      notificationApi.open({
        message: 'Defect updated',
        placement: 'top',
      });
      setEditModalOpen(false);
    } catch (err) {
      //console.log(err);
    }
  };

  const handleRefresh = () => {
    setTableData(defectsdata)
    setSelectedValue(null);
  };
console.log(tableData)
  return (
    <>
      {contextHolder}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', margin: '1rem 0' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Select
            showSearch
            value={selectedValue}
            style={{ width: 200, height: '40px' }}
            placeholder="Search or Select Defects"
            optionFilterProp="children"
            onChange={handleDefectChange}
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {tableData.map((defect) => (
              <Select.Option key={defect.id} value={defect.id}>
                {defect.name}
              </Select.Option>
            ))}
          </Select>
          <Button onClick={handleRefresh} className='flex items-center justify-center' style={{ background: '#EC522D', color: '#fff' }}>
            <ReloadOutlined style={{ width: '50px' }} />
          </Button>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button type="primary" style={{ background: '#EC522D', color: '#fff' }} onClick={() => setModalOpen(true)}>
            Add Defects
          </Button>
        </div>
      </div>

      <Modal
        open={modalOpen}
        title="Create Defects"
        onCancel={() => setModalOpen(false)}
        footer={[
          <Button key="cancel" type="primary" style={{ background: '#EC522D', color: '#fff' }} onClick={() => setModalOpen(false)}>
            Cancel


          </Button>,
          <Button key="submit" type="primary" style={{ background: '#EC522D', color: '#fff' }} onClick={handlePost}>
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
                  <ColorPicker value={color} onChange={(color) => setColor(color.toHexString())} showText={(color) => <span>{color.toHexString()}</span>} />

                </div>
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
          <Button key="cancel" onClick={() => { setEditModalOpen(false) }}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" style={{ background: '#EC522D', color: '#fff' }} onClick={handlePut}>
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
                <ColorPicker value={color} onChange={(color) => setColor(color.toHexString())} showText={(color) => <span>{color.toHexString()}</span>} />
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Modal>

      <Table columns={columns} dataSource={tableData} pagination={{ pageSize: 6 }} locale={{ triggerAsc: 'Click to sort in ascending order', triggerDesc: 'Click to sort in descending order', cancelSort: 'Click to cancel sorting' }} />
    </>
  );
};

export default Defects;
