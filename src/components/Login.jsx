import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

function Login() {
  const [userType, setUserType] = useState("it");
  const [nip, setNip] = useState("");
  const [password, setPassword] = useState("");
  const [nipError, setNipError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setNipError(""); // Clear previous errors
    setPasswordError(""); // Clear previous errors
    setLoading(true);

    let loginUrl = "";
    if (userType === "it") {
      loginUrl = "http://127.0.0.1:3000/v1/user/admin/login";
    } else if (userType === "nurse") {
      loginUrl = "http://127.0.0.1:3000/v1/user/nurse/login";
    }

    try {
      const response = await axios.post(
        loginUrl,
        { nip: parseInt(nip, 10), password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        const accessToken = response.data.data.accessToken;
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("accessToken", accessToken);
        window.location.href = "/dashboard";
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setNipError("User not found or not from the correct department.");
        } else if (error.response.status === 400) {
          if (error.response.data.errors) {
            if (error.response.data.errors.nip) {
              setNipError(error.response.data.errors.nip);
            }
            if (error.response.data.errors.password) {
              setPasswordError(error.response.data.errors.password);
            }
          } else {
            setNipError("Validation error or incorrect password");
          }
        } else {
          setNipError("Server error, please try again later.");
        }
      } else {
        alert("Network error, please try again later.");
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
          <div className="mb-4">
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
          <div className="mb-4">
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
            className={`w-full bg-blue-500 text-white p-2 rounded ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-white">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
