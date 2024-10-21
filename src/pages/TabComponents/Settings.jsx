import React, { useState, useEffect } from 'react';
import { Button, Col, Row, Input, notification, Select } from 'antd';
import { Switch } from 'antd';
import { Modal } from 'antd';
import { ColorRing } from 'react-loader-spinner'
import { useSelector, useDispatch } from 'react-redux';
import { encryptAES } from '../../redux/middleware/encryptPayloadUtils'
import useApiInterceptor from '../../hooks/useInterceptor';

const Settings = () => {

  const apiInterceptor = useApiInterceptor()
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.auth.authData[0].accessToken);
  const currentUserData = useSelector((state) => (state.user.userData[0]))
  const localPlantData = useSelector((state) => state?.plant?.plantData[0]);
  const all_roles = useSelector((state) => state.role.rolesData)
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false)
  const [modal2Open, setModal2Open] = useState(false);
  const [all_plants, setAllPlants] = useState([])

  const [locations, setLocations] = useState([
    {
      id: 1,
      is_active: true,
      location_name: "Pondi",

    },
    {
      id: 2,
      is_active: true,
      location_name: "Amli",

    },
    {
      id: 3,
      is_active: false,
      location_name: "New",

    },
  ]);

  useEffect(() => {
    const fetchPlantData = async () => {
      try {
        if (!accessToken) {
          console.log("Authorization token is missing");
          return;
        }

        const res = await apiInterceptor.get(`/plant/`)
        const { results } = res.data

        if (results) {
          setAllPlants(results);
        } else {
          console.warn("No results found in the response");
        }
      } catch (err) {
        //console.log("Error fetching plant data:", err);
        if (err.response && err.response.data.code === "token_not_valid") {
          console.log("Token is invalid or expired.");
        } else {
          console.log("Error:", err.message || "Unknown log occurred");
        }
      }
    };

    fetchPlantData();
  }, [accessToken]);

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
    plant: null, //pass id
    role: null  // pass id
  });
  const [error, setError] = useState({
    fistName: "",
    lastName: "",
    Phone: "",
    email: "",
    employee_id: "",
    plant: null,
    role_name: null
  })

  const closeModalUser = () => {
    setModal2Open(false)
    setData({
      first_name: "",
      last_name: "",
      phone_number: "",
      email: "",
      employee_id: "",
      plant: null,
      role_name: null
    })
    setError({
      fistName: "",
      lastName: "",
      Phone: "",
      email: "",
      employee_id: "",
      plant: null,
      role_name: null
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
      let errors = {};
      // Validate fields
      if (!data.first_name) errors.firstName = "*Please Enter First Name";
      if (!data.last_name) errors.lastName = "*Please Enter Last Name";
      if (!data.phone_number) {
        errors.Phone = "*Please Enter Phone Number";
      } else if (data.phone_number.length !== 10) {
        errors.Phone = "*Please Enter Valid Phone Number";
      }
      if (!data.email) {
        errors.email = "*Please Enter Email";
      } else if (!emailPattern.test(data.email)) {
        errors.email = "*Please Enter Valid Email";
      }
      if (!data.employee_id) errors.employee_id = "*Please Enter Employee ID";

      setError(errors); // Update errors

      // If there are any errors, stop execution
      if (Object.keys(errors).length > 0) {
        setLoading(false);
        return;
      }

      // Create payload
      const payload = {
        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: data.phone_number,
        email: data.email,
        employee_id: data.employee_id,
        plant: data.plant,
        role: data.role,
      };

      // Encrypt the payload
      const encryptedData = encryptAES(JSON.stringify(payload));
      const usersPayload = {
        data: encryptedData,
      };

      // Set loading state and make the API request
      setLoading(true);
      const postRequest = await apiInterceptor.post(`user/`, usersPayload, headersOb);

      // On successful request, handle success
      if (postRequest) {
        closeModalUser();
        setModal2Open(false);
        setLoading(false)
        resetForm();

        openNotification({ status: "success", message: "User Created Successfully!" });
      }

    } catch (error) {
      // Handle error response
      setLoading(false);
      if (error.response.status === 400) {
        if (error.response.data.message === "Token is invalid or expired") {
          openNotification({ status: "error", message: 'Unable to create user, Please Try again!' });
        } else {
          openNotification({ status: "error", message: error.response.data.message });
        }
      }
    }
    
  };

  // Reset form function to clear form data and errors
  const resetForm = () => {
    setData({
      first_name: "",
      last_name: "",
      phone_number: "",
      email: "",
      employee_id: "",
      plant: null,
      role: null,
    });
    setLoading(false);
    setError({});
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target
    const emailRegex = /^[^\s@]+@[^\s@]+\[^\s@]+$/;

    if (name === "first_name") {
      setError((prev) => ({ ...prev, firstName: "" }))
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
    setData((prev) => ({ ...prev, [name]: value.replace(/\s/g, '') }))
  }



  const handleRoleChange = (value) => {
    setData((prev) => ({ ...prev, role: value }));
    console.log(data)
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
        maskClosable={false} // This prevents the modal from closing on outside clicks
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
                  <Input placeholder="*Enter First Name" type='text' name='first_name' value={data.first_name} onChange={handleChange} helper className='p-2 custom-input' />
                  {error.firstName ? <span style={{ fontWeight: '600', color: 'red' }}>{error.firstName}</span> : ""}
                </div>
                <div className="">
                  <Input placeholder="*Enter Last Name" type='text' name='last_name' value={data.last_name} onChange={handleChange} className='p-2 custom-input' />
                  {error.lastName ? <span style={{ fontWeight: '600', color: 'red' }}>{error.lastName}</span> : ""}
                </div>


                <div className="">
                  <Input placeholder="*Enter Phone Number" type='number' name='phone_number' value={data.phone_number} onChange={handleChange} className='p-2 custom-input' />
                  {error.Phone ? <span style={{ fontWeight: '600', color: 'red' }}>{error.Phone}</span> : ""}
                </div>

                <div className="">
                  <Input placeholder="*Enter Email" type='text' name='email' value={data.email} onChange={handleChange} className='p-2 custom-input' />
                  {error.email ? <span style={{ fontWeight: '600', color: 'red' }}>{error.email}</span> : ""}
                </div>
                <div className="">
                  <Input placeholder="*Enter Employee Id" type='text' name='employee_id' value={data.employee_id} onChange={handleChange} className='p-2 custom-input' />
                  {error.employee_id ? <span style={{ fontWeight: '600', color: 'red' }}>{error.employee_id}</span> : ""}
                </div>
                <div className="">
                  {/* <Select
                    size='large'
                    style={{ minWidth: '100%' }}
                    placeholder="Select Role"
                    onChange={handleRoleChange}
                    value={data.role}
                  >
                    {all_roles.map((role, index) => (
                      <Select.Option key={index} value={role.id}>
                        {role.role_name}
                      </Select.Option>
                    ))}
                  </Select> */}
                  {error.role_name && <span style={{ fontWeight: '600', color: 'red' }}>{error.role_name}</span>}

                </div>

                {/* location start*/}
                {data.role == 2 ? (
                  <Select
                    size='large'
                    style={{ minWidth: '100%' }}
                    placeholder="Select Location"
                    onChange={handlePlantChange}
                  >
                    {locations.map(({ id, location_name }) => (
                      <Select.Option key={id} value={id}>
                        {location_name}
                      </Select.Option>
                    ))}
                  </Select>
                ) : (
                  data.role == 3 && (
                    <Select
                      size='large'
                      style={{ minWidth: '100%' }}
                      placeholder="Select Plant"
                      onChange={handlePlantChange}
                    >
                      {all_plants.map(({ id, plant_name }) => (
                        <Select.Option key={id} value={id}>
                          {plant_name}
                        </Select.Option>
                      ))}
                    </Select>
                  )
                )}

                {error.location && <span style={{ fontWeight: '600', color: 'red' }}>{error.location}</span>}
                {error.plant && <span style={{ fontWeight: '600', color: 'red' }}>{error.plant}</span>}


                {/* location end */}
                {/* <div className="">
                  <Select
                    style={{ minWidth: '100%' }}
                    placeholder="Select Plant"
                    onChange={handlePlantChange}
                    value={data.role_name}
                  >
                    {all_plants.map((role, index) => (
                      <Select.Option key={index} value={role.id}>
                        {role.plant_name}
                      </Select.Option>
                    ))}
                  </Select>
                  {error.plant && <span style={{ fontWeight: '600', color: 'red' }}>{error.plant}</span>}

                </div> */}
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