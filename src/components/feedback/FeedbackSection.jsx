import React from 'react';
import FeedbackMessage from './FeedbackMessage';

const FeedbackSection = ({ feedback }) => {
  return (
    <div className="space-y-4">
      {feedback?.length > 0 ? (
        feedback.map((item, index) => <FeedbackMessage key={index} feedback={item} />)
      ) : (
        <p> </p>
      )}
    </div>
  );
};

export default FeedbackSection;