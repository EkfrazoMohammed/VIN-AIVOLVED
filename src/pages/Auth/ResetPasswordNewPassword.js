import React, { useState } from "react";
import { Link } from "react-router-dom";

const PasswordResetForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccessMessage] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Reset error state
    setError("");

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    // Call your API to reset the password
    // axios.post('/api/reset-password', { password })
    //   .then(response => {
    //     // Handle success
    //   })
    //   .catch(err => {
    //     // Handle error
    //   });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-4">
          <img
            src="https://aivolved.in/wp-content/uploads/2022/11/ai-logo.png"
            alt="Logo"
            style={{ height: "70px" }}
          />
        </div>
        <form
          onSubmit={handleSubmit}
          className="max-w-sm mx-auto p-4 bg-white rounded "
        >
          <h2 className="text-2xl font-bold text-center mb-4">
            Reset Password
          </h2>

          {error && <div className="text-red-500 mb-4">{error}</div>}
          {success && (
            <div className=" mb-4">
              <span className="text-green-500">Password reset successfully. Please login with new password.</span>
              <Link to={"/login"} className="text-blue-500 font-bold ml-2">Login</Link>
            </div>
          )}

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              New Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition-colors duration-300"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordResetForm;
