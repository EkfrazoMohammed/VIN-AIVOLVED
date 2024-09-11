import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../../API/axiosInstance";
import { encryptAES } from "../../redux/middleware/encryptPayloadUtils";
import { notification } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';


const PasswordResetForm = () => {
  const { id } = useParams(); // Capture the identifier from the route
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [success, setSuccessMessage] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [api] = notification.useNotification();
  const [error, setError] = useState("");
  const openNotification = (param) => {
    const { status, message } = param;
    api[status]({
      message: message || "",
      duration: 3, // Notification will auto-close after 3 seconds
    });
  };

  const validatePassword = (password) => {
    // Password validation criteria
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNoSpaces = !/\s/.test(password);

    if (password.length < minLength || !hasUpperCase || !hasLowerCase || !hasDigit || !hasSpecialChar || !hasNoSpaces) {
      return "Password must contain at least one special character, one number, one uppercase letter, one lowercase letter, and be at least 8 characters long.";
    }
    return "";
  };


  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    // Validate password and set error
    const passwordError = validatePassword(value);
    setPasswordError(passwordError);

    // // Check if confirm password is matching
    // if (value !== confirmPassword) {
    //   setConfirmPasswordError("Passwords do not match!");
    // } else {
    //   setConfirmPasswordError("");
    // }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    // Check if confirm password is matching
    if (password !== value) {
      setConfirmPasswordError("Passwords do not match!");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match!");
      return;
    }

    // Validate the new password
    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    try {
      // Call your API to reset the password
      const payload = {
        new_password: password,
        confirm_password: confirmPassword,
      };
      const encryptedData = encryptAES(JSON.stringify(payload));
      const response = await axiosInstance.put(`reset-password/${id}/`, { data: encryptedData });

      // Handle success
      if (response.status === 200) {
        setSuccessMessage(true);
        openNotification({
          status: "success",
          message: "Password updated successfully",
        });
        setPassword("");
        setConfirmPassword("");
        setPasswordError("");
        setConfirmPasswordError("");
      }
    } catch (err) {
      // Handle error
      setError("Failed to reset password. Please try again.");
      openNotification({
        status: "error",
        message: "Password not updated",
      });
    }
  };




  return (
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

      <div className="bg-white p-6 rounded-xl w-full max-w-md">
        <div className="flex justify-center mb-2">
          <img
            src="https://aivolved.in/wp-content/uploads/2022/11/ai-logo.png"
            alt="Logo"
            style={{ height: "60px" }}
          />
        </div>
        <div

          className="max-w-sm mx-auto p-1 bg-white rounded"
        >
          <h2 className="text-xl font-bold text-center mb-4">
            Reset Password
          </h2>

          {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}

          {
            success ?
              <div className="mb-4 text-center">
                <span className="text-green-500 text-lg font-bold">Password reset successfully. <br />Please login with new password.</span>
                <Link to={"/login"} className="text-blue-500 font-bold ml-2">Login</Link>
              </div>
              :
              <>

                <div className="mb-4 relative">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="password"
                  >
                    New Password
                  </label>
                  <input
                    id="password"
                    type={passwordVisible ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-9 right-0 pr-3 flex items-center h-[20px]"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? (
                      <EyeOutlined className="text-gray-500" />
                    ) : (
                      <EyeInvisibleOutlined className="text-gray-500" />
                    )}
                  </button>
                  {passwordError && <div className="text-red-500 mt-1 text-sm">{passwordError}</div>}
                </div>

                <div className="mb-4 relative">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="confirmPassword"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type={confirmPasswordVisible ? "text" : "password"}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-9 right-0 pr-3 flex items-center h-[20px]"
                    onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                  >
                    {confirmPasswordVisible ? (
                      <EyeOutlined className="text-gray-500" />
                    ) : (
                      <EyeInvisibleOutlined className="text-gray-500" />
                    )}
                  </button>
                  {confirmPasswordError && <div className="text-red-500 mt-1  text-sm">{confirmPasswordError}</div>}
                </div>
                {passwordError === "" || passwordError == null || confirmPasswordError === "" || confirmPasswordError == null ? <>
                  <button

                    onClick={handleSubmit}
                    type="submit"
                    className="w-full bg-[#ff4403] text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition-colors duration-300"
                  >
                    Reset Password
                  </button>
                </> : <>
                  <button
                    type="submit"
                    className="w-full bg-[#ff4403] text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition-colors duration-300"
                  >
                    Reset Password
                  </button>
                </>}
              </>
          }


        </div>

      </div>
    </div>
  );
};

export default PasswordResetForm;
