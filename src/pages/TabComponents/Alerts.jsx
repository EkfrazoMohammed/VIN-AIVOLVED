import React from 'react';
import { Table,notification  } from 'antd';

const Alert = ({ productsData }) => {
  
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