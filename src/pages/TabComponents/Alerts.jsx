import React from 'react';
import { Table ,ConfigProvider  } from 'antd';
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
        },
      },
    }}
  >

    <Table columns={columns} dataSource={productsData} pagination={{ pageSize: 6 }} className='custom-table' />
  </ConfigProvider>
  )
}


Alert.propTypes = {
  productsData:PropTypes.any
}

export default Alert