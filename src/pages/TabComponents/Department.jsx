import React, { useMemo, useState, useEffect } from 'react';
import { Button, Select, Space, Card, Col, Row, ColorPicker, Table, Tag, Form, Input, Radio, notification, Descriptions } from 'antd';
import { Switch } from 'antd';
import { useSelector } from 'react-redux';
import axios from "axios";

import { EditOutlined } from '@ant-design/icons';
// import {API, AuthToken, baseURL, localPlantData} from "./../API/API"
import { baseURL } from "../../API/API"

const Departments = ({ departmentsdata }) => {

  // Table Columns
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      id: 'id',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Department',
      dataIndex: 'name',
      id: 'name',
      render: (text) => <a>{text}</a>,
    },


  ];

  const [api, contextHolder] = notification.useNotification();
  return (
    <>
      {contextHolder}

      <Table columns={columns} dataSource={departmentsdata} pagination={{ pageSize: 6 }} />

    </>
  )
}

export default Departments;