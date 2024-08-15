import React ,{useMemo, useState,useEffect} from 'react';
import {Button, Select ,Space, Card, Col, Row ,ColorPicker,Table, Tag, Form, Input, Radio, notification, Descriptions } from 'antd';
import { Switch } from 'antd';
import axios from "axios";
import { AuthToken, baseURL } from '../../API/API';

import {  EditOutlined} from '@ant-design/icons';

import { useSelector } from 'react-redux';
const Machine = ({machinesdata}) => {

// Table Columns
const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        id: 'id',
        render: (text) => <a>{text}</a>,
      },
    {
      title: 'Machine',
      dataIndex: 'name',
      id: 'name',
      render: (text) => <a>{text}</a>,
    },


  ];

  const [api, contextHolder] = notification.useNotification();

 
  return (
<>
{contextHolder}


<Table columns={columns} dataSource={machinesdata} pagination={{ pageSize: 6 }}/>

</>
  )
}

export default Machine