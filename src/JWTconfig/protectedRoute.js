import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    // Pastikan untuk mengubah waktu kadaluarsa yang ada di token jika diperlukan
    const decodedToken = parseJwt(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      localStorage.removeItem("accessToken");
      return <Navigate to="/login" replace />;
    }

    return children ? children : <Outlet />;
  } catch (error) {
    console.error("Failed to parse token:", error);
    localStorage.removeItem("accessToken");
    return <Navigate to="/login" replace />;
  }
};

// Fungsi sederhana untuk menguraikan token JWT (menggunakan contoh saja)
function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    throw new Error("Invalid token");
  }
}

export default ProtectedRoute;
