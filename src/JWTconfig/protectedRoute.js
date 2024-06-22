// ProtectedRoute.js
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { decodeToken } from "./jwtUtils";
import { renewToken } from "./renewToken";

const ProtectedRoute = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("accessToken"));

  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        return; // Token kosong, tidak perlu cek lebih lanjut
      }
      try {
        const decodedToken = decodeToken(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.expires < currentTime) {
          try {
            const newToken = await renewToken(); // Memperbarui token
            console.log("Token renewed:", newToken);
            localStorage.setItem("accessToken", newToken); // Simpan token baru ke localStorage
            setToken(newToken); // Update state token jika perlu
            window.location.reload();
          } catch (error) {
            console.error("Failed to renew token:", error);
            if (error.response) {
              console.error("Error response status:", error.response.status);
              console.error("Error response data:", error.response.data);
            }
            // Tambahkan pesan error atau handle sesuai kebutuhan
          }
        }
      } catch (error) {
        console.error("Token decoding failed:", error);
        // Tambahkan pesan error atau handle sesuai kebutuhan
      }
    };

    checkToken(); // Panggil fungsi cek token saat komponen di-mount

    const interval = setInterval(checkToken, 10000); // Cek setiap 10 detik

    return () => clearInterval(interval); // Bersihkan interval saat komponen dilepas
  }, [token]); // Tergantung pada token untuk memicu useEffect

  return children ? children : <Outlet />; // Render children atau Outlet jika ada
};

export default ProtectedRoute;
