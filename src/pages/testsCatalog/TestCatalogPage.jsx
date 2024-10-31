// src/pages/testCatalog/TestCatalog.jsx
import MiniLoadingSpinner from '../../components/loading/MiniLoadingSpinner';
import React, { useEffect, useState } from 'react';
// import axios from 'axios'; // Отключите axios, если используете мок-данные

const TestCatalog = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Используем мок-данные вместо запроса к API
    const mockData = [
      {
        id: 1,
        title: "Основы программирования",
        link: "https://forms.gle/example1",
        questions: [
          { id: 1, question: "Что такое переменная?" },
          { id: 2, question: "Какие типы данных вы знаете?" }
        ]
      },
      {
        id: 2,
        title: "Продвинутый Python",
        link: "https://forms.gle/example2",
        questions: [
          { id: 1, question: "Что такое декоратор?" },
          { id: 2, question: "Как использовать генераторы?" }
        ]
      },
      // Другие тесты...
    ];

    // Симуляция задержки загрузки данных
    setTimeout(() => {
      setTests(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const handleExportTest = (test) => {
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
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">Каталог тестов</h1>
      <ul className="space-y-4">
        {tests.map(test => (
          <li
            key={test.id}
            className="p-4 border rounded-md dark:border-gray-600 bg-gray-50 dark:bg-gray-700 flex justify-between items-center"
          >
            <span className="text-gray-800 dark:text-gray-200">{test.title}</span>
            <div className="flex gap-4">
              <a
                href={test.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Открыть
              </a>
              <button
                onClick={() => handleExportTest(test)}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Выгрузить
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestCatalog;