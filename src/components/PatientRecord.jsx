import React, { useState } from "react";
import PatientRecordTable from "./PatientRecordTable";
import AddPatientRecordForm from "./AddPatientRecordForm";

const PatientRecord = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshRecords = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };

  return (
    <div className="p-4 sm:ml-64">
      <AddPatientRecordForm onPatientAdded={refreshRecords} />
      <PatientRecordTable key={refreshKey} />
    </div>
  );
};

export default PatientRecord;
