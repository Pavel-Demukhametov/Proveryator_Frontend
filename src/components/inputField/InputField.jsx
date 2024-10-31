import React from 'react';

const InputField = ({ label, name, type = "text", required = false, value, onChange }) => {
  return (
    <div className="mb-6">
      <label htmlFor={name} className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">{label}</label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        required={required}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      />
    </div>
  );
};

export default InputField;