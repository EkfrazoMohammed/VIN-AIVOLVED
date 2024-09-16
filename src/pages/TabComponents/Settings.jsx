import React, { useState } from 'react';
import { Button, Col, Row, Input, notification, Select } from 'antd';
import { Switch } from 'antd';
import { Modal } from 'antd';
import { ColorRing } from 'react-loader-spinner'
import { useSelector } from 'react-redux';
import { encryptAES } from '../../redux/middleware/encryptPayloadUtils'
import useApiInterceptor from '../../hooks/useInterceptor';
const Settings = () => {

  const apiInterceptor = useApiInterceptor()
  const accessToken = useSelector((state) => state.auth.authData[0].accessToken);
  const currentUserData = useSelector((state) => (state.user.userData[0]))
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false)
  const [modal2Open, setModal2Open] = useState(false);
  const plants=[
    {
        "id": 2,
        "plant_name": "HC BARS PLANT",
        "is_active": true
    },
    {
        "id": 3,
        "plant_name": "HC LIQUIDS PLANT",
        "is_active": true
    },
    {
        "id": 4,
        "plant_name": "SHAMPOO PLANT",
        "is_active": true
    }
]
  const roles = [
    {
      "role_name": "Sr.Manager",
      "is_active": true
    },
    {
      "role_name": "Manager",
      "is_active": true
    },
    {
      "role_name": "User",
      "is_active": true
    }
  ]


  const headersOb = {
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
  }
  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    employee_id: "",
    plant:null,
    role_name:null
  });
  const [error, setError] = useState({
    fistName: "",
    lastName: "",
    Phone: "",
    email: "",
    employee_id: "",
    plant:null,
    role_name:null
  })

  const closeModalUser = () => {
    setModal2Open(false)
    setData({
      first_name: "",
      last_name: "",
      phone_number: "",
      email: "",
      employee_id: "",
      plant:null,
      role_name:null
    })
    setError({
      fistName: "",
      lastName: "",
      Phone: "",
      email: "",
      employee_id: "",
      plant:null,
      role_name:null
    })
  }
  const openNotification = (param) => {
    const { status, message } = param
    api[status]({
      message: <div style={{ whiteSpace: "pre-line" }}>{message}</div> || "",
      duration: 5,
    });
  };
  const handlePost = async () => {
    try {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (data.first_name === "") {
        setError((prev) => ({ ...prev, fistName: "*Please Enter First Name " }))
      }
      if (data.last_name === "") {
        setError((prev) => ({ ...prev, lastName: "*Please Enter Last Name " }))
      }
      if (data.phone_number === "") {
        setError((prev) => ({ ...prev, Phone: "*Please Enter Phone Number " }))
      }
      else if ((data.phone_number).length !== 10) {
        setError((prev) => ({ ...prev, Phone: "*Please Enter Valid Phone Number " }))
      }
      if (data.email === "") {
        setError((prev) => ({ ...prev, email: "*Please Enter Email" }))
      }
      else if (!emailPattern.test(data.email)) {
        setError((prev) => ({ ...prev, email: "*Please Enter Valid Email" }))
      }
      if (data.employee_id === "") {
        setError((prev) => ({ ...prev, employee_id: "*Please Enter Employee Id" }))
      }
      const payload = {
        "first_name": data.first_name,
        "last_name": data.last_name,
        "phone_number": data.phone_number,
        "email": data.email,
        "employee_id": data.employee_id
      }
      const encryTedData = encryptAES(JSON.stringify(payload))
      const usersPayload = {
        "data": `${encryTedData}`
      }
      if (data.employee_id !== "" && data.first_name !== "" && data.last_name !== "" && data.phone_number !== "" && data.email !== "" && error.fistName === "" && error.lastName === "" && error.email === "" && error.Phone === "" && error.employee_id === "") {
        setLoading(true)
        const postRequest = await apiInterceptor.post(`user/`, usersPayload, headersOb)
        if (postRequest) {
          closeModalUser()
          setLoading(false)
          setModal2Open(false)
          setData({
            first_name: "",
            last_name: "",
            phone_number: "",
            email: "",
            employee_id: ""
          })
        }
        openNotification({ status: "success", message: "User Created Successfully!" });

      } else {
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      if (error.response.status === 400) {
        openNotification({ status: "error", message: error.response.data.message });
      }
    }
  }


  const handleChange = (e) => {
    const { name, value } = e.target
    const emailRegex = /^[^\s@]+@[^\s@]+\[^\s@]+$/;
    if (name === "first_name") {
      setError((prev) => ({ ...prev, fistName: "" }))
    }
    if (name === "last_name") {
      setError((prev) => ({ ...prev, lastName: "" }))
    }
    if (name === "phone_number") {
      setError((prev) => ({ ...prev, Phone: "" }))
    }
    if (name === "employee_id") {
      setError((prev) => ({ ...prev, employee_id: "" }))
    }
    if (name === "email") {
      if (emailRegex.test(data.email)) {
        setError((prev) => ({ ...prev, email: "Enter Valid Email" }))
      }
      else {
        setError((prev) => ({ ...prev, email: "" }))
      }
    }
    setData((prev) => ({ ...prev, [name]: value }))
  }
  const handleRoleChange = (value) => {
    setData((prev) => ({ ...prev, role_name: value }));
  };
  const handlePlantChange = (value) => {
    setData((prev) => ({ ...prev, plant: value }));
  };
  return (
    <>
      {contextHolder}
      <Row gutter={24} style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Col span={9} >
          <h5 style={{ fontWeight: 650 }}>User Creation</h5>
        </Col>
        <Col span={3}  >

          <Button type="primary" style={{ width: '100%', padding: '0' }} danger onClick={() => setModal2Open(true)}>
            User Creation
          </Button>   </Col>
      </Row>
      <Row gutter={24} style={{ display: 'flex', flexDirection: 'column', gap: '2rem', margin: '2rem' }} >

        <Col span={16} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className="flex flex-col gap-2">
            <h6 className='font-bold'>User ID:</h6>
            <h6>{currentUserData?.userId}</h6>
          </div>
          <div className="flex flex-col gap-2">
            <h6 className='font-bold'>Email:</h6>
            <h6>{currentUserData?.userName}</h6>
          </div>

        </Col>
      </Row>
      <Row style={{ display: 'flex', gap: '2rem', flexDirection: 'column', marginTop: '1rem' }}>
        <Col style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} span={8}>
          <h5 style={{ fontWeight: 650, marginBottom: 0, minWidth: "200px" }}>Send email notification</h5>
          <Switch defaultChecked />
        </Col>
        <Col style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} span={8}>
          <h5 style={{ fontWeight: 650, marginBottom: 0, minWidth: "200px" }}>Send sms notification</h5>
          <Switch defaultChecked />
        </Col>
      </Row>
      <Modal
        title={<div style={{ textAlign: "center", fontSize: '1.3rem' }}>Create User</div>}
        centered
        open={modal2Open}
        onOk={() => setModal2Open(false)}
        onCancel={closeModalUser}
        footer={null}
      >
        {
          loading ?
            <div className="" style={{ display: 'flex', justifyContent: 'center', width: '100%', minHeight: '250px', alignItems: 'center' }}>

              <ColorRing
                height="80"
                width="80"
                ariaLabel="color-ring-loading"
                wrapperClass="color-ring-wrapper"
                colors={['#F55027', '#F55027', '#F55027', '#BC1C57', '#BC1C57']}
              />
            </div>
            :
            <>
              <div className="" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', fontWeight: '600' }}>
                <div className="">
                  <Input placeholder="Enter First Name" type='text' name='first_name' value={data.first_name} onChange={handleChange} helper className='p-2 custom-input' />
                  {error.fistName ? <span style={{ fontWeight: '600', color: 'red' }}>{error.fistName}</span> : ""}
                </div>
                <div className="">
                  <Input placeholder="Enter Last Name" type='text' name='last_name' value={data.last_name} onChange={handleChange} className='p-2 custom-input' />
                  {error.lastName ? <span style={{ fontWeight: '600', color: 'red' }}>{error.lastName}</span> : ""}
                </div>


                <div className="">
                  <Input placeholder="Enter Phone Number" type='number' name='phone_number' value={data.phone_number} onChange={handleChange} className='p-2 custom-input' />
                  {error.Phone ? <span style={{ fontWeight: '600', color: 'red' }}>{error.Phone}</span> : ""}
                </div>

                <div className="">
                  <Input placeholder="Enter Email" type='email' name='email' value={data.email} onChange={handleChange} className='p-2 custom-input' />
                  {error.email ? <span style={{ fontWeight: '600', color: 'red' }}>{error.email}</span> : ""}
                </div>
                <div className="">
                  <Input placeholder="Enter Employee Id" type='text' name='employee_id' value={data.employee_id} onChange={handleChange} className='p-2 custom-input' />
                  {error.employee_id ? <span style={{ fontWeight: '600', color: 'red' }}>{error.employee_id}</span> : ""}
                </div>
                <div className="">
                <Select
                  style={{ minWidth: '100%' }}
                  placeholder="Select Role"
                  onChange={handleRoleChange} // Bind the onChange event for Select
                  value={data.role_name} // Set the value to selected role_name
                >
                  {roles.map((role, index) => (
                    <Select.Option key={index} value={role.role_name}>
                      {role.role_name}
                    </Select.Option>
                  ))}
                </Select>
                {error.role_name && <span style={{ fontWeight: '600', color: 'red' }}>{error.role_name}</span>}
             
                </div>

                <div className="">
                <Select
                  style={{ minWidth: '100%' }}
                  placeholder="Select Plant"
                  onChange={handlePlantChange}
                  value={data.role_name} 
                >
                  {plants.map((role, index) => (
                    <Select.Option key={index} value={role.id}>
                      {role.plant_name}
                    </Select.Option>
                  ))}
                </Select>
                {error.plant && <span style={{ fontWeight: '600', color: 'red' }}>{error.plant}</span>}
             
                </div>
              </div>
              <div className="" style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem' }}>
                <Button type="primary" style={{ width: '20%', padding: '0' }} danger onClick={() => handlePost()}>
                  Submit
                </Button>
              </div>
            </>
        }
      </Modal>
    </>
  )
}

export default Settings