import React, { createContext, useState, useContext } from "react";

// Create the context
const SearchContext = createContext();

// Context provider component
export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState(""); // State to store the search term

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
      {children}
    </SearchContext.Provider>
  );
};

// Custom hook to use the search context
export const useSearch = () => useContext(SearchContext);
