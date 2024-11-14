import React from 'react';
import {Table } from 'antd';
import PropTypes from 'prop-types';
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


 
  return (


<Table columns={columns} dataSource={machinesdata} pagination={{ pageSize: 6 }}/>

  )
}
Machine.propTypes = {
  machinesdata:PropTypes.any
}

export default Machine