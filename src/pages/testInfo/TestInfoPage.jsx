import MiniLoadingSpinner from '../../components/loading/MiniLoadingSpinner';
import React, { useEffect, useState } from 'react';
// import axios from 'axios'; // Отключите axios, если используете мок-данные

const TestInfoPage = ({ testId }) => {
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Мок-данные для отдельного теста
    const mockData = {
      id: testId,
      title: "Основы программирования",
      description: "Тест для проверки базовых знаний по программированию.",
      link: "https://forms.gle/example1",
      questions: [
        { id: 1, question: "Что такое переменная?" },
        { id: 2, question: "Какие типы данных вы знаете?" },
        { id: 3, question: "Что такое условные операторы?" }
      ]
    };

    // Симуляция загрузки данных
    setTimeout(() => {
      setTest(mockData);
      setLoading(false);
    }, 1000);
  }, [testId]);

  const handleExportTest = () => {
    const fileData = JSON.stringify(test, null, 2);
    const blob = new Blob([fileData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${test.title.replace(/\s+/g, '_')}_test.json`;
    link.click();
  };

  if (loading) {
    return <MiniLoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-md shadow-md mt-10">
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-800 dark:text-gray-200">
        {test.title}
      </h1>
      <div className="flex justify-center gap-4 mb-6">
        <a
          href={test.link}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Перейти к тесту
        </a>
        <button
          onClick={handleExportTest}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Выгрузить тест в формате GIFT
        </button>
      </div>
    </div>
  );
};

export default TestInfoPage;