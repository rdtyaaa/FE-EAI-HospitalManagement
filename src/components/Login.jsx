import React, { useState, useEffect } from "react";
import createAxiosInstance from "../JWTconfig/axiosConfig"; // Import Axios instance creator from axiosConfig.js
import { Link, Navigate, useNavigate } from "react-router-dom";
import { renewToken } from "../JWTconfig/renewToken"; // Import renewToken function

function Login() {
  const [userType, setUserType] = useState("it");
  const [nip, setNip] = useState("");
  const [password, setPassword] = useState("");
  const [nipError, setNipError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Use useNavigate hook to get navigation function

  // Create axios instance with base URL
  const axiosInstance = createAxiosInstance("http://127.0.0.1:3000/v1/");

  // Function to validate NIP prefix and set appropriate error message
  const validateNipPrefix = (inputNip) => {
    if (inputNip.startsWith("615")) {
      setUserType("it");
      setNipError("");
    } else if (inputNip.startsWith("303")) {
      setUserType("nurse");
      setNipError("");
    } else {
      setUserType("");
      setNipError("User not found or not from the correct department.");
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setNipError("");
    setPasswordError("");
    setLoading(true);

    validateNipPrefix(nip);

    try {
      let loginUrl = "";
      if (userType === "it") {
        loginUrl = "/user/admin/login";
        localStorage.setItem("userType", "it");
      } else if (userType === "nurse") {
        loginUrl = "/user/nurse/login";
        localStorage.setItem("userType", "nurse");
      }

      const response = await axiosInstance.post(
        loginUrl,
        { nip: parseInt(nip, 10), password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Response data:", response.data); // Log the response data

      if (response.status === 200) {
        const { data } = response.data;

        // Ensure accessToken exists and has a value before storing
        if (data.token.accessToken) {
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("accessToken", data.token.accessToken);
          localStorage.setItem("refreshToken", data.token.refreshToken);
          // Redirect to dashboard
          navigate("/dashboard");
          window.location.reload();
        } else {
          console.error(
            "Access token is undefined or null:",
            data.token.accessToken
          );
        }
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        console.log("Error response status:", status); // Log the error status
        console.log("Error response data:", data); // Log the error data

        if (status === 404) {
          setNipError("User not found");
        } else if (status === 400) {
          if (data.errors) {
            if (data.errors.nip) {
              setNipError(data.errors.nip);
            }
            if (data.errors.password) {
              setPasswordError(data.errors.password);
            }
          } else {
            setNipError("Validation error or incorrect password");
          }
        } else {
          setNipError("Server error, please try again later.");
        }
      } else {
        console.log("Network error:", error.message); // Log the network error
        setNipError("Network error, please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-700 flex items-center justify-center h-screen">
      <div className="w-full max-w-sm p-6 bg-white shadow-md bg-gradient-to-l from-gray-600 to-gray-500 text-white">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-2">
            <label htmlFor="nip" className="block mb-2">
              NIP
            </label>
            <input
              type="text"
              id="nip"
              className="w-full p-2 border text-black border-gray-300 rounded"
              value={nip}
              onChange={(e) => setNip(e.target.value)}
              required
            />
            {nipError && <p className="text-red-500 text-sm">{nipError}</p>}
          </div>
          <div className="mb-2">
            <label htmlFor="password" className="block mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-2 border text-black border-gray-300 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {passwordError && (
              <p className="text-red-500 text-sm">{passwordError}</p>
            )}
          </div>
          <button
            type="submit"
            className={`w-full bg-blue-500 text-white mt-4 p-2 rounded ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-2 text-sm text-gray-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-white hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
