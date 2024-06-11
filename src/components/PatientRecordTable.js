import React, { useEffect, useState } from "react";

const PatientRecordTable = () => {
  const [patientRecords, setPatientRecords] = useState([]);

  useEffect(() => {
    const fetchPatientRecords = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(
          "http://127.0.0.1:5000/v1/medical/patient",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
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

  const formatBirthDate = (dateString) => {
    const options = { day: "2-digit", month: "long", year: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", options);
  };

  return (
    <div className="p-4 sm:ml-64">
      <main className="container mx-auto p-4">
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-white">
            Medical Patient List
          </h2>
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg bg-gradient-to-tr from-gray-200 via-gray-100 via-15% to-slate-100">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-gray-700">
                    Identity Number
                  </th>
                  <th className="py-2 px-4 border-b text-gray-700">
                    Phone Number
                  </th>
                  <th className="py-2 px-4 border-b text-gray-700">Name</th>
                  <th className="py-2 px-4 border-b text-gray-700">
                    Birth Date
                  </th>
                  <th className="py-2 px-4 border-b text-gray-700">Gender</th>
                  <th className="py-2 px-4 border-b text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {patientRecords.map((record) => (
                  <tr key={record.identityNumber}>
                    <td className="py-2 px-4 border-b text-gray-600">
                      {record.identityNumber}
                    </td>
                    <td className="py-2 px-4 border-b text-gray-600">
                      {record.phoneNumber}
                    </td>
                    <td className="py-2 px-4 border-b text-gray-600">
                      {record.name}
                    </td>
                    <td className="py-2 px-4 border-b text-gray-600">
                      {formatBirthDate(record.birthDate)}
                    </td>
                    <td className="py-2 px-4 border-b text-gray-600">
                      {record.gender}
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

export default PatientRecordTable;
