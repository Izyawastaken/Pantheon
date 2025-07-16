import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';

const SearchableSelect = ({ 
  options, 
  value, 
  onChange, 
  placeholder = "Select...", 
  className = "",
  allowEmpty = false,
  emptyText = "None"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setFilteredOptions(
      options.filter(option => 
        option.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  };

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
  };

  const displayValue = value || placeholder;

  return (
    <div className={`searchable-select ${className}`} ref={dropdownRef}>
      <div className="select-trigger" onClick={handleToggle}>
        <span className={`select-value ${!value ? 'placeholder' : ''}`}>
          {displayValue}
        </span>
        <ChevronDown 
          size={16} 
          className={`select-arrow ${isOpen ? 'rotate' : ''}`}
        />
      </div>
      
      {isOpen && (
        <div className="select-dropdown">
          <div className="search-container">
            <Search size={14} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="options-container">
            {allowEmpty && (
              <div 
                className="select-option"
                onClick={() => handleSelect('')}
              >
                {emptyText}
              </div>
            )}
            
            {filteredOptions.map((option, index) => (
              <div
                key={index}
                className={`select-option ${value === option ? 'selected' : ''}`}
                onClick={() => handleSelect(option)}
              >
                {option}
              </div>
            ))}
            
            {filteredOptions.length === 0 && (
              <div className="select-option disabled">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;