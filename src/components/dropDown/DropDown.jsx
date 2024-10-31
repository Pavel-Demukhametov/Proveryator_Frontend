import React, { useState, useRef, useEffect } from 'react';

const Dropdown = ({ items, placeholder, selectedItems, onSelectionChange }) => {
  const [filter, setFilter] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleItem = (itemId) => {
    const currentItems = selectedItems || [];
    const isAlreadySelected = currentItems.includes(itemId);
    const newSelectedItems = isAlreadySelected
      ? currentItems.filter(item => item !== itemId)
      : [...currentItems, itemId];

    onSelectionChange(newSelectedItems);
  };

  const isItemSelected = (itemId) => {
    return selectedItems ? selectedItems.includes(itemId) : false;
  };

  const getHighlightClass = (isSelected) => {
    return isSelected ? 'bg-darkBlue font-bold dark:bg-darkBlue dark:text-trueWhite' : '';
  };

  const filteredItems = items.filter(item =>
    item.label?.toLowerCase().includes(filter.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <input
        type="text"
        placeholder={placeholder}
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="p-2 rounded bg-gray-200 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring"
        onClick={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <ul className="absolute z-10 w-full rounded mt-1 max-h-60 overflow-auto shadow-lg dark:text-trueWhite bg-white dark:bg-gray-800">
          {filteredItems.map((item) => (
            <li
              key={item.id}
              className={`cursor-pointer ${getHighlightClass(isItemSelected(item.id))} py-2 px-3 hover:bg-gray-200 dark:hover:bg-gray-700`}
              onClick={() => toggleItem(item.id)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;