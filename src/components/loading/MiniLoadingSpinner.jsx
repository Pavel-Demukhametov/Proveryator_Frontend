import React from 'react';

const MiniLoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="border-t-4 border-gray-500 w-16 h-16 border-solid rounded-full animate-spin"></div>
    </div>
  );
};

export default MiniLoadingSpinner;
