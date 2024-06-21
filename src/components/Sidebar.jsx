import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate(); // Using useNavigate instead of useHistory

  const handleLogout = () => {
    // Clear the user's token from storage
    localStorage.removeItem("isLoggedIn"); // or sessionStorage.removeItem('accessToken');

    // Navigate to login page or home page
    navigate("/login"); // Redirect to login page after logout
  };
  return (
    <>
      <button
        data-drawer-target="separator-sidebar"
        data-drawer-toggle="separator-sidebar"
        aria-controls="separator-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-white rounded-lg sm:hidden hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          />
        </svg>
      </button>
      <aside
        id="separator-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full grid px-3 py-4 overflow-y-auto bg-gradient-to-bt from-gray-900 via-slate-800 to-gray-800 dark:bg-gray-800">
          <div>
            <ul className="w-full">
              <li>
                <Link
                  to="/dashboard"
                  className="flex w-full items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-900 dark:hover:bg-gray-700 group"
                >
                  <svg
                    className="w-5 h-5 text-white transition duration-75 dark:text-gray-400 group-hover:text-white dark:group-hover:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 21"
                  >
                    <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                    <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                  </svg>
                  <span className="ms-3 text-sm">Home</span>
                </Link>
              </li>
              {/* <li>
                <Link
                  to="/search"
                  className="flex w-full items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-900 dark:hover:bg-gray-700 group"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6"
                  >
                    <path d="M8.25 10.875a2.625 2.625 0 1 1 5.25 0 2.625 2.625 0 0 1-5.25 0Z" />
                    <path
                      fillRule="evenodd"
                      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.125 4.5a4.125 4.125 0 1 0 2.338 7.524l2.007 2.006a.75.75 0 1 0 1.06-1.06l-2.006-2.007a4.125 4.125 0 0 0-3.399-6.463Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ms-2 text-sm">Search</span>
                </Link>
              </li> */}
            </ul>
            <ul className="py-4 mt-4 space-y-2 border-y border-gray-200 dark:border-gray-700">
              <li>
                <Link
                  to="/manage/nurse"
                  className="flex w-full items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-900 dark:hover:bg-gray-700 group"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ms-2 text-sm">Manage User</span>
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  className="flex items-center w-full p-2 text-base text-white transition duration-75 rounded-lg group hover:bg-gray-900 dark:text-white dark:hover:bg-gray-700"
                  aria-controls="dropdown-example"
                  data-collapse-toggle="dropdown-example"
                >
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-white transition duration-75 dark:text-gray-400 group-hover:text-white dark:group-hover:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 20"
                  >
                    <path d="M16 14V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v15a3 3 0 0 0 3 3h12a1 1 0 0 0 0-2h-1v-2a2 2 0 0 0 2-2ZM4 2h2v12H4V2Zm8 16H3a1 1 0 0 1 0-2h9v2Z" />
                  </svg>
                  <span className="flex-1 text-sm ms-3 text-left rtl:text-right whitespace-nowrap">
                    Manage Report
                  </span>
                  <svg
                    className="w-2 h-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="m1 1 4 4 4-4"
                    />
                  </svg>
                </button>
                <ul id="dropdown-example" className="hidden py-2 space-y-2">
                  <li>
                    <Link
                      to="/manage/patient"
                      className="flex text-sm items-center w-full p-2 text-white transition duration-75 rounded-lg pl-11 group hover:bg-gray-900 dark:text-white dark:hover:bg-gray-700"
                    >
                      Patient Record
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/manage/medical"
                      className="flex text-sm items-center w-full p-2 text-white transition duration-75 rounded-lg pl-11 group hover:bg-gray-900 dark:text-white dark:hover:bg-gray-700"
                    >
                      Medical Record
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
            <button
              id="logout-button"
              className="text-white hover:text-red-500 mt-4"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
