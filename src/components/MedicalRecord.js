import React from "react";

function MedicalRecord() {
  return (
    <>
      <div className="p-4 sm:ml-64">
        <main className="container mx-auto p-4">
          <h1 className="text-3xl tracking-tight font-bold mb-2 text-white">
            Medical Record Management
          </h1>
          {/* Formulir untuk menambahkan catatan medis baru */}
          <section className="mb-8">
            <h2 className="text-lg font-medium mb-2 text-gray-400">
              Add New Medical Record
            </h2>
            <form
              id="add-medical-record-form"
              className="bg-gradient-to-tr from-gray-600 via-gray-700 via-15% to-slate-600 p-6 rounded-lg shadow-md"
            >
              <div className="mb-4">
                <label htmlFor="identityNumber" className="block text-gray-300">
                  Identity Number
                </label>
                <input
                  type="text"
                  id="identityNumber"
                  name="identityNumber"
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required=""
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
                  required=""
                  defaultValue={""}
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
                  required=""
                  defaultValue={""}
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
          {/* Daftar catatan medis */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2 text-gray-400">
              Medical Record List
            </h2>
            <table className="min-w-full bg-white border border-gray-300 rounded-md">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-gray-500">
                    Identity Number
                  </th>
                  <th className="py-2 px-4 border-b text-gray-500">Symptoms</th>
                  <th className="py-2 px-4 border-b text-gray-500">
                    Medications
                  </th>
                  <th className="py-2 px-4 border-b text-gray-500">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody id="medical-record-list">
                {/* Daftar catatan medis akan diisi di sini */}
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </>
  );
}

export default MedicalRecord;
