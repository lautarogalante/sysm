import React, { useState } from "react";
import '../styles/SearchBar.css';

interface SearchBarProps {
  onSearch: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="bar">
      <input
        className="input" 
        type="text"
        placeholder="Enter the PID or Process name"
        value={searchValue}
        onChange={handleChange}
      />
    </div>
  );
};


export default SearchBar;
