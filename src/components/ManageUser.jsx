import React, { useState, useEffect } from "react"; // Import useNavigate from react-router-dom
import UserTable from "./UserTable";

const ManageUser = () => {
  return (
    <div className="p-4 ml-64 h-screen max-h-screen">
      <main className="container mx-auto p-4">
        <h1 className="text-3xl tracking-tight font-bold mb-2 text-white">
          User Management
        </h1>
        <section className="antialiased">
          <h2 className="text-xl font-semibold mb-2 text-gray-400">
            Manage User
          </h2>
          <UserTable />
        </section>
      </main>
    </div>
  );
};

export default ManageUser;
