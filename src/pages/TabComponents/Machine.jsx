import React from 'react';
import {Table, notification } from 'antd';
const Machine = ({machinesdata}) => {

// Table Columns
const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        id: 'id',
        render: (text) => <div>{text}</div>,
      },
    {
      title: 'Machine',
      dataIndex: 'name',
      id: 'name',
      render: (text) => <div>{text}</div>,
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