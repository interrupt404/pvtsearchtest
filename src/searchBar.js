import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi"; // 🔍 Importing magnifying glass icon
import "./SearchBar.scss";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      fetchSuggestions(query);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const fetchSuggestions = async (input) => {
    setLoading(true);
    const apiUrl = `${process.env.REACT_APP_SEARCH_API_URL}?query=${input}`;

    try {
      const response = await axios.get(apiUrl);
  
      // 🔹 Fix: Extract "response.data" instead of "suggestions"
      if (response.data?.response?.data?.length) {
        setSuggestions(response.data.response.data.map((item) => item.name));
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
    setLoading(false);
  };

  return (
    <div className="search-wrapper">
      <div className="search-container">
        <div className="search-bar">
          <FiSearch className="search-icon" /> {/* 🔍 Added magnifying glass */}
          <input
            type="text"
            placeholder="Search videos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {loading && <p className="loading">Loading...</p>}

        {suggestions.length > 0 && (
          <div className="suggestion-box">
            {suggestions.map((name, index) => (
              <div key={index} className="suggestion-item">
                <p className="title">{name}</p> {/* ✅ Only displays `name` */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
