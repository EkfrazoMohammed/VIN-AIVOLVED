import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import axiosInstance from "../../API/axiosInstance";
import { encryptAES } from "../../redux/middleware/encryptPayloadUtils";
import { notification } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

const PasswordResetForm = () => {
  const location = useLocation(); // Use location to access query parameters
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(null);
  const [isTokenExpired, setIsTokenExpired] = useState(false);
  const [isTokenMissing, setIsTokenMissing] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [error, setError] = useState("");

  // Extract token and ID from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const queryToken = queryParams.get('token');
  const queryId = location.pathname.split('/').filter(Boolean).pop(); // Get the last segment of the path

  const openNotification = (param) => {
    const { status, message } = param;
    api[status]({
      message: <div style={{ fontSize: "1.1rem", fontWeight: "600" , color:"#000"}}>{message}</div>,
      duration: 3, // Notification will auto-close after 3 seconds
    });
  };

  // Check Token Validity
  useEffect(() => {
    const validateToken = async () => {
      try {
        // Check if token exists
        if (!queryToken) {
          setIsTokenMissing(true);
          setError("Token is required");
          return;
        }

        const response = await axiosInstance.post(
          "https://hul.indusvision.ai/api/reset-link-validity/",
          { token: queryToken }
        );

        // Handle 200 response
        if (response.status === 200) {
          setIsTokenValid(true);
          setIsTokenExpired(false);
          setIsTokenMissing(false);
        }
      } catch (err) {
        // Handle error responses
        if (err.response) {
          if (err.response.status === 400) {
            // Check if it's an expired token
            if (err.response.data.expired === "True") {
              setIsTokenExpired(true);
              setError("Link has expired, please request a new one to reset your password.");
            } else {
              // It's a missing token
              setIsTokenMissing(true);
              setError(err.response.data.message || "Token is required");
            }
          } else {
            // Generic error
            setError("Reset link is invalid. Please request a new one.");
          }
        } else {
          // Network or other error
          // setError("Could not validate reset link. Please try again.");
          console.log("Could not validate reset link. Please try again.")
        }
        setIsTokenValid(false);
      }
    };

    validateToken();
  }, [queryToken]);
  
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

    if (confirmPassword !== value) {
      setConfirmPasswordError("Passwords do not match!");
    } else {
      setConfirmPasswordError("");
    }
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

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isTokenExpired) {
      setError("This reset link has expired. Please request a new one.");
      openNotification({ status: "error", message: "Token has expired. Request a new link." });
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match!");
      return;
    }

    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    try {
      const payload = { new_password: password, confirm_password: confirmPassword };
      const encryptedData = await encryptAES(JSON.stringify(payload));
      const response = await axiosInstance.put(`reset-password/${queryId}/`, { 
        data: encryptedData,
        params: { token: queryToken }
      });

      if (response.status === 200) {
        setSuccess(true);
        setIsTokenValid(false); // Expire the token after successful reset
        openNotification({ status: "success", message: "Password updated successfully" });
      }
    } catch (err) {
      setError("Failed to reset password. Please try again.");
      openNotification({ status: "error", message: "Password not updated" });
    }
  };

  // Determine if reset button should be enabled
  const isResetButtonEnabled = password !== "" && confirmPassword !== "" && passwordError === "" && confirmPasswordError === "";

  return (
    <div
      style={{
        background: "linear-gradient(-40deg, rgb(7, 34, 102), rgb(7, 34, 102))",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {contextHolder} {/* Add notification context holder */}

      <div className="bg-[#091128] p-6 rounded-xl w-full max-w-md">
        <div className="flex justify-center mb-2">
          <img
            src="https://eimkeia.stripocdn.email/content/guids/CABINET_8270216c780e362a1fbcd636b59c67ae376eb446dc5f95e17700b638b8c3f618/images/indus_logo_dev.png"
            alt="Logo"
            style={{ height: "60px" }}
          />
        </div>
        <div className="max-w-sm mx-auto p-1 rounded">
          <h2 className="text-xl font-bold text-center mb-4 text-white">
            Reset Password
          </h2>

          {error && <div className="text-red-500 mb-4 text-sm text-center">{error}</div>}

          {success ? (
            <div className="mb-4 text-center">
              <span className="text-green-500 text-lg font-bold">
                Password reset successfully. <br />Please login with new password.
              </span>
              <Link to={"/"} className="text-blue-500 font-bold ml-2">
                Login
              </Link>
            </div>
          ) : isTokenExpired ? (
            <div className="mb-4 text-center">
              <span className="text-red-500 text-lg font-bold">
                This reset link has expired. <br />Please request a new password reset.
              </span>
              <div className="mt-4">
                
                <Link to={"/login"} className="bg-gray-500 text-white font-bold py-2 px-4 rounded">
                  Login
                </Link>
              </div>
            </div>
          ) : isTokenMissing ? (
            <div className="mb-4 text-center">
              <span className="text-red-500 text-lg font-bold">
                Token is required. <br />Please request a password reset from the login page.
              </span>
              <div className="mt-4">
                <Link to={"/login"} className="bg-blue-500 text-white font-bold py-2 px-4 rounded">
                  Go to Login
                </Link>
              </div>
            </div>
          ) : isTokenValid === false && !isTokenExpired && !isTokenMissing ? (
            <div className="mb-4 text-center flex flex-col gap-2">
              <span className="text-red-500 text-lg font-bold">
              The reset password link has expired.  <br />Please request a new password reset link.
              </span>
              
                <Link to={"/login"} className="bg-[43996a] text-white font-bold py-2 px-4 rounded">
                  Login
                </Link>
              </div>
            
          ) : isTokenValid === true ? (
            <>
              <div className="mb-4 relative">
                <label
                  className="block text-white text-sm font-bold mb-2"
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
                  className="block text-white text-sm font-bold mb-2"
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
                {confirmPasswordError && <div className="text-red-500 mt-1 text-sm">{confirmPasswordError}</div>}
              </div>

              <button
                onClick={handleSubmit}
                type="submit"
                className={`w-full bg-[#43996a] text-white font-bold py-2 px-4 rounded transition-colors duration-300 ${isResetButtonEnabled ? "hover:bg-[#43996a]" : "opacity-70 cursor-not-allowed"
                  }`}
                disabled={!isResetButtonEnabled}
              >
                Reset Password
              </button>
            </>
          ) : (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#ff4403]"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordResetForm;