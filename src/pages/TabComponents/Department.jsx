import React from 'react';
import {Table,notification} from 'antd';

const Departments = ({ departmentsdata }) => {

  // Table Columns
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      id: 'id',
      render: (text) => <div>{text}</div>,
    },
    {
      title: 'Department',
      dataIndex: 'name',
      id: 'name',
      render: (text) => <div>{text}</div>,
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