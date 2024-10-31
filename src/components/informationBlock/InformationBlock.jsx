import React from 'react';

function InformationBlock({ title, children }) {
  return (
    <div className="mb-4 p-3 rounded-md shadow-md dark:bg-customGray bg-trueWhite">
      <h2 className="mb-2 text-xl md:text-md lg:text-lg xl:text-xl font-semibold dark:text-blueText">{title}</h2>
      {children}
    </div>
  );
}
export default InformationBlock;
