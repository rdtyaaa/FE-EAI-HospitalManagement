// ProtectedRoute.js
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { decodeToken } from "./jwtUtils";
import { renewToken } from "./renewToken";

const ProtectedRoute = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("accessToken"));

  useEffect(() => {
    const checkToken = async () => {
      try {
        const decodedToken = decodeToken(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.expires < currentTime) {
          try {
            const newToken = await renewToken();
            console.log("Token renewed:", newToken);
            localStorage.setItem("accessToken", newToken);
            setToken(newToken);
            window.location.reload();
          } catch (error) {
            console.error("Failed to renew token:", error);
            localStorage.clear();
            window.location.reload();
            if (error.response) {
              console.error("Error response status:", error.response.status);
              console.error("Error response data:", error.response.data);
              localStorage.clear();
              window.location.reload();
            }
          }
        }
      } catch (error) {
        console.error("Token decoding failed:", error);
      }
    };

    checkToken();

    const interval = setInterval(checkToken, 10000);

    return () => clearInterval(interval);
  }, [token]);

  return children ? children : <Outlet />; // Render children atau Outlet jika ada
};

export default ProtectedRoute;
