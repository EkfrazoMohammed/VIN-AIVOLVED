import React from 'react';
import {Table} from 'antd';
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

      <Table columns={columns} dataSource={departmentsdata} pagination={{ pageSize: 6 }} />

  )
}
Departments.propTypes = {
  departmentsdata:PropTypes.any
}
export default Departments;