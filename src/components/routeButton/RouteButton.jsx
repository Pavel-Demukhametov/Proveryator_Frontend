import React from 'react';
import { Link } from 'react-router-dom';

const ButtonLink = ({ to, children }) => (
  <Link to={to} className="w-[100%] no-underline text-center text-xl sm:text-[20px] md:text-[20px] px-6 py-3 bg-[#89abfc] dark:bg-[#4b6cb7] hover:bg-[#4b6cb7] dark:hover:bg-[#89abfc] text-customGray dark:text-trueWhite hover:text-trueWhite dark:hover:text-customGray font-semibold rounded-md transition duration-300">
    {children}
  </Link>
);

export default ButtonLink;