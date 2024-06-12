import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import UserTable from "./UserTable";

const ManageUser = () => {
  const [accessToken, setAccessToken] = useState("");
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const navigate = useNavigate(); // Initialize useNavigate

  // Fungsi untuk memanggil API dan mendapatkan daftar pengguna
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://127.0.0.1:4000/v1/user/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUsers(response.data.data);
      setTotalUsers(response.data.total); // Mengambil jumlah total data dari response
    } catch (error) {
      console.error("Failed to fetch users:", error);
      // Jika token habis, arahkan pengguna kembali ke halaman login
      if (error.response && error.response.status === 401) {
        navigate("/login"); // Navigate to login page
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk mengatur token akses setelah komponen dimuat
  useEffect(() => {
    // Ambil token akses dari penyimpanan lokal atau sesuai kebutuhan Anda
    const token = localStorage.getItem("accessToken");
    if (token) {
      setAccessToken(token);
    } else {
      // Redirect ke halaman login jika token tidak tersedia
      navigate("/login"); // Navigate to login page
    }
  }, [navigate]);

  // Panggil API saat token berubah
  useEffect(() => {
    if (accessToken) {
      fetchUsers();
    }
  }, [accessToken]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 ml-64 h-screen max-h-screen">
      <main className="container mx-auto p-4">
        <h1 className="text-3xl tracking-tight font-bold mb-2 text-white">
          Nurse Management
        </h1>
        <section className="antialiased">
          <h2 className="text-xl font-semibold mb-2 text-gray-400">
            Manage Nurse
          </h2>
          <UserTable users={users} totalUsers={totalUsers} />
        </section>
      </main>
    </div>
  );
};

export default ManageUser;
