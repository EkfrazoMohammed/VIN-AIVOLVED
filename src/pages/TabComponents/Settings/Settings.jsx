import React, { useState, useEffect } from "react";
import {
  Button,
  Col,
  Row,
  Input,
  notification,
  Select,
  Switch,
  Modal,
  Spin,
} from "antd";
import { ColorRing } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { encryptAES } from "../../../redux/middleware/encryptPayloadUtils";
import useApiInterceptor from "../../../hooks/useInterceptor";
import { clearConfig } from "dompurify";
import { rolesRoutes } from "../../../config/rolesConfig";
import { fetchLocationData } from "../../Location/api/useGetlocation";
import UserTable from "./UserTable";
import PermissionModal from "./PermissionModal";
import { create } from "lodash";

const Settings = () => {
  const apiInterceptor = useApiInterceptor();

  const accessToken = useSelector(
    (state) => state.auth.authData[0].accessToken
  );
  const currentUserData = useSelector((state) => state.user.userData[0]);
  const currentLocationData = useSelector(
    (state) => state.location.locationData[0]
  );

  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState({
    createUser: false,
    fetchUser: false,
  });
  const [modal2Open, setModal2Open] = useState(false);
  const [plants, setPlants] = useState([]);
  const [locations, setLocation] = useState([]);
  const [userData, setUserData] = useState([]);

  const fetchUserData = async (selectedLocation) => {
    try {
      setLoading((prev) => ({ ...prev, fetchUser: true }));
            const encryptedLocationId = encryptAES(JSON.stringify(selectedLocation));
      const res = await apiInterceptor.get(
        `/user/?location=${encryptedLocationId}`
      );
      if (res.data.results.length && res.status === 200) {
        setLoading((prev) => ({ ...prev, fetchUser: false }));
        setUserData(res.data.results);
      }
    } catch (error) {
      console.log(error);
      setLoading((prev) => ({ ...prev, fetchUser: false }));    }
  };

  const fetchPlantData = async (selectedLocation) => {
    try {
      if (!accessToken) {
        return;
      }
      const ecncryptedLocationId = encryptAES(JSON.stringify(selectedLocation));
      const res = await apiInterceptor.get(
        `/plant/?location_id=${ecncryptedLocationId}`
      );
      const { results } = res.data;

      if (results) {
        setPlants(results);
      } else {
        console.warn("No results found in the response");
      }
    } catch (err) {
      console.log("Error fetching plant data:");
      if (err.response && err.response.data.code === "token_not_valid") {
        console.log("Token is invalid or expired.");
      } else {
        console.log("Error:", err.message || "Unknown log occurred");
      }
    }
  };

  useEffect(() => {
    fetchLocationData(accessToken, apiInterceptor)
      .then((results) => {
        if (results && Array.isArray(results)) {
          setLocation(results);
        } else {
          console.log("No location data found.");
        }
      })
      .catch((err) => {
        console.log("Error in fetching location data:", err);
      });
    if (currentUserData.roleName === "Manager") {
      fetchPlantData(currentUserData.locationId);
      fetchUserData(currentUserData.locationId);
    }
    if (currentUserData.roleName === "General Manager") {
      fetchUserData(currentLocationData.id);
    }
  }, [accessToken]);

  const headersOb = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    employee_id: "",
    plant: null, //pass id
    role: null, // pass id
  });
  const [error, setError] = useState({
    fistName: "",
    lastName: "",
    Phone: "",
    email: "",
    employee_id: "",
    plant: null,
    role_name: null,
  });

  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);

  const handleRoleChange = (value) => {
    setSelectedRole(value);
    setSelectedLocation(null);
  };

  const handleLocationChange = (value) => {
    setSelectedLocation(value);
    fetchPlantData(value);
  };

  const closeModalUser = () => {
    setModal2Open(false);
    setData({
      first_name: "",
      last_name: "",
      phone_number: "",
      email: "",
      employee_id: "",
      plant: null,
      role_name: null,
    });
    setError({
      fistName: "",
      lastName: "",
      Phone: "",
      email: "",
      employee_id: "",
      plant: null,
      role_name: null,
    });
    setSelectedLocation(null);
    setSelectedRole(null);
  };
  const openNotification = (param) => {
    const { status, message } = param;
    api[status]({
      message:
        (
          <div style={{ whiteSpace: "pre-line", color: "#000" }}>{message}</div>
        ) || "",
      duration: 2,
    });
  };

  const handlePost = async () => {
    try {
      const emailPattern = /^[a-zA-Z\d._%+-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;

      const validateRequired = (field, fieldName) => {
        return !field ? `*Please Enter ${fieldName}` : null;
      };

      const validatePhoneNumber = (phoneNumber) => {
        if (!phoneNumber) return "*Please Enter Phone Number";
        return phoneNumber.length !== 10
          ? "*Please Enter Valid Phone Number"
          : null;
      };

      const validateEmail = (email) => {
        if (!email) return "*Please Enter Email";
        return !emailPattern.test(email) ? "*Please Enter Valid Email" : null;
      };

      let errors = {};

      // Validate fields
      errors.firstName = validateRequired(data.first_name, "First Name");
      errors.lastName = validateRequired(data.last_name, "Last Name");
      errors.Phone = validatePhoneNumber(data.phone_number);
      errors.email = validateEmail(data.email);
      errors.employee_id = validateRequired(data.employee_id, "Employee ID");

      // Remove any null values (empty error messages)
      errors = Object.fromEntries(
        Object.entries(errors).filter(([_, v]) => v !== null)
      );

      setError(errors); // Update errors

      // If there are any errors, stop execution
      if (Object.keys(errors).length > 0) {
        setLoading((prev) => ({ ...prev, createUser: false }));
        return;
      }

      // Create payload
      const payload = {
        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: data.phone_number,
        email: data.email,
        employee_id: data.employee_id,
        plant: selectedPlant,
        role:
          selectedRole === "Manager" ? 2 : selectedRole === "user" ? 3 : null,
        location: selectedLocation,
        password: null,
      };

      // Encrypt the payload
      const encryptedData = await encryptAES(JSON.stringify(payload));
      const usersPayload = {
        data: encryptedData,
      };
      // Set loading state and make the API request
      setLoading((prev) => ({ ...prev, createUser: true }));
      const postRequest = await apiInterceptor.post(
        `user/`,
        usersPayload,
        headersOb
      );

      // On successful request, handle success
      // if (postRequest) {
      //   closeModalUser();
      //   setModal2Open(false);
      //   setLoading(false);
      //   resetForm();

      //   openNotification({
      //     status: "success",
      //     message: "User Created Successfully!",
      //   });
      // }
    } catch (error) {
      // Handle error response
      setLoading((prev) => ({ ...prev, createUser: false }));

      if (error?.response?.message === "Token is invalid or expired") {
        openNotification({
          status: "error",
          message: "Unable to create user, Please Try again!",
        });
      } else {
        openNotification({
          status: "error",
          message: error?.response?.data?.message,

        });
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
    setLoading((prev) => ({ ...prev, createUser: true }));

    setError({});

  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const emailRegex = /^[^\s@]+@[^\s@]+\[^\s@]+$/;

    if (name === "first_name") {
      setError((prev) => ({ ...prev, firstName: "" }));
    }
    if (name === "last_name") {
      setError((prev) => ({ ...prev, lastName: "" }));
    }
    if (name === "phone_number") {
      setError((prev) => ({ ...prev, Phone: "" }));
    }
    if (name === "employee_id") {
      setError((prev) => ({ ...prev, employee_id: "" }));
    }
    if (name === "email") {
      if (emailRegex.test(data.email)) {
        setError((prev) => ({ ...prev, email: "Enter Valid Email" }));
      } else {
        setError((prev) => ({ ...prev, email: "" }));
      }
    }
    setData((prev) => ({ ...prev, [name]: value.replace(/\s/g, "") }));
  };

  const handlePlantChange = (value) => {
    setSelectedPlant(value);
  };

  return (
    <>
      {contextHolder}

      <Row
        gutter={24}
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <Col span={9}>
          <h5 style={{ fontWeight: 650 }}>User Creation</h5>
        </Col>
        <Col span={3}>
          <Button
            className="commButton"
            type="primary"
            style={{ width: "100%", padding: "0" }}
            danger
            onClick={() => setModal2Open(true)}
          >
            User Creation
          </Button>
        </Col>
      </Row>
      <Row
        gutter={24}
        className="bg-white p-3 rounded-md shadow-lg"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          margin: "2rem",
        }}
      >
        {loading.fetchUser ? <Spin size="large" /> : <UserTable userData={userData} />}
      </Row>
      <Row
        style={{
          display: "flex",
          gap: "2rem",
          flexDirection: "column",
          marginTop: "1rem",
        }}
      >
        <Col
          style={{ display: "flex", alignItems: "center", gap: "1rem" }}
          span={8}
        >
          <h5 style={{ fontWeight: 650, marginBottom: 0, minWidth: "200px" }}>
            Send email notification
          </h5>
          <Switch defaultChecked />
        </Col>
        <Col
          style={{ display: "flex", alignItems: "center", gap: "1rem" }}
          span={8}
        >
          <h5 style={{ fontWeight: 650, marginBottom: 0, minWidth: "200px" }}>
            Send sms notification
          </h5>
          <Switch defaultChecked />
        </Col>
      </Row>
      <Modal
        title={
          <div style={{ textAlign: "center", fontSize: "1.3rem" }}>
            Create User
          </div>
        }
        centered
        open={modal2Open}
        onOk={() => setModal2Open(false)}
        onCancel={closeModalUser}
        footer={null}
        maskClosable={false} // This prevents the modal from closing on outside clicks
      >
        {loading.createUser ? (
          <div
            className=""
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              minHeight: "250px",
              alignItems: "center",
            }}
          >
            <ColorRing
              height="80"
              width="80"
              ariaLabel="color-ring-loading"
              wrapperClass="color-ring-wrapper"
              colors={["#F55027", "#F55027", "#F55027", "#BC1C57", "#BC1C57"]}
            />
          </div>
        ) : (
          <>
            <div
              className=""
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                padding: "1rem",
                fontWeight: "600",
              }}
            >
              <div className="">
                <Input
                  autoComplete="off"
                  placeholder="*Enter First Name"
                  type="text"
                  name="first_name"
                  value={data.first_name}
                  onChange={handleChange}
                  helper
                  className="p-2 custom-input"
                />
                {error.firstName ? (
                  <span style={{ fontWeight: "600", color: "red" }}>
                    {error.firstName}
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div className="">
                <Input
                  autoComplete="off"
                  placeholder="*Enter Last Name"
                  type="text"
                  name="last_name"
                  value={data.last_name}
                  onChange={handleChange}
                  className="p-2 custom-input"
                />
                {error.lastName ? (
                  <span style={{ fontWeight: "600", color: "red" }}>
                    {error.lastName}
                  </span>
                ) : (
                  ""
                )}
              </div>

              <div className="">
                <Input
                  autoComplete="off"
                  placeholder="*Enter Phone Number"
                  type="number"
                  name="phone_number"
                  value={data.phone_number}
                  onChange={handleChange}
                  className="p-2 custom-input"
                />
                {error.Phone ? (
                  <span style={{ fontWeight: "600", color: "red" }}>
                    {error.Phone}
                  </span>
                ) : (
                  ""
                )}
              </div>

              <div className="">
                <Input
                  autoComplete="off"
                  placeholder="*Enter Email"
                  type="text"
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  className="p-2 custom-input"
                />
                {error.email ? (
                  <span style={{ fontWeight: "600", color: "red" }}>
                    {error.email}
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div className="">
                <Input
                  autoComplete="off"
                  placeholder="*Enter Employee Id"
                  type="text"
                  name="employee_id"
                  value={data.employee_id}
                  onChange={handleChange}
                  className="p-2 custom-input"
                />
                {error.employee_id ? (
                  <span style={{ fontWeight: "600", color: "red" }}>
                    {error.employee_id}
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div className="">
                {error.role_name && (
                  <span style={{ fontWeight: "600", color: "red" }}>
                    {error.role_name}
                  </span>
                )}
              </div>
              <div>
                {/* Select Role */}
                <Select
                  size="large"
                  style={{ minWidth: "100%" }}
                  placeholder="Select Role"
                  value={selectedRole}
                  onChange={handleRoleChange}
                >
                  {currentUserData.roleName === "General Manager" ? (
                    <>
                      <Select.Option value="Manager">Manager</Select.Option>
                      <Select.Option value="user">User</Select.Option>
                    </>
                  ) : currentUserData.roleName === "Manager" ? (
                    <Select.Option value="user">User</Select.Option>
                  ) : null}
                </Select>

                {/* Location: show only for General Manager when selectedRole is "Manager" or "user" */}
                {currentUserData.roleName === "General Manager" &&
                  (selectedRole === "Manager" || selectedRole === "user") && (
                    <Select
                      size="large"
                      style={{ minWidth: "100%", marginTop: 10 }}
                      placeholder="Select Location"
                      onChange={handleLocationChange}
                      value={selectedLocation}
                    >
                      {locations.map(({ id, name }) => (
                        <Select.Option key={id} value={id}>
                          {name}
                        </Select.Option>
                      ))}
                    </Select>
                  )}

                {/* Plant: 
      - For "Manager" user -> show directly 
      - For "General Manager" or "user" -> show after location is selected
  */}
                {((currentUserData.roleName === "Manager" && selectedRole) ||
                  (selectedRole && selectedLocation)) &&
                  selectedRole !== "Manager" && (
                    <Select
                      size="large"
                      style={{ minWidth: "100%", marginTop: 10 }}
                      placeholder="Select Plant"
                      value={selectedPlant}
                      onChange={handlePlantChange}
                    >
                      {plants.map(({ id, plant_name }) => (
                        <Select.Option key={id} value={id}>
                          {plant_name}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
              </div>

              {error.location && (
                <span style={{ fontWeight: "600", color: "red" }}>
                  {error.location}
                </span>
              )}
              {error.plant && (
                <span style={{ fontWeight: "600", color: "red" }}>
                  {error.plant}
                </span>
              )}
            </div>
            <div
              className=""
              style={{
                display: "flex",
                justifyContent: "flex-end",
                padding: "1rem",
              }}
            >
              <Button
                className="commButton"
                type="primary"
                style={{ width: "20%", padding: "0" }}
                danger
                onClick={() => handlePost()}
              >
                Submit
              </Button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

export default Settings;
