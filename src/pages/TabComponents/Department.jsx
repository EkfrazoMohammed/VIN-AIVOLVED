import React from 'react';
import {Table ,ConfigProvider} from 'antd';
import PropTypes from 'prop-types';

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
          fontWeightStrong: 500,
        },
      },
    }}
  >
    <Table className='custom-table' columns={columns} dataSource={departmentsdata} pagination={{ pageSize: 6 }} />
  </ConfigProvider>

  )
}
Departments.propTypes = {
  departmentsdata:PropTypes.any
}
export default Departments;