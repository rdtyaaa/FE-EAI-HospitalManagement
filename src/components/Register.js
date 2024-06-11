import React, { useState } from "react";

const RegisterForm = () => {
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nip = e.target.elements.nip.value;
    const name = e.target.elements.name.value;
    const password = e.target.elements.password.value;

    const data = {
      nip: nip,
      name: name,
      password: password,
    };

    try {
      const response = await fetch("/v1/user/it/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.status === 201) {
        setMessage("User registered successfully");
        setMessageColor("text-green-500");
      } else if (response.status === 409) {
        setMessage("NIP already exists");
        setMessageColor("text-red-500");
      } else {
        setMessage("Error: " + result.message);
        setMessageColor("text-red-500");
      }
    } catch (error) {
      setMessage("Server error");
      setMessageColor("text-red-500");
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-700 flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white shadow-md bg-gradient-to-l from-gray-600 to-gray-500 text-white">
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        <form id="register-form" onSubmit={handleSubmit}>
          <div className="mb-4">
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
          <div className="mb-4">
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
          <div className="mb-4">
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
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Register
          </button>
          <p id="message" className={`mt-4 ${messageColor}`}>
            {message}
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
