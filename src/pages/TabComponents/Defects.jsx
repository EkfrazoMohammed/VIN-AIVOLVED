import React, { useEffect, useState } from 'react';
import { Button, Modal, Select, Table, Form, Input, ColorPicker, notification, Row, Col } from 'antd';
import axios from 'axios';
import { EditOutlined, ReloadOutlined } from '@ant-design/icons';
import { baseURL, AuthToken } from '../../API/API';

const Defects = () => {
  const localItems = localStorage.getItem('PlantData');
  const localPlantData = JSON.parse(localItems);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [color, setColor] = useState('#1677ff');
  const [form] = Form.useForm();
  const [notificationApi, contextHolder] = notification.useNotification();

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Defect Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <a>{text}</a>,
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

  const handleEdit = (record) => {
    setEditData(record);
    setColor(record.color_code);
    setEditModalOpen(true);
  };

  const fetchData = async () => {
    const url = `${baseURL}defect/?plant_name=${localPlantData.plant_name}`;
    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${AuthToken}`,
        },
      });
      setTableData(res.data.results);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDefectChange = (value) => {
    setSelectedValue(value);
    const filteredData = tableData.filter((item) => value === item.id);
    setTableData(filteredData);
  };
  const [data, setData] = useState("")
  console.log(data)
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
      const url = `${baseURL}defect/`;
      await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${AuthToken}`,
        },
      });
      notificationApi.open({
        message: 'Defect created',
        placement: 'top',
      });
      fetchData();
      setModalOpen(false);
    } catch (err) {
      console.log(err);
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
      fetchData();
      setEditModalOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleRefresh = () => {
    setSelectedValue(null);
    fetchData();
  };

  return (
    <>
      {contextHolder}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', margin: '1rem 0' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Select
            showSearch
            value={selectedValue}
            style={{ width: 200, height: '40px' }}
            placeholder="Search to Select Defects"
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
          <Button onClick={handleRefresh} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
          <Button key="cancel" onClick={() => setModalOpen(false)}>
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
              <Form.Item name="name" rules={[{ required: true, message: 'Please enter defect name' }]}>
                <h6>Defects Name</h6>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <Input placeholder="Enter Defect Name" name="name" onChange={(e) => { setData(e.target.value) }} />
                </div>
              </Form.Item>

              <Form.Item >
                <h6>Select Color</h6>
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
          <Button key="cancel" onClick={() => setEditModalOpen(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" style={{ background: '#EC522D', color: '#fff' }} onClick={handlePut}>
            Edit Defect
          </Button>,
        ]}
      >
        <Row gutter={24} style={{ margin: '1rem', display: 'flex', flexDirection: 'column' }}>
          <Col style={{ margin: '1rem' }}>
            <Form form={form} size="large" layout="vertical" initialValues={{ name: editData?.name }}>
              <Form.Item name="name" label="Defects Name" rules={[{ required: true, message: 'Please enter defect name' }]}>
                <Input placeholder="Enter Defect Name" />
              </Form.Item>
              <Form.Item label="Select Color">
                <ColorPicker value={color} onChange={(color) => setColor(color.toHexString())}showText={(color) => <span>{color.toHexString()}</span>} />
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
