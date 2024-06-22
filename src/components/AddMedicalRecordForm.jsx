import React, { useState } from "react";
import createAxiosInstance from "../JWTconfig/axiosConfig";

const AddMedicalRecordForm = () => {
  const [identityNumber, setIdentityNumber] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [medications, setMedications] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const axiosInstance = createAxiosInstance("http://127.0.0.1:6060/v1/");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      // Validation
      if (!identityNumber || identityNumber.length !== 16) {
        throw new Error("Identity number must be 16 digits long.");
      }
      if (!symptoms || symptoms.length < 1 || symptoms.length > 2000) {
        throw new Error("Symptoms must be between 1 and 2000 characters.");
      }
      if (!medications || medications.length < 1 || medications.length > 2000) {
        throw new Error("Medications must be between 1 and 2000 characters.");
      }

      const response = await axiosInstance.post("/medical/record", {
        identityNumber: parseInt(identityNumber, 10), // Ensure identityNumber is sent as integer
        symptoms,
        medications,
      });

      if (response.status === 201) {
        setSubmitMessage("Medical record added successfully.");
        setIdentityNumber("");
        setSymptoms("");
        setMedications("");
        setTimeout(() => {
          window.location.reload(); // Reload page after 1 second
        }, 1000); // Adjust the timeout duration as needed
      } else {
        console.error("Failed to add medical record:", response.statusText);
        setSubmitMessage("Failed to add medical record.");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error("Validation error:", error.response.data.message);
        setSubmitMessage(error.response.data.message);
      } else if (error.response && error.response.status === 404) {
        console.error(
          "Identity number not found:",
          error.response.data.message
        );
        setSubmitMessage("Identity number not found.");
      } else if (error.response && error.response.status === 401) {
        console.error("Unauthorized:", error.response.data.message);
        setSubmitMessage("Unauthorized.");
      } else {
        console.error("Error adding medical record:", error.message);
        setSubmitMessage(
          "Error adding medical records.  Check the identity number, make sure it's registered!"
        );
      }
    } finally {
      setSubmitting(false);
    }
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
                onChange={(e) => setIdentityNumber(e.target.value)}
                autoComplete="off"
                required
              />
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
              disabled={submitting}
            >
              {submitting ? "Adding Medical Record..." : "Add Medical Record"}
            </button>
            {submitMessage && (
              <p className="mt-4 text-white">{submitMessage}</p>
            )}
          </form>
        </section>
      </main>
    </div>
  );
};

export default AddMedicalRecordForm;
