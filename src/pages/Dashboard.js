
import { useState,useEffect } from "react";
import "../App.css"
import { Link } from "react-router-dom";
import axios from 'axios';
import {Card,Col, Row, Typography, Select, DatePicker,Checkbox, Button, Dropdown, Menu} from "antd";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Paragraph from "antd/lib/typography/Paragraph";
import {  VideoCameraOutlined, BugOutlined, AlertOutlined,NotificationOutlined} from '@ant-design/icons';
import StackChart from "../components/chart/StackChart";
import LineChart from "../components/chart/LineChart";
import PieChart from "../components/chart/PieChart";
import MachinesParameter from "./MachinesParameterWithPagination";
import MachinesParameterWithPagination from "./MachinesParameterWithPagination";
import MachineParam from "../components/chart/MachineParam";
import {API, baseURL,AuthToken,localPlantData} from "./../API/API"

function Dashboard() {
 
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7); 
  const formattedStartDate = startDate.toISOString().slice(0, 10);  
  const endDate = new Date(); 
  const formattedEndDate = endDate.toISOString().slice(0, 10); 
  
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedDefect, setSelectedDefect] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [dateRange, setDateRange] = useState([formattedStartDate, formattedEndDate]);
  const [tableData, setTableData] = useState([]);
  const [machineOptions, setMachineOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);

  const handleMachineChange = value => {
    setSelectedMachine(value);
  };
  const handleDepartmentChange = value => {
    setSelectedDepartment(value);
  };


  const localItems = localStorage.getItem("PlantData")
  const localPlantData = JSON.parse(localItems) 
  

  const handleDateRangeChange = (dates, dateStrings) => {
    if (dateStrings) {
      setDateRange("");
      // console.log(dateStrings)
    } else {
      console.error('Invalid date range:', dates,dateStrings);
    }
  };
  
  const handleApplyFilters = () => {
    const domain = `${baseURL}`;
    const [fromDate, toDate] = dateRange;
  console.log(fromDate,toDate)
    let url = `${domain}dashboard/?`;
    // url += `plant_id=${localPlantData.id}&from_date=${fromDate}&to_date=${toDate}&machine_id=${selectedMachine}&department_id=${selectedDepartment}&product_id=${selectedProduct}&defect_id=${selectedDefect}`;
    if (localPlantData.id) {
      url += `plant_id=${localPlantData.id}&`;
  }
  if (fromDate) {
      url += `from_date=${fromDate}&`;
  }
  if (toDate) {
      url += `to_date=${toDate}&`;
  }
  if (selectedMachine) {
      url += `machine_id=${selectedMachine}&`;
  }
  if (selectedDepartment) {
      url += `department_id=${selectedDepartment}&`;
  }
  if (selectedProduct) {
      url += `product_id=${selectedProduct}&`;
  }
  if (selectedDefect) {
      url += `defect_id=${selectedDefect}&`;
  }
  
  // Remove the trailing '&' if present
  if (url.endsWith('&')) {
      url = url.slice(0, -1);
  }
  
  // If no filters are added, remove the trailing '?'
  if (url.endsWith('?')) {
      url = url.slice(0, -1);
  }
    // if (fromDate && toDate) {
    //   url += `&from_date=${fromDate}&to_date=${toDate}`;
    // }
    axios.get(url,{
      headers:{
        Authorization:`Bearer ${AuthToken}`
      }
    })
      .then(response => {
        setTableData(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };
  
  useEffect(() => {
    getDepartments();
    getMachines();
    initialDateRange();
    initialTableData();
    alertApi()
  }, []);

  const getMachines = () => {
    const domain = `${baseURL}`;
    let url = `${domain}machine/?plant_name=${localPlantData.plant_name}`;
    axios.get(url,{
      headers:{
        'Authorization': `Bearer ${AuthToken}`
      }
    })
      .then(response => {
        console.log(response)
        const formattedMachines = response.data.results.map(machine => ({
          id: machine.id,
          name: machine.name,
        }));
        setMachineOptions(formattedMachines);
      })
      .catch(error => {
        console.error('Error fetching machine data:', error);
      });
  };

  const getDepartments = () => {
    const domain = `${baseURL}`;
    let url = `${domain}department/?plant_name=${localPlantData.plant_name}`;
    axios.get(url,{
      headers:{
        Authorization: ` Bearer ${AuthToken}`
      }
    })
      .then(response => {
        const formattedDepartment = response.data.results.map(department => ({
          id: department.id,
          name: department.name,
        }));
        setDepartmentOptions(formattedDepartment);
      })
      .catch(error => {
        console.error('Error fetching department data:', error);
      });
  };
  const initialDateRange = () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7); // 7 days ago
    const formattedStartDate = startDate.toISOString().slice(0, 10);
     // Format startDate as YYYY-MM-DD
    
    const endDate = new Date(); // Today's date
    const formattedEndDate = endDate.toISOString().slice(0, 10); // Format endDate as YYYY-MM-DD
    
    setDateRange([formattedStartDate, formattedEndDate]);
  };

  const initialTableData = () => {
    const domain = baseURL;
    const [fromDate, toDate] = [startDate, endDate].map(date => date.toISOString().slice(0, 10)); // Format dates as YYYY-MM-DD
    const url = `${domain}dashboard/?plant_id=${localPlantData.id}`;
    axios.get(url,{
      headers:{
        Authorization:` Bearer ${AuthToken}`
      }
    })
      .then(response => {
        setTableData(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };
const [alertData,setAlertData]=useState(null);

  const alertApi = ()=>{
    const domain = `${baseURL}`;
    const url = `${domain}product/?plant_name=${localPlantData.plant_name}`;
    axios.get(url,{
      headers:{
        Authorization:`Bearer ${AuthToken}`
      }
    }).then((res)=>{
console.log(res.data,"prod")
   setAlertData(res.data.results)
    })  
    .catch((err)=>{
      console.log(err)
    })
  }
 
  const { Title } = Typography;
  const { RangePicker } = DatePicker;
  const [categoryDefects, setCategoryDefects] = useState([]);
// Function to categorize defects
const categorizeDefects = (data) => {
  const categories = {};
  
  // Iterate through each date in the tableData
  Object.keys(data).forEach(date => {
    const defects = data[date];
    
    // Iterate through each defect in the current date
    Object.keys(defects).forEach(defect => {
      if (!categories[defect]) {
        categories[defect] = 0;
      }
      
      // Accumulate the defect value for the category
      categories[defect] += defects[defect];
    });
  });
  
  return categories;
};

  useEffect(() => {
 
    const categorizedData = categorizeDefects(tableData);
    setCategoryDefects(categorizedData);

  }, [tableData]);

  // const categorizeDefects = (data) => {
  //   const categorizedData = {};
  
  //   // Check if data is an array
  //   if (Array.isArray(data)) {
  //     data.forEach(item => {
  //       const { defect_name } = item;
  //       if (!categorizedData[defect_name]) {
  //         categorizedData[defect_name] = [];
  //       }
  //       categorizedData[defect_name].push(item);
  //     });
  //   } else {
  //     console.error('Data is not an array:', data);
  //   }
  
  //   return categorizedData;
  // };

  const [selectedCheckboxMachine, setSelectedCheckboxMachine] = useState([]);

  const handleMachineCheckBoxChange = (checkedValues) => {
    setSelectedCheckboxMachine(checkedValues);
    let url = `${baseURL}/reports?machine=`;
    checkedValues.forEach((machineId, index) => {
      if (index !== 0) {
        url += ',';
      }
      url += `machine${machineId}`;
    });

    axios.get(url)
    .then(response => {
      console.log(response) 
      // setTableData(response.data);
    })
    .catch(error => {
      console.error('Error fetching department data:', error);
    });
  };
  
  const menu = (
    <Menu selectable={true}>
      <Menu.Item key="0">
        <Checkbox.Group style={{ display: "block" }} value={selectedCheckboxMachine} onChange={handleMachineCheckBoxChange}>
          {machineOptions.map(machine => (
            <div key={machine.id} style={{display:"flex",flexDirection:"column"}}>
              <p style={{fontSize:"1.1rem",width:"100%"}} value={machine.id}>{machine.name}</p>
            </div>
          ))}
        </Checkbox.Group>
      </Menu.Item>
    </Menu>
  );
  


const [notifications, setNotifications] = useState([]);
const [isSocketConnected, setIsSocketConnected] = useState(false);
const [prevNotificationLength, setPrevNotificationLength] = useState(0);

const initializeWebSocket = () => {
  const socket = new WebSocket(`ws://159.65.157.118:8006/ws/notifications/`);

  socket.onopen = () => {
    console.log("WebSocket connection established");
    setIsSocketConnected(true); // Update connection status
  };

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    setNotifications(prevNotifications => {
      const newNotifications = [...prevNotifications, message.notification];
      // toast.error(message.notification); // Display toast notification
      console.log(message,"<,,")
      toast.error(message.notification, 
        {
          position: "top-right",
          autoClose: false,
          // autoClose:10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          style: { whiteSpace: 'pre-line' },  // Added style for new line character
          // transition: Bounce,
          }
      ); // Display toast notification with 5 seconds duration
      return newNotifications;
    });
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed");
    setIsSocketConnected(false); // Update connection status
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
    setIsSocketConnected(false); // Update connection status
  };

  return () => {
    socket.close();
  };
};

// const notify=()=>{
//   toast.error("Defect\n 'Clean Soil' has occurred\n three times\n consecutively.\nRCA1: Pin Hole in Nozzle\n", 
//     {
//       position: "top-right",
//       autoClose: false,
//       // autoClose:10000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//       theme: "colored",
//       style: { whiteSpace: 'pre-line' },  // Added style for new line character
//       // transition: Bounce,
//       }
//   );
// }

useEffect(() => {
  const cleanupWebSocket = initializeWebSocket();
  return cleanupWebSocket;
}, []);

useEffect(() => {
  if (notifications.length > prevNotificationLength) {
    setPrevNotificationLength(notifications.length);
  }
}, [notifications.length]);

  return (
    <>
     <ToastContainer />
      <div className="layout-content">
      <Row className="rowgap-vbox" gutter={[24, 0]}>
      <Col
              xs={24}
              sm={24}
              md={12}
              lg={6}
              className="mb-24"
              style={{display:"flex",gap:"1rem"}}
            >
      <Select
  style={{ minWidth: "200px", marginRight: "10px" }}
  showSearch
  placeholder="Select Machine"
  defaultValue={selectedMachine} 
  onChange={handleMachineChange}
  size="large"
>
  {machineOptions.map(machine => (
    <Select.Option key={machine.id} value={machine.id}>{machine.name}</Select.Option>
  ))}
</Select>

      <Select
        style={{ minWidth: "200px", marginRight: "10px" }}
        showSearch
        placeholder="Select Department"
        onChange={handleDepartmentChange}
        defaultValue={selectedDepartment}
        size="large"
      >
        {departmentOptions.map(department => (
          <Select.Option key={department.id} value={department.id}>{department.name}</Select.Option>
        ))}
      </Select>
      <RangePicker
          size="large"
        style={{ marginRight: "10px",minWidth:"280px" }}
        onChange={handleDateRangeChange}
          
      />
   
      <Button type="primary" onClick={handleApplyFilters} style={{fontSize:"1rem",backgroundColor:"#ec522d",marginRight:"10px"}}>Apply filters</Button>


       </Col>
        </Row>

        <Row className="rowgap-vbox" gutter={[24, 0]}>
            <Col
              key={1}
              xs={24}
              sm={24}
              md={12}
              lg={6}
              lg={6}
              className="mb-24"
            >
            <Card bordered={false} className="criclebox ">
              <Dropdown overlay={menu} trigger={['click']}>
      
    <div className="number">
      <Row align="middle">
        <Col xs={18}>
          <Title level={3}>
            {`Machines`}
          </Title>
          <span>{machineOptions.length}</span>
        </Col>
        <Col xs={6}>
          <div className="icon-box"><VideoCameraOutlined /></div>
        </Col>
      </Row>
    </div>
               </Dropdown>
            </Card>

            </Col>
            <Col
              key={1}
              xs={24}
              sm={24}
              md={12}
              lg={6}
              className="mb-24"
            >
              <Card bordered={false} className="criclebox ">
                <div className="number">
                  <Row align="middle">
                    <Col xs={18}>
                      <Title level={3}>
                        {`Defects`}
                      </Title>

                      {/* <span>  {Object.keys(categoryDefects).reduce((total, category) => total + category, 0)}</span> */}
                      <span>  {Object.keys(categoryDefects).length}</span>

                    </Col>
                    <Col xs={6}>
                      <div className="icon-box"><BugOutlined /></div>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
            <Col
              key={1}
              xs={24}
              sm={24}
              md={12}
              lg={6}
              lg={6}
              className="mb-24"
            >
              <Card bordered={false} className="criclebox ">
                <div className="number">
                  <Row align="middle">
                    <Col xs={18}>
                      <Title level={3}>
                        {`Products`}
                      </Title>
                      {
                        alertData ? 
                        <span>{Object.keys(alertData).length }</span>
                        : <span>0</span>
                      }
                    </Col>
                    <Col xs={6}>
                      <div className="icon-box"><AlertOutlined /></div>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>

            <Col
              key={1}
              xs={24}
              sm={24}
              md={12}
              lg={6}
              lg={6}
              className="mb-24"
            >
              <Link to="/insights">
              <Card
               bordered={false} className={`criclebox ${notifications.length > prevNotificationLength ? 'notification-change' : ''}`}>
          
              {/* <Card bordered={false} className={`criclebox ${notifications.length > prevNotificationLength ? 'notification-change' : ''}`}> */}
            <div className="number">
              <Row align="middle">
                <Col xs={18}>
                  <Title level={3}>
                    {`Insights`}
                  </Title>
                  {/* <button onClick={notify}>click</button> */}
                  {/* {
                    notifications ? 
                    <span>{notifications.length}</span>
                    : 0
                  } */}
                  <br />
                </Col>
                <Col xs={6}>
                  <div className="icon-box"><NotificationOutlined /></div>
                </Col>
              </Row>
            </div>
          </Card>
          </Link>
              
              {/* <Card bordered={false} className="criclebox ">
                <div className="number">
                  <Row align="middle">
                    <Col xs={18}>
                      <Title level={3}>
                        {`Insights`}
                      </Title>
                      {
                        notifications ? 
                        <span>{notifications.length }</span>
                        :0
                      }
                    </Col>
                    <Col xs={6}>
                      <div className="icon-box"><AlertOutlined /></div>
                    </Col>
                  </Row>
                </div>
              </Card> */}
            </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col xs={24} sm={24} md={12}  lg={6} className="mb-24">
         <Card bordered={false} className="h-full">
         {Object.keys(categoryDefects).map((category, index) => (
  <Card key={index} bordered={true} className="criclebox h-full mb-2 px-2 ">
    <div className="timeline-box">
      <h5>{category}</h5>
      <Paragraph className="lastweek">
        <span className="bnb2">{categoryDefects[category]}</span> Defects
      </Paragraph>
    </div>
  </Card>
))}

<Card bordered={true} className="criclebox h-full mb-2 px-2">
  <div className="timeline-box">
    <h5>Total Defects</h5>
    <Paragraph className="lastweek">
      <span className="bnb2">
        {Object.values(categoryDefects).reduce((total, category) => total + category, 0)}
      </span> Defects
    </Paragraph>
  </div>
</Card>

  </Card>
</Col>
<Col xs={24} sm={24} md={12} lg={14} xl={18} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <MachineParam   />

            </Card>
            </Col>

          <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <LineChart data={tableData}/>
            </Card>
          </Col>
           <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <StackChart data={tableData}/>

            </Card>
          </Col> 
          <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <PieChart  data={tableData} />
            </Card>
          </Col>
        </Row>
        <Row>
        <Card bordered={false} className="criclebox h-full">
         <MachinesParameterWithPagination />
         </Card>
        </Row>

      </div>
    </>
  );
}

export default Dashboard;