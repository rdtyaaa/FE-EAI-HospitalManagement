import React, { useState } from "react";

const AddPatientRecordForm = ({ onPatientAdded }) => {
  const [formValues, setFormValues] = useState({
    identityNumber: "",
    phoneNumber: "+62",
    name: "",
    birthDate: "",
    gender: "",
    identityCardScanImg: null,
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input "${name}" changed:`, value);
    if (name === "identityNumber") {
      const intValue = parseInt(value);
      if (!isNaN(intValue)) {
        setFormValues({ ...formValues, [name]: intValue });
      } else {
        setFormValues({ ...formValues, [name]: "" }); // Reset to empty string if parsing fails
      }
    } else if (name === "phoneNumber") {
      // Make sure the phone number always starts with "+62"
      if (value.startsWith("+62")) {
        setFormValues({ ...formValues, [name]: value });
      } else {
        setFormValues({ ...formValues, [name]: "+62" });
      }
    } else if (name === "birthDate") {
      const isoDate = new Date(value).toISOString().split("T")[0];
      setFormValues({ ...formValues, [name]: isoDate });
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    console.log(`File input "${name}" changed:`, files[0]);
    setFormValues({ ...formValues, [name]: files[0] });
  };

  const validateForm = () => {
    console.log("Validating form...");
    const newErrors = {};
    if (!formValues.identityNumber) {
      newErrors.identityNumber = "Identity Number is required.";
    }
    if (!formValues.phoneNumber) {
      newErrors.phoneNumber = "Phone Number is required.";
    }
    if (!formValues.name) {
      newErrors.name = "Name is required.";
    }
    if (!formValues.birthDate) {
      newErrors.birthDate = "Birth Date is required.";
    }
    if (!formValues.gender) {
      newErrors.gender = "Gender is required.";
    }
    if (!formValues.identityCardScanImg) {
      newErrors.identityCardScanImg = "Identity Card Scan Image is required.";
    }
    console.log("Validation errors:", newErrors);
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted, validating...");
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      console.log("Validation failed, errors:", validationErrors);
      setErrors(validationErrors);
      return;
    }

    const formData = new FormData();
    for (const key in formValues) {
      if (key === "birthDate") {
        // Add time to the birthDate
        const isoBirthDate = formValues[key] + "T00:00:00";
        formData.append(key, isoBirthDate);
      } else {
        formData.append(key, formValues[key]);
      }
    }

    // Log form values for debugging
    console.log("Form Values:", Object.fromEntries(formData));

    try {
      const response = await fetch("http://127.0.0.1:5000/v1/medical/patient", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = "Failed to add patient record";
        let responseData = {};
        try {
          responseData = await response.json();
          if (responseData.errors) {
            errorMessage = responseData.errors;
          }
        } catch (error) {
          console.error("Error parsing response data:", error);
        }
        console.error("Failed to add patient record:", errorMessage);
        setErrors(responseData.errors || { form: errorMessage });
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setMessage("Patient record added successfully");
      onPatientAdded();
      setFormValues({
        identityNumber: "",
        phoneNumber: "+62",
        name: "",
        birthDate: "",
        gender: "",
        identityCardScanImg: null,
      });
      setErrors({});
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage("Failed to add patient record");
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
            Add New Medical Patient
          </h2>
          <form
            id="add-medical-patient-form"
            className="bg-gradient-to-tr from-gray-600 via-gray-700 via-15% to-slate-600 p-6 rounded-lg shadow-md"
            onSubmit={handleSubmit}
          >
            <div className="mb-4">
              <label htmlFor="identityNumber" className="block text-gray-300">
                Identity Number
              </label>
              <input
                type="text"
                id="identityNumber"
                name="identityNumber"
                value={formValues.identityNumber}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
              {errors.identityNumber && (
                <p className="text-red-500 text-sm">{errors.identityNumber}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block text-gray-300">
                Phone Number
              </label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formValues.phoneNumber}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-300">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="birthDate" className="block text-gray-300">
                Birth Date
              </label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                value={formValues.birthDate}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
              {errors.birthDate && (
                <p className="text-red-500 text-sm">{errors.birthDate}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="gender" className="block text-gray-300">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formValues.gender}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm">{errors.gender}</p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="identityCardScanImg"
                className="block text-gray-300"
              >
                Identity Card Scan Image
              </label>
              <input
                type="file"
                id="identityCardScanImg"
                name="identityCardScanImg"
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
              {errors.identityCardScanImg && (
                <p className="text-red-500 text-sm">
                  {errors.identityCardScanImg}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
            >
              Add Patient
            </button>
            <p id="add-patient-message" className="mt-4">
              {message}
            </p>
          </form>
        </section>
      </main>
    </div>
  );
};

export default AddPatientRecordForm;
