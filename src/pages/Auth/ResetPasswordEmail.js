import React, { useState } from "react";
import { Card, Col, Input, notification ,ConfigProvider } from "antd";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import {  encryptAES } from "../../redux/middleware/encryptPayloadUtils";
import { ColorRing } from 'react-loader-spinner'
import axiosInstance from "../../API/axiosInstance";

const ResetPasswordEmail = () => {
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false)

  const [resetPayload, setResetPayload] = useState({
    email: "",
  });

  const [error, setError] = useState({
    emailError: "",
  });
  const openNotification = (param) => {
    const { status, message } = param;

    api[status]({
      message: message || "",
      duration: 3, // Notification will auto-close after 3 seconds
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      setError((prev) => ({ ...prev, emailError: "" }));
    }

    setResetPayload((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };


  const confirmEmail = async () => {
    try {
      if (resetPayload.email === "") {
        setError((prev) => ({ ...prev, emailError: "Email ID is required" }));
      } else if (!validateEmail(resetPayload.email)) {
        setError((prev) => ({ ...prev, emailError: "Invalid Email ID" }));
      } else {
        const payload = {
          email: resetPayload.email,
        }
        setLoading(true);
        const encryTedData = await encryptAES(JSON.stringify(payload));
        const res = await axiosInstance.post(`reset-password/`, { "data": encryTedData });
  
        if (res.status === 200) {
          setLoading(false);
          openNotification({
            status: "success",
            message: "Reset password link sent to your email",
          });
        } else {
          const errorMessage = res?.data?.message || "Email ID is not registered"; // Default error message if none is provided
          openNotification({
            status: "error",
            message: errorMessage,
          });
        }
      }
    } catch (error) {
      
      const backendErrorMessage = error?.response?.data?.message || error?.message || "An error occurred";
      
      openNotification({
        
        status: "error",
        message: backendErrorMessage,
      });
      setLoading(false);
    }
  };
  
  return (
    <>
      {contextHolder}
      <div
        style={{
          background:" linear-gradient(-40deg, #072266, #072266 )",
          animation:'gradient 15s infinte',
          height: "100vh",
          width: "100%",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >

        <Col span={8}>
          <Card
            bordered={false}
            style={{ padding: "1rem", borderRadius: "25px", background:"#091128",color:"#fff" }}
          >
            <div>
              <p>
                <ArrowLeftOutlined
                  className="text-[1rem] cursor-pointer "
                  onClick={() => navigate("/login")}
                />
              </p>
              <img
                src="https://eimkeia.stripocdn.email/content/guids/CABINET_8270216c780e362a1fbcd636b59c67ae376eb446dc5f95e17700b638b8c3f618/images/indus_logo_dev.png"
                alt="AI Logo"
                className="w-44 h-auto m-auto "
              />
            </div>
            {
              loading ?
                <div className="text-center flex justify-center items-center ">

                  <ColorRing
                    height="80"
                    width="80"
                    ariaLabel="color-ring-loading"
                    wrapperClass="color-ring-wrapper"
                    colors={['#F55027', '#F55027', '#F55027', '#BC1C57', '#BC1C57']}
                  />
                </div> :
                <>


                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    <h2 style={{ margin: "0.5rem 0", fontWeight: "700", }}> <span className="text-red-600">*</span> Email address</h2>
                   
                    <ConfigProvider
  theme={{
    token: {
      colorTextPlaceholder:"#797e8c",
        colorText:"#fff",
        colorBgContainerDisabled	:"#3e4557"
    },
  }}
>
  
                    <Input
                      type="email"
  
                      className="!bg-[#3e4557] h-12 outline-none "
                      name="email"
                      placeholder="Enter  Email address"
                      onChange={handleChange}
                      value={resetPayload.email}
                    />
</ConfigProvider>
                    {error.emailError && (
                      <span
                        style={{
                          color: "red",
                          fontWeight: "600",
                          fontSize: "0.8rem",
                        }}
                      >
                        *{error.emailError}
                      </span>
                    )}
                    <p className="font-semibold py-2 text-red-500">Reset password link will be sent to the respective email id</p>
                  </div>
                  <h2>
                    <button
                      style={{
                        padding: "1rem",
                        border: "none",
                        borderRadius: "5px",
                        color: "#fff",
                        fontWeight: "600",
                        fontSize: "1rem",
                        cursor: "pointer",
                        margin: "5px"
                      }}
                      className="commButton"
                      onClick={confirmEmail}
                    >
                      Send Email
                    </button>
                  </h2>
                </>
            }
          </Card>
        </Col>
      </div>
    </>
  );
};

export default ResetPasswordEmail;
