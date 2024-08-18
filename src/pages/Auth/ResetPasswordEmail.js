import React, { useState } from "react";
import { Card, Col, notification } from "antd";
import axios from "axios";
import { baseURL } from "../../API/API";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { encryptAES } from "../../redux/middleware/encryptPayloadUtils";

const ResetPasswordEmail = () => {
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();

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
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const confirmEmail = async () => {
    try {
      if (resetPayload.email === "") {
        setError((prev) => ({ ...prev, emailError: "Email not entered" }));
      } else if (!validateEmail(resetPayload.email)) {
        setError((prev) => ({ ...prev, emailError: "Invalid email format" }));
      } else {
        const payload={
          email: resetPayload.email,
        }
      const encryTedData = encryptAES(JSON.stringify(payload))
        const res = await axios.post(`${baseURL}reset-password/`, {"data":encryTedData});
        
        if (res.status === 200) {
          openNotification({
            status: "success",
            message: "Reset link sent to your email",
          });
       } else {
          openNotification({
            status: "error",
            message: "Email is not registered",
          });
        }
      }
    } catch (error) {
      openNotification({
        status: "error",
        message: "An error occurred. Please try again.",
      });
    }
  };

  return (
    <>
      {contextHolder}
      <div
        style={{
          background: "#faf5f5",
          height: "100vh",
          width: "100%",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Col span={6}>
          <Card
            bordered={false}
            style={{ padding: "2rem", borderRadius: "25px" }}
          >
            <div>
              <img
                src="https://aivolved.in/wp-content/uploads/2022/11/ai-logo.png"
                style={{ height: "80px" }}
                alt="AI Logo"
              />
            </div>
            <p>
              <ArrowLeftOutlined
                style={{ fontSize: "1.5rem", cursor: "pointer" }}
                onClick={() => navigate("/login")}
              />
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <h2 style={{ margin: "0.5rem 0" }}>Enter Email</h2>
              <p>Reset link will be sent to the respective email id</p>
              <input
                type="email"
                style={{
                  height: "1.5rem",
                  width: "100%",
                  padding: "1.5rem",
                  border: "0.5px solid grey",
                  borderRadius: "5px",
                  outline: "none",
                }}
                name="email"
                placeholder="Email id"
                onChange={handleChange}
                value={resetPayload.email}
              />
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
            </div>
            <h2>
              <button
                style={{
                  padding: "1rem",
                  background: "#ff4403",
                  border: "none",
                  borderRadius: "5px",
                  color: "#fff",
                  fontWeight: "600",
                  fontSize: "1rem",
                  cursor: "pointer",
                }}
                onClick={confirmEmail}
              >
                Send Email
              </button>
            </h2>
          </Card>
        </Col>
      </div>
    </>
  );
};

export default ResetPasswordEmail;
