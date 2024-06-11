import React, { useEffect, useState } from "react";

const PatientRecordTable = () => {
  const [patientRecords, setPatientRecords] = useState([]);

  useEffect(() => {
    const fetchPatientRecords = async () => {
      try {
        const token = localStorage.getItem("accessToken"); // Mendapatkan token JWT dari penyimpanan lokal (localStorage)
        const response = await fetch(
          "http://127.0.0.1:5000/v1/medical/patient",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Menyertakan token JWT dalam header Authorization
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch patient records");
        }
        const data = await response.json();
        setPatientRecords(data.data);
      } catch (error) {
        console.error(error);
        setPatientRecords([]);
      }
    };

    fetchPatientRecords();
  }, []);
  return (
    <>
      <div className="p-4 sm:ml-64">
        <main className="container mx-auto p-4">
          {/* Daftar pasien medis */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2 text-white">
              Medical Patient List
            </h2>
            <table
              id="medical-patient-list"
              className="min-w-full bg-white border border-gray-300 rounded-md"
            >
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-gray-500">
                    Identity Number
                  </th>
                  <th className="py-2 px-4 border-b text-gray-500">
                    Phone Number
                  </th>
                  <th className="py-2 px-4 border-b text-gray-500">Name</th>
                  <th className="py-2 px-4 border-b text-gray-500">
                    Birth Date
                  </th>
                  <th className="py-2 px-4 border-b text-gray-500">Gender</th>
                  <th className="py-2 px-4 border-b text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patientRecords.map((record) => (
                  <tr key={record.identityNumber}>
                    <td>{record.identityNumber}</td>
                    <td>{record.phoneNumber}</td>
                    <td>{record.name}</td>
                    <td>{record.birthDate}</td>
                    <td>{record.gender}</td>
                    <td>{record.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </>
  );
};

export default PatientRecordTable;
