import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tabs } from 'antd';
import Settings from "./TabComponents/Settings";
import Alerts from './TabComponents/Alerts';
import Defects from './TabComponents/Defects';
import Department from './TabComponents/Department';
import Machine from './TabComponents/Machine';
import { initialDashboardData, getDefects, getMachines, getSystemStatus, getDepartments, initialDpmuData, initialProductionData, getProducts } from "../services/dashboardApi";


const SettingsContainer = () => {

  const machines = useSelector((state) => state.machine.machinesData)
  const defectsData = useSelector((state) => state.defect.defectsData)
  const productsData = useSelector((state) => state.product.productsData)
  const departmentsData = useSelector((state) => state.department.departmentsData)

  const onChange = (key) => {
    //console.log(key);
  };


  const items = [
    {
      key: '1',
      label: 'User Creation',
      children: <Settings />,
    },
    {
      key: '2',
      label: 'Defects',
      children: <Defects defectsdata={defectsData} />,
    },
    {
      key: '3',
      label: 'Department',
      children: <Department departmentsdata={departmentsData} />,
    },
    {
      key: '4',
      label: 'Machine',
      children: <Machine machinesdata={machines} />,
    },
    {
      key: '5',
      label: 'Products',
      children: <Alerts productsData={productsData} />,
    },
  ];
  return (
    <>
      <Tabs type="card"
        size={'large'} defaultActiveKey="1" items={items} onChange={onChange} />
    </>
  )
}

export default SettingsContainer;