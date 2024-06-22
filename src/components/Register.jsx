import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate(); // useNavigate hook untuk navigasi

  // Axios instance for API requests
  const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:3000/v1", // Replace with your actual API base URL
    headers: {
      "Content-Type": "application/json",
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nip = e.target.elements.nip.value;
    const name = e.target.elements.name.value;
    const password = e.target.elements.password.value;

    // Validate password confirmation
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageColor("text-red-500");
      return;
    }

    const data = {
      nip: nip,
      name: name,
      password: password,
    };

    try {
      const response = await axiosInstance.post("/v1/user/it/register", data);

      if (response.status === 201) {
        const { message, data } = response.data;
        setMessage(`User registered successfully. ${message}`);
        setMessageColor("text-green-500");

        // Redirect to login page after successful registration
        navigate("/login");
      } else {
        setMessage(`Error: ${response.data.message}`);
        setMessageColor("text-red-500");
      }
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        setMessage(`Error: ${error.response.data.message}`);
        setMessageColor("text-red-500");
      } else if (error.request) {
        // The request was made but no response was received
        setMessage("Server error. Please try again later.");
        setMessageColor("text-red-500");
      } else {
        // Something happened in setting up the request that triggered an Error
        setMessage("Error registering user. Please try again later.");
        setMessageColor("text-red-500");
      }
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-700 flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white shadow-md bg-gradient-to-l from-gray-600 to-gray-500 text-white">
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        <form id="register-form" onSubmit={handleSubmit}>
          <div className="mb-2">
            <label htmlFor="nip" className="block mb-2">
              NIP
            </label>
            <input
              type="text"
              id="nip"
              name="nip"
              className="w-full p-2 border text-black border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-2">
            <label htmlFor="name" className="block mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full p-2 border text-black border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-2">
            <label htmlFor="password" className="block mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full p-2 border text-black border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-2">
            <label htmlFor="confirmPassword" className="block mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="w-full p-2 border text-black border-gray-300 rounded"
              onChange={handleConfirmPasswordChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 mt-4 rounded"
          >
            Register
          </button>
          <p id="message" className={`mt-4 ${messageColor}`}>
            {message}
          </p>
          <p className="mt-2 text-gray-400 text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-white hover:underline">
              Login here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
