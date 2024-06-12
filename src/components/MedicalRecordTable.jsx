import React, { useEffect, useState } from "react";
import axios from "axios";

const MedicalRecordTable = () => {
  const [medicalRecords, setMedicalRecords] = useState([]);

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          "http://127.0.0.1:6060/v1/medical/record",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMedicalRecords(response.data.data);
      } catch (error) {
        console.error("Error fetching medical records:", error);
        setMedicalRecords([]);
      }
    };

    fetchMedicalRecords();
  }, []);

  return (
    <div className="p-4 sm:ml-64">
      <main className="container mx-auto p-4">
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-gray-400">
            Medical Record List
          </h2>
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg bg-gradient-to-tr from-gray-200 via-gray-100 via-15% to-slate-100">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-gray-700">
                    Identity Number
                  </th>
                  <th className="py-2 px-4 border-b text-gray-700">Symptoms</th>
                  <th className="py-2 px-4 border-b text-gray-700">
                    Medications
                  </th>
                  <th className="py-2 px-4 border-b text-gray-700">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody className="text-center">
                {medicalRecords.map((record) => (
                  <tr key={record.id}>
                    <td className="py-2 px-4 border-b text-gray-600">
                      {record.identityNumber}
                    </td>
                    <td className="py-2 px-4 border-b text-gray-600">
                      {record.symptoms}
                    </td>
                    <td className="py-2 px-4 border-b text-gray-600">
                      {record.medications}
                    </td>
                    <td className="py-2 px-4 border-b text-gray-600">
                      {new Date(record.createdAt).toLocaleString("en-US", {
                        hour12: true,
                        hour: "numeric",
                        minute: "numeric",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MedicalRecordTable;
