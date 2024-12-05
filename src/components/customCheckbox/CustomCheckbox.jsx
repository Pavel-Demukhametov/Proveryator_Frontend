// src/components/CustomCheckbox.jsx

import React from 'react';

const CustomCheckbox = ({ id, checked, onChange, label }) => {
  return (
    <label htmlFor={id} className="flex items-center cursor-pointer">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="hidden"
      />
      <span
        className={`w-5 h-5 mr-2 flex items-center justify-center border-2 rounded ${
          checked
            ? 'border-green-500 bg-green-500'
            : 'border-gray-400 bg-white dark:bg-gray-700'
        } transition-colors`}
      >
        {checked && (
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
      <span className="text-gray-800 dark:text-gray-200">{label}</span>
    </label>
  );
};

export default CustomCheckbox;