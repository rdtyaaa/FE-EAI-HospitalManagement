import React, { useState } from "react";
import AddMedicalRecordForm from "./AddMedicalRecordForm";
import MedicalRecordTable from "./MedicalRecordTable";

function MedicalRecord() {
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshRecords = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };

  return (
    <div>
      <AddMedicalRecordForm onMedicalRecordAdded={refreshRecords} />
      <MedicalRecordTable key={refreshKey} />
    </div>
  );
}

export default MedicalRecord;
