import React from 'react';

const FeedbackMessage = ({ feedback }) => {
  const date = new Date(feedback.timestamp);
  const formattedDate = date.toLocaleDateString();
  const formattedTime = date.toLocaleTimeString();

  return (
    <div className="mb-2 p-2 rounded-lg shadow dark:bg-darkGray bg-lightGray flex justify-between">
      <div className="flex flex-col justify-between">
        <div className="text-xs dark:text-gray-400 text-gray-500">- {feedback.curator.full_name}</div>
        <div className="text-base font-medium dark:text-trueWhite">{feedback.content}</div>
      </div>
      <div className="text-right text-xs dark:text-gray-300 text-gray-600">
        {formattedDate}<br />
        {formattedTime}
      </div>
    </div>
  );
};

export default FeedbackMessage;