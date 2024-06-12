import React, { useState } from "react";
import { Button, TextInput } from "flowbite-react";

function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    // Implement search functionality here
    // This is a placeholder URL; replace it with your actual search endpoint
    const response = await fetch(
      `http://127.0.0.1:6000/v1/search?q=${searchQuery}`
    );
    const data = await response.json();
    setSearchResults(data.results);
    console.log("Search results:", data.results);
  };

  return (
    <div className="p-4 sm:ml-64">
      <main className="container mx-auto p-4">
        <h1 className="text-3xl tracking-tight font-bold mb-2 text-white">
          Search Medical and Patient Records
        </h1>
        <section className="mb-8"></section>
      </main>
    </div>
  );
}

export default SearchPage;
