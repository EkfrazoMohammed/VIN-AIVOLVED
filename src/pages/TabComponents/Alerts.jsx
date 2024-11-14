import React from 'react';
import { Table  } from 'antd';
import PropTypes from 'prop-types';

const Alert = ({ productsData }) => {
  
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <div>{text}</div>,

    },
    {
      title: 'Product ',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <div>{text}</div>,
    },


  ];


  return (
      <Table columns={columns} dataSource={productsData} pagination={{ pageSize: 6 }} />
  )
}


Alert.propTypes = {
  productsData:PropTypes.any
}

export default Alert