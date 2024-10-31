// src/components/CustomRadio.jsx

import React from 'react';

const CustomRadio = ({ id, name, value, checked, onChange, label }) => {
  return (
    <label htmlFor={id} className="flex items-center cursor-pointer">
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="hidden"
      />
      <span
        className={`w-5 h-5 mr-2 flex items-center justify-center border-2 rounded-full transition-colors ${
          checked
            ? 'border-blue-600 bg-blue-600'
            : 'border-gray-400 bg-white dark:bg-gray-700'
        }`}
      >
        {checked && (
          <span className="w-3 h-3 bg-white dark:bg-gray-700 rounded-full"></span>
        )}
      </span>
      <span className="text-gray-800 dark:text-gray-200">{label}</span>
    </label>
  );
};

export default CustomRadio;