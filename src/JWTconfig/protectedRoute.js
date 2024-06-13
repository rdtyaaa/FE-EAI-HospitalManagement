import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  try {
    const decodedToken = jwtDecode(token);
    console.log(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      localStorage.removeItem("accessToken");
      return <Navigate to="/login" replace />;
    }

    return children ? children : <Outlet />;
  } catch (error) {
    console.error("Token decoding failed:", error);
    // If there's an error decoding the token, redirect to login
    localStorage.removeItem("accessToken");
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
