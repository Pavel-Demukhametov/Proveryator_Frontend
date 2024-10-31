import React, { useState } from 'react';
import axios from 'axios';

const FeedbackForm = ({ projectId, fetchFeedback }) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    };
    try {
      await axios.post(`http://127.0.0.1:8000/api/projects/${projectId}/feedback/`, { content }, { headers });
      setContent('');
      fetchFeedback();
    } catch (error) {
      console.error('Error posting feedback:', error);
      alert('Failed to post feedback');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Добавить отзыв:
      </label>
      <div className="mt-1 flex rounded-md shadow-sm">
        <textarea
          id="feedback"
          name="feedback"
          className="flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300 dark:bg-gray-700 dark:border-gray-600"
          placeholder=" "
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit" className="px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700">
          Отправить отзыв
        </button>
      </div>
    </form>
  );
};

export default FeedbackForm;