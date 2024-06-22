import React, { useEffect, useState } from "react";
import createAxiosInstance from "../JWTconfig/axiosConfig";
import { useNavigate } from "react-router-dom";

const MedicalRecordTable = () => {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const navigate = useNavigate();

  // Create axios instance with base URL
  const axiosInstance = React.useMemo(
    () => createAxiosInstance("http://127.0.0.1:6060/v1/"),
    []
  );

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        const response = await axiosInstance.get("/medical/record");
        setMedicalRecords(response.data.data);
      } catch (error) {
        console.error("Error fetching medical records:", error);
        setMedicalRecords([]);
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          navigate("/login");
        }
      }
    };

    fetchMedicalRecords();
  }, [axiosInstance, navigate]);

  return (
    <div className="p-4 sm:ml-64">
      <main className="container mx-auto p-4">
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-gray-400">
            Medical Record History
          </h2>
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg bg-gradient-to-tr from-gray-200 via-gray-100 to-slate-100">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-gray-700">Patient</th>
                  <th className="py-2 px-4 border-b text-gray-700">Symptoms</th>
                  <th className="py-2 px-4 border-b text-gray-700">
                    Medications
                  </th>
                  <th className="py-2 px-4 border-b text-gray-700">
                    Created At
                  </th>
                  <th className="py-2 px-4 border-b text-gray-700">
                    Created By
                  </th>
                </tr>
              </thead>
              <tbody className="text-center">
                {medicalRecords.map((record) => (
                  <React.Fragment key={record.id}>
                    <tr>
                      <td className="py-2 px-4 border-b text-gray-600">
                        {record.identityDetail && (
                          <div className="flex items-center">
                            <img
                              className="w-8 h-8 rounded-full mr-2"
                              src={record.identityDetail.identityCardScanImg}
                              alt="Profile"
                            />
                            <div className="text-left">
                              <p className="text-sm font-medium text-gray-900">
                                {record.identityDetail.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {record.identityDetail.identityNumber}
                              </p>
                            </div>
                          </div>
                        )}
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
                      <td className="py-2 px-4 border-b text-gray-600">
                        {record.createdBy
                          ? `${record.createdBy.name} (${record.createdBy.nip})`
                          : "Unknown"}
                      </td>
                    </tr>
                  </React.Fragment>
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
