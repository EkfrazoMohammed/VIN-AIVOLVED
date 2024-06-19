import React from 'react';
import { Tabs } from 'antd';
import Settings from "./TabComponents/Settings";
import Alerts from './TabComponents/Alerts';
import Defects from './TabComponents/Defects';
import Department from './TabComponents/Department';
import Machine from './TabComponents/Machine';

const onChange = (key) => {
  console.log(key);
};


const items = [
  {
    key: '1',
    label: 'User Creation',
    children:<Settings/> ,
  },
  {
    key: '2',
    label: 'Defects',
    children: <Defects/>,
  },
  {
    key: '3',
    label: 'Department',
    children: <Department />,
  },
  {
    key: '4',
    label: 'Machine',
    children: <Machine />,
  },
  {
    key: '5',
    label: 'Products',
    children: <Alerts />,
  },
];

const App = () => 
<Tabs   type="card"
size={'large'} defaultActiveKey="1" items={items} onChange={onChange}   />;

export default App;