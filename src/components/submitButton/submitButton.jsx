import React from 'react';

const SubmitButton = ({ text, onClick }) => {
  return (
    <button
      type="submit"
      onClick={onClick}
      className="w-full bg-[#89abfc] dark:bg-[#4b6cb7] hover:bg-[#4b6cb7] dark:hover:bg-[#89abfc] text-customGray dark:text-trueWhite hover:text-trueWhite dark:hover:text-customGray font-semibold rounded-md transition duration-300 p-2.5"
    >
      {text}
    </button>
  );
};

export default SubmitButton;