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
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => {
      if (name === "identityNumber") {
        const intValue = parseInt(value);
        return { ...prevValues, [name]: !isNaN(intValue) ? intValue : "" };
      } else if (name === "phoneNumber") {
        return {
          ...prevValues,
          [name]: value.startsWith("+62") ? value : "+62",
        };
      } else if (name === "birthDate") {
        const isoDate = new Date(value).toISOString().split("T")[0];
        return { ...prevValues, [name]: isoDate };
      } else {
        return { ...prevValues, [name]: value };
      }
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: files[0] }));
  };

  const validateForm = () => {
    const newErrors = {};
    const identityNumberRegex = /^\d{16}$/;
    const phoneNumberRegex = /^\+62\d{9,14}$/;
    const nameRegex = /^.{4,30}$/;
    const genderValues = ["male", "female"];

    if (
      !formValues.identityNumber ||
      !identityNumberRegex.test(formValues.identityNumber)
    ) {
      newErrors.identityNumber =
        "Identity Number is required and should be 16 digits.";
    }
    if (
      !formValues.phoneNumber ||
      !phoneNumberRegex.test(formValues.phoneNumber)
    ) {
      newErrors.phoneNumber =
        "Phone Number is required, should start with '+62', and should be between 10 and 15 characters.";
    }
    if (!formValues.name || !nameRegex.test(formValues.name)) {
      newErrors.name =
        "Name is required and should be between 3 and 30 characters.";
    }
    if (!formValues.birthDate || isNaN(Date.parse(formValues.birthDate))) {
      newErrors.birthDate =
        "Birth Date is required and should be in ISO 8601 format.";
    }
    if (!formValues.gender || !genderValues.includes(formValues.gender)) {
      newErrors.gender =
        "Gender is required and should be either 'male' or 'female'.";
    }
    if (!formValues.identityCardScanImg) {
      newErrors.identityCardScanImg = "Identity Card Scan Image is required.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    for (const key in formValues) {
      if (key === "birthDate") {
        formData.append(key, formValues[key] + "T00:00:00");
      } else {
        formData.append(key, formValues[key]);
      }
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/v1/medical/patient", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
        body: formData,
      });

      if (!response.ok) {
        const responseData = await response.json().catch(() => response.text());
        let errorMessage = "Failed to add patient record";
        if (typeof responseData === "string") {
          const newErrors = {};
          const errorMessages = responseData.split("\n");
          errorMessages.forEach((error) => {
            const keyMatch = error.match(/Key: '(.+?)'/);
            if (keyMatch) {
              const key = keyMatch[1].split(".").pop();
              newErrors[key] = error;
            }
          });
          setErrors(newErrors);
          errorMessage = responseData;
          throw new Error(errorMessage);
        } else if (responseData.message) {
          const newErrors = {};
          const errorMessages = responseData.message.split("\n");
          errorMessages.forEach((error) => {
            const keyMatch = error.match(/Key: '(.+?)'/);
            if (keyMatch) {
              const key = keyMatch[1].split(".").pop();
              newErrors[key] = error;
            }
          });
          setErrors(newErrors);
          errorMessage = responseData.message;
          throw new Error(errorMessage);
        }
      } else {
        const responseData = await response.json();
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
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 sm:ml-64">
      <main className="container mx-auto p-4">
        <h1 className="text-3xl tracking-tight font-bold mb-2 text-white">
          Manage Patient Record
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
                className="w-full p-2 border border-gray-300 rounded mt-1 text-gray-900"
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
                className="w-full p-2 border border-gray-300 rounded mt-1 text-gray-900"
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
                className="w-full p-2 border border-gray-300 rounded mt-1 text-gray-900"
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
                className="w-full p-2 border border-gray-300 rounded mt-1 text-gray-900"
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
                className="w-full p-2 border border-gray-300 rounded mt-1 text-gray-900"
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
                className="w-full border border-gray-300 bg-white rounded mt-1 text-gray-900"
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
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Patient"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default AddPatientRecordForm;
