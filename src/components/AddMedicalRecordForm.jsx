import React, { useState, useEffect } from "react";
import createAxiosInstance from "../JWTconfig/axiosConfig";

const AddMedicalRecordForm = () => {
  const [identityNumber, setIdentityNumber] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [medications, setMedications] = useState("");
  const [patientOptions, setPatientOptions] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const axiosInstance = createAxiosInstance("http://127.0.0.1:5000/v1/");

  useEffect(() => {
    if (identityNumber.trim() !== "") {
      fetchPatients();
    } else {
      setPatientOptions([]);
    }
  }, [identityNumber]);

  const fetchPatients = async () => {
    try {
      const parsedNumber = parseInt(identityNumber);
      const response = await axiosInstance.get(
        `/medical/patient?identityNumber=${parsedNumber}`
      );
      if (response.status === 200) {
        setPatientOptions(response.data.data);
      } else {
        console.error("Failed to fetch patients:", response.statusText);
        setPatientOptions([]);
      }
    } catch (error) {
      console.error("Error fetching patients:", error.message);
      setPatientOptions([]);
    }
  };

  const handleIdentityNumberChange = (event) => {
    setIdentityNumber(event.target.value);
    setSelectedPatient(null); // Reset selected patient when identity number changes
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setIdentityNumber(patient.identityNumber);
    setPatientOptions([]); // Clear dropdown options after selecting a patient
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform submission logic here
    console.log("Form submitted:", {
      identityNumber,
      symptoms,
      medications,
    });
    // Reset form fields
    setIdentityNumber("");
    setSymptoms("");
    setMedications("");
    setSelectedPatient(null);
  };

  return (
    <div className="p-4 sm:ml-64">
      <main className="container mx-auto p-4">
        <h1 className="text-3xl tracking-tight font-bold mb-2 text-white">
          Manage Medical Record
        </h1>
        <section className="mb-8">
          <h2 className="text-lg font-medium mb-2 text-gray-400">
            Add New Medical Record
          </h2>
          <form
            id="add-medical-record-form"
            className="bg-gradient-to-tr from-gray-600 via-gray-700 via-15% to-slate-600 p-6 rounded-lg shadow-md"
            onSubmit={handleSubmit}
          >
            <div className="mb-4">
              <label htmlFor="identityNumber" className="block text-gray-300">
                Identity Number
              </label>
              <input
                type="number"
                id="identityNumber"
                name="identityNumber"
                className="w-full p-2 border border-gray-300 rounded mt-1"
                value={identityNumber}
                onChange={handleIdentityNumberChange}
                autoComplete="off" // Disable browser autocomplete
                required
              />
              {patientOptions.length > 0 && (
                <div className="mt-1 bg-white rounded-lg shadow-lg">
                  {patientOptions.map((patient) => (
                    <div
                      key={patient.id}
                      className="cursor-pointer p-2 hover:bg-gray-100"
                      onClick={() => handlePatientSelect(patient)}
                    >
                      {patient.name} - {patient.identityNumber}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="symptoms" className="block text-gray-300">
                Symptoms
              </label>
              <textarea
                id="symptoms"
                name="symptoms"
                className="w-full p-2 border border-gray-300 rounded mt-1"
                rows={4}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="medications" className="block text-gray-300">
                Medications
              </label>
              <textarea
                id="medications"
                name="medications"
                className="w-full p-2 border border-gray-300 rounded mt-1"
                rows={4}
                value={medications}
                onChange={(e) => setMedications(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
            >
              Add Medical Record
            </button>
            <p id="add-medical-record-message" className="mt-4" />
          </form>
        </section>
      </main>
    </div>
  );
};

export default AddMedicalRecordForm;
