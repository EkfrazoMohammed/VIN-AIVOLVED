import React from 'react';
import { useSelector } from 'react-redux';
import { Tabs } from 'antd';
import Settings from "./TabComponents/Settings";
import Alerts from './TabComponents/Alerts';
import Defects from './TabComponents/Defects';
import Department from './TabComponents/Department';
import Machine from './TabComponents/Machine';
import DefectTrigger from './TabComponents/DefectTrigger';


const SettingsContainer = () => {

  const machines = useSelector((state) => state.machine.machinesData)
  const defectsData = useSelector((state) => state.defect.defectsData)
  const productsData = useSelector((state) => state.product.productsData)
  const departmentsData = useSelector((state) => state.department.departmentsData)




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
    {
      key: '6',
      label: 'Defect Trigger',
      children: <DefectTrigger machinesdata={machines} defectsdata={defectsData} />,
    },
  ];
  return (
      <Tabs type="card"
        size={'large'} defaultActiveKey="1" items={items}  />
 
  )
}

export default SettingsContainer;