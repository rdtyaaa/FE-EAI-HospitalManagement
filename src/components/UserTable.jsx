import React, { useEffect, useState } from "react";
import createAxiosInstance from "../JWTconfig/axiosConfig";

const UserTable = () => {
  const axiosInstance = React.useMemo(
    () => createAxiosInstance("http://127.0.0.1:4000/v1/"),
    []
  );

  const [nurseData, setNurseData] = useState({
    id: "",
    name: "",
    nip: "",
    password: "",
    identityCardScanImg: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({}); // Ensure this matches expected structure

  const [users, setUsers] = useState([]);

  // State for modal visibility
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isGiveAccessModalOpen, setIsGiveAccessModalOpen] = useState(false);

  const accessToken = localStorage.getItem("accessToken");

  const [isItChecked, setIsItChecked] = useState(false);
  const [isNurseChecked, setIsNurseChecked] = useState(false);

  // Function to open and close modals
  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const openDeleteModal = (user) => {
    setNurseData({
      id: user.userId,
      nip: user.nip,
    });
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const openGiveAccessModal = (user) => {
    setNurseData({
      id: user.userId,
      nip: user.nip,
    });
    setIsGiveAccessModalOpen(true);
  };

  const closeGiveAccessModal = () => setIsGiveAccessModalOpen(false);

  const openEditModal = (user) => {
    setNurseData({
      id: user.userId,
      name: user.name,
      nip: user.nip,
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => setIsEditModalOpen(false);

  const [searchType, setSearchType] = useState("name"); // Default search type is "name"
  const [searchValue, setSearchValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Function to handle nurse creation
  const handleCreateNurse = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", nurseData.name);
      formData.append("nip", nurseData.nip);
      formData.append("password", nurseData.password);
      formData.append("identityCardScanImg", nurseData.identityCardScanImg);

      const response = await axiosInstance.post(
        "/user/nurse/register",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Nurse added successfully:", response.data);
      closeCreateModal();
      setIsLoading(false);
      window.location.reload(); // Consider using state updates instead of reload
    } catch (error) {
      handleAxiosError(error);
    }
  };

  // Function to handle nurse edition
  const handleEditNurse = async (event) => {
    event.preventDefault();

    try {
      const response = await axiosInstance.put(`/user/nurse/${nurseData.id}`, {
        name: nurseData.name,
        nip: nurseData.nip,
      });

      console.log("Nurse updated successfully:", response.data);
      closeEditModal();
      window.location.reload(); // Consider using state updates instead of reload
    } catch (error) {
      handleAxiosError(error);
    }
  };

  // Function to handle granting access
  const handleGiveAccess = async (event) => {
    event.preventDefault();
    if (validatePasswords()) {
      try {
        const response = await axiosInstance.post(
          `/user/nurse/${nurseData.id}/access`,
          { password: nurseData.password }
        );

        console.log("Access granted successfully:", response.data);
        closeGiveAccessModal();
      } catch (error) {
        handleAxiosError(error);
      }
    } else {
      console.error("Validation failed");
    }
  };

  // Function to handle nurse deletion
  const handleDelete = async (event) => {
    event.preventDefault();

    try {
      const response = await axiosInstance.delete(
        `/user/nurse/${nurseData.id}`
      );

      console.log("Nurse deleted successfully:", response.data);
      window.location.reload(); // Consider using state updates instead of reload
    } catch (error) {
      handleAxiosError(error);
    }
  };

  // Function to handle input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setNurseData({
      ...nurseData,
      [name]: value,
    });
  };

  const handleSearchTypeChange = (type) => {
    setSearchType(type);
  };

  // Function to handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    setNurseData({
      ...nurseData,
      identityCardScanImg: file,
    });
  };

  // Function to validate passwords
  const validatePasswords = () => {
    let tempErrors = {};
    if (nurseData.password !== nurseData.reenterPassword) {
      tempErrors.reenterPassword = "Passwords do not match";
    }
    if (nurseData.password.length < 5 || nurseData.password.length > 33) {
      tempErrors.password = "Password must be between 5 and 33 characters";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Function to format date
  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Function to fetch users
  const fetchUsers = async () => {
    try {
      let params = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      if (isItChecked && !isNurseChecked) {
        params.params = {
          ...params.params,
          role: "admin",
        };
      } else if (isNurseChecked && !isItChecked) {
        params.params = {
          ...params.params,
          role: "nurse",
        };
      }

      if (searchValue.trim() !== "") {
        params.params = {
          ...params.params,
          [searchType]: searchValue.trim(),
        };
      }

      const response = await axiosInstance.get("/user", params);
      console.log("Request URL:", response.config.url);
      console.log("Request params:", response.config.params);

      setUsers(response.data.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    window.initFlowbite(); // Assuming this is a function to initialize some UI library
    fetchUsers(); // Fetch users on component mount

    const handleClickOutside = (event) => {
      const dropdown = document.getElementById("dropdown");
      const dropdownButton = document.getElementById("dropdown-button");

      if (
        dropdown &&
        dropdownButton &&
        !dropdown.contains(event.target) &&
        !dropdownButton.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [isItChecked, isNurseChecked, searchValue]);

  // Helper function to handle axios errors
  const handleAxiosError = (error) => {
    console.error("Axios error:", error);
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      setErrors(error.response.data.message);
    } else if (error.request) {
      console.error("No response received from server");
      setErrors("No response received from server");
    } else {
      console.error("Error:", error.message);
      setErrors("Error: " + error.message);
    }
    setIsLoading(false);

    const handleSearchTypeChange = (type) => {
      setSearchType(type);
    };
  };

  return (
    <>
      <section className="antialiased">
        <div className="max-w-screen-xl">
          {/* Start coding here */}
          <div className="dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden bg-gradient-to-tr from-gray-600 via-gray-700 via-15% to-slate-600">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
              <div className="w-full md:w-1/2">
                <form className="w-full max-w-lg whitespace-nowrap">
                  <div className="flex w-full relative">
                    <button
                      id="dropdown-button"
                      className="flex items-center py-2.5 px-4 text-sm font-medium text-center bg-gray-100 border border-gray-300 rounded-s-lg text-gray-500"
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      {`Search By ${searchType === "name" ? "Name" : "NIP"}`}
                      <svg
                        className="w-2.5 h-2.5 ms-2.5 text-gray-500"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 10 6"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m1 1 4 4 4-4"
                        />
                      </svg>
                    </button>
                    <div
                      id="dropdown"
                      className={`${
                        isDropdownOpen ? "" : "hidden"
                      } z-10 absolute top-full mt-1 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}
                    >
                      <ul
                        className="py-2 text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="dropdown-button"
                      >
                        <li>
                          <button
                            type="button"
                            className={`inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white ${
                              searchType === "name"
                                ? "font-medium text-gray-900"
                                : ""
                            }`}
                            onClick={() => {
                              handleSearchTypeChange("name");
                              setIsDropdownOpen(false);
                            }}
                          >
                            Name
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            className={`inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white ${
                              searchType === "nip"
                                ? "font-medium text-gray-900"
                                : ""
                            }`}
                            onClick={() => {
                              handleSearchTypeChange("nip");
                              setIsDropdownOpen(false);
                            }}
                          >
                            NIP
                          </button>
                        </li>
                      </ul>
                    </div>
                    <input
                      type="search"
                      id="search-dropdown"
                      className="block py-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300"
                      placeholder={`Search by ${
                        searchType === "name" ? "Name" : "NIP"
                      }`}
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      required
                    />
                  </div>
                </form>
              </div>
              <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                <button
                  type="button"
                  id="createProductModalButton"
                  className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                  onClick={openCreateModal}
                >
                  <svg
                    className="h-3.5 w-3.5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      clipRule="evenodd"
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    />
                  </svg>
                  Add Nurse
                </button>
                <div className="relative flex items-center space-x-3 w-full md:w-auto">
                  <button
                    id="filterDropdownButton"
                    data-dropdown-toggle="filterDropdown"
                    className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    type="button"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      className="h-4 w-4 mr-2 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Filter
                    <svg
                      className="-mr-1 ml-1.5 w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        clipRule="evenodd"
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      />
                    </svg>
                  </button>
                  <div
                    id="filterDropdown"
                    className="hidden absolute z-10 w-56 p-3 bg-white rounded-lg shadow dark:bg-gray-700"
                  >
                    <h6 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                      Role
                    </h6>
                    <ul
                      className="space-y-2 text-sm"
                      aria-labelledby="filterDropdownButton"
                    >
                      <li className="flex items-center">
                        <input
                          id="it"
                          type="checkbox"
                          checked={isItChecked}
                          onChange={(e) => {
                            setIsItChecked(e.target.checked);
                          }}
                          className="w-4 h-4 rounded bg-gray-100 border-gray-300 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        />
                        <label
                          htmlFor="it"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                        >
                          IT
                        </label>
                      </li>
                      <li className="flex items-center">
                        <input
                          id="nurse"
                          type="checkbox"
                          checked={isNurseChecked}
                          onChange={(e) => {
                            setIsNurseChecked(e.target.checked);
                          }}
                          className="w-4 h-4 rounded bg-gray-100 border-gray-300 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        />
                        <label
                          htmlFor="nurse"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                        >
                          Nurse
                        </label>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-700 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-4 py-4 text-gray-100">
                      NIP
                    </th>
                    <th scope="col" className="px-4 py-3 text-gray-100">
                      Name
                    </th>
                    <th scope="col" className="px-4 py-3 text-gray-100">
                      Created at
                    </th>
                    <th scope="col" className="px-4 py-3 text-gray-100">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.userId} className="border-b border-gray-400">
                      <td className="px-4 py-2 text-gray-300">{user.nip}</td>
                      <td className="px-4 py-2 text-gray-300">{user.name}</td>
                      <td className="px-4 py-2 text-gray-300">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-4 py-3 flex items-center justify-end">
                        {String(user.nip).startsWith("303") && (
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              className="flex items-center p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition duration-300"
                              onClick={() => openGiveAccessModal(user)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-4 h-4"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M15.75 1.5a6.75 6.75 0 0 0-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 0 0-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 0 0 .75-.75v-1.5h1.5A.75.75 0 0 0 9 19.5V18h1.5a.75.75 0 0 0 .53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1 0 15.75 1.5Zm0 3a.75.75 0 0 0 0 1.5A2.25 2.25 0 0 1 18 8.25a.75.75 0 0 0 1.5 0 3.75 3.75 0 0 0-3.75-3.75Z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {/* Give Access */}
                            </button>

                            <button
                              type="button"
                              className="flex items-center p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition duration-300"
                              onClick={() => openEditModal(user)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-4 h-4"
                              >
                                <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                                <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                              </svg>
                              {/* Edit */}
                            </button>

                            <button
                              type="button"
                              className="flex items-center p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition duration-300"
                              onClick={() => openDeleteModal(user)}
                              //   onClick={() => handleDelete(user.id)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-4 h-4"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {/* Delete */}
                            </button>
                          </div>
                        )}
                        {String(user.nip).startsWith("615") && (
                          <div className="py-4"></div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <nav
              className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
              aria-label="Table navigation"
            >
              <span className="text-sm font-normal text-gray-300 dark:text-gray-400">
                Showing
                <span className="font-semibold px-2 text-white dark:text-white">
                  {users.length}
                </span>
              </span>
            </nav>
          </div>
        </div>
      </section>
      {/* End block */}
      {/* Create modal */}
      {isCreateModalOpen && (
        <div
          id="createProductModal"
          tabIndex={-1}
          aria-hidden="true"
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full p-4 overflow-x-hidden overflow-y-auto h-modal md:h-full bg-black bg-opacity-30"
        >
          <div className="relative p-4 w-full max-w-2xl max-h-full">
            {/* Modal content */}
            <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
              {/* Modal header */}
              <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Add Nurse
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={closeCreateModal}
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              {/* Modal body */}
              <form onSubmit={handleCreateNurse} encType="multipart/form-data">
                <div className="grid gap-4 mb-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={nurseData.name}
                      onChange={handleInputChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Type Nurse name"
                      required=""
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="nip"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      NIP
                    </label>
                    <input
                      type="number"
                      name="nip"
                      id="nip"
                      value={nurseData.nip}
                      onChange={handleInputChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Type Nurse NIP"
                      required=""
                    />
                  </div>
                  {/* <div className="sm:col-span-2">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={nurseData.password}
                    onChange={handleInputChange}
                    className="bg-gray-50 border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full px-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    required=""
                  />
                </div> */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="identity-card"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Identity Card
                    </label>
                    <input
                      type="file"
                      name="identity-card"
                      id="identity-card"
                      onChange={handleFileUpload}
                      className="bg-gray-50 border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full px-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      required=""
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="text-white inline-flex items-center bg-blue-500 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm py-3 w-full justify-center text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  disabled={isLoading} // Men-disable tombol saat isLoading true
                >
                  {isLoading ? <>Adding...</> : <>Add Nurse</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Update modal */}
      {isEditModalOpen && (
        <div
          id="updateProductModal"
          aria-hidden="true"
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full p-4 overflow-x-hidden overflow-y-auto h-modal md:h-full bg-black bg-opacity-30"
        >
          <div className="relative w-full h-full max-w-2xl md:h-auto">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Update Nurse
                </h3>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <form onSubmit={handleEditNurse}>
                <div className="p-6 space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={nurseData.name} // Pastikan nurseData.name sesuai dengan data yang sedang diedit
                      onChange={handleInputChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="nip"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      NIP
                    </label>
                    <input
                      type="text"
                      id="nip"
                      name="nip"
                      value={nurseData.nip}
                      onChange={handleInputChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      disabled
                    />
                  </div>
                </div>
                <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                  <button
                    type="submit"
                    className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Read modal */}
      {isGiveAccessModalOpen && (
        <div
          id="giveAccessModal"
          tabIndex={-1}
          aria-hidden="true"
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full p-4 overflow-x-hidden overflow-y-auto h-modal md:h-full bg-black bg-opacity-30"
        >
          <div className="relative p-4 w-full max-w-xl max-h-full">
            {/* Modal content */}
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Give Access Nurse
                </h3>
                <button
                  type="button"
                  onClick={closeGiveAccessModal}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <form onSubmit={handleGiveAccess}>
                <div className="p-6 space-y-6">
                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={nurseData.password}
                      onChange={handleInputChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="reenterPassword"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Re-enter Password
                    </label>
                    <input
                      type="password"
                      id="reenterPassword"
                      name="reenterPassword"
                      value={nurseData.reenterPassword}
                      onChange={handleInputChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                    {errors.reenterPassword && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.reenterPassword}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                  <button
                    type="submit"
                    className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Give Access
                  </button>
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Delete modal */}
      {isDeleteModalOpen && (
        <div
          id="deleteModal"
          tabIndex={-1}
          aria-hidden="true"
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full p-4 overflow-x-hidden overflow-y-auto h-modal md:h-full bg-black bg-opacity-30"
        >
          <div className="relative p-4 w-full max-w-md max-h-full">
            {/* Modal content */}
            <div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
              <button
                type="button"
                className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={closeDeleteModal}
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <svg
                className="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="mb-1 text-gray-500 dark:text-gray-300">
                Are you sure you want to delete this item?
              </p>
              <p className="text-gray-800 mb-4 text-sm">NIP: {nurseData.nip}</p>
              <form onSubmit={handleDelete}>
                <div className="flex justify-center items-center space-x-4">
                  <button
                    type="button"
                    className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                  >
                    No, cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900"
                  >
                    Yes, I'm sure
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserTable;
