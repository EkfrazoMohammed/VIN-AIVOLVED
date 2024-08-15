import React, { useMemo, useState, useEffect } from 'react';
import { Button, Select, Space, Card, Col, Row, ColorPicker, Table, Tag, Form, Input, Radio, notification, Descriptions } from 'antd';
import { Switch } from 'antd';
import axios from "axios";
import { useSelector } from 'react-redux';
// import {API, AuthToken, baseURL, localPlantData} from "./../API/API"
import { baseURL } from "../../API/API"

import { EditOutlined } from '@ant-design/icons';
import Alerts from './Settings';

const Alert = ({ productsData }) => {
  // const localItems = localStorage.getItem('PlantData');
  // const localPlantData = JSON.parse(localItems);

  // Table Columns
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <a>{text}</a>,

    },
    {
      title: 'Product ',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },


  ];

  const [api, contextHolder] = notification.useNotification();

  return (
    <>
      {contextHolder}


      <Table columns={columns} dataSource={productsData} pagination={{ pageSize: 6 }} />
    </>
  )
}

export default Alert