import React from 'react';
import styles from './Tag.module.css';

const SimpleTag = ({ tagName, color, onRemove }) => {
  let backgroundColorClass;
  switch (color) {
    case 'green':
      backgroundColorClass = 'bg-lightGreen';
      break;
    case 'pink':
      backgroundColorClass = 'bg-customPink';
      break;
    case 'blue':
      backgroundColorClass = 'bg-lightBlue';
      break;
    case 'cyan':
      backgroundColorClass = 'bg-customYellow';
      break;
    default:
      backgroundColorClass = 'bg-gray-300';
      break;
  }

  return (
    <div className={`rounded-xl font-bold text-[11px] py-1 px-2 ${backgroundColorClass} text-gray-600 flex items-center mr-2`}>
      {tagName}

      {onRemove && <span className={styles.closeIcon} onClick={() => onRemove(tagName)} />}
    </div>
  );
};

export default SimpleTag;