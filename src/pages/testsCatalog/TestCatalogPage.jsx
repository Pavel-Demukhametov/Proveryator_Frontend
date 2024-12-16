import MiniLoadingSpinner from '../../components/loading/MiniLoadingSpinner';
import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Подключаем axios для работы с API
import { API_BASE_URL } from '../../config/config'; // Импортируем конечные точки

const TestCatalog = () => {
  const [tests, setTests] = useState([]);  // Состояние для хранения данных о тестах
  const [loading, setLoading] = useState(true);  // Состояние для отслеживания загрузки
  const [error, setError] = useState(null);  // Состояние для хранения ошибок

  // Получаем токен из localStorage
  const token = localStorage.getItem('accessToken')

  useEffect(() => {
    // Выполняем запрос к API для получения списка тестов
    const url = `${API_BASE_URL}/tests/`;
    const fetchTests = async () => {
      try {
        const response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${token}` // Добавляем токен в заголовки
          }
        });
        // После получения данных обновляем состояние
        setTests(response.data); // Изменено с response.data.files на response.data
        setLoading(false); // Завершаем загрузку
      } catch (err) {
        setError("Ошибка при загрузке тестов.");
        setLoading(false); // Завершаем загрузку
      }
    };

    fetchTests(); // Вызываем функцию для загрузки тестов
  }, [token]); // Добавляем token в зависимости, чтобы обновлять при его изменении

  const handleExportTest = async (test) => {
    try {
      // Отправляем запрос для скачивания теста по его названию
      const downloadUrl = `${API_BASE_URL}/tests/download/${test}`;
      const response = await axios.get(downloadUrl, {
        headers: {
          'Authorization': `Bearer ${token}` // Добавляем токен в заголовки
        },
        responseType: 'blob', // Ожидаем файл в виде blob
      });

      // Создаем URL для скачивания
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Создаем элемент <a> для скачивания файла
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${test.replace(/\s+/g, '_')}_test.gift`); // Устанавливаем имя файла для скачивания
      document.body.appendChild(link);
      link.click(); // Инициализируем скачивание
      document.body.removeChild(link); // Убираем ссылку после скачивания
    } catch (err) {
      setError("Ошибка при выгрузке теста.");
    }
  };

  if (loading) {
    return <MiniLoadingSpinner />;  // Показываем индикатор загрузки
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
            key={test}
            className="p-4 border rounded-md dark:border-gray-600 bg-gray-50 dark:bg-gray-700 flex justify-between items-center"
          >
            <span className="text-gray-800 dark:text-gray-200">{test}</span>
            <div className="flex gap-4">
              <a
                href={`https://example.com/tests/${test}`} // Укажите правильный URL для теста
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
