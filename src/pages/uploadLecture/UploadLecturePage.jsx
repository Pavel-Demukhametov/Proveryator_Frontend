import React, { useState } from 'react';
import axios from 'axios';
import MiniLoadingSpinner from '../../components/loading/MiniLoadingSpinner';
import { useNavigate } from 'react-router-dom';

const UploadLecturePage = () => {
  const [uploadMethod, setUploadMethod] = useState('YouTube');
  const [lectureUrl, setLectureUrl] = useState('');
  const [lectureMaterials, setLectureMaterials] = useState(''); // Новое состояние для материалов
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Хук для навигации

  const handleMethodChange = (e) => {
    setUploadMethod(e.target.value);
    setLectureUrl('');
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!lectureUrl.trim()) {
      setErrorMessage('Пожалуйста, введите ссылку на лекцию.');
      return;
    }

    if (!lectureMaterials.trim()) {
      setErrorMessage('Пожалуйста, введите материалы лекции.');
      return;
    }

    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      };

      const payload = {
        method: uploadMethod,
        url: lectureUrl.trim(),
        materials: lectureMaterials.trim(), // Добавляем материалы в запрос
      };

      // Раскомментируйте строку ниже после настройки бэкенда
      // const response = await axios.post('http://127.0.0.1:8000/api/lectures/upload/', payload, { headers });

      setSuccessMessage('Лекция успешно загружена!');
      setLectureUrl('');
      setLectureMaterials(''); // Очищаем поле материалов

      // Перенаправление пользователя на страницу со списком лекций
      setTimeout(() => navigate('/create/test'), 500); // Задержка в 2 секунды перед перенаправлением (необязательно)
    } catch (error) {
      console.error('Ошибка при загрузке лекции:', error);
      setErrorMessage('Не удалось загрузить лекцию. Пожалуйста, попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-md shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-gray-200">Выберите метод загрузки лекции</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
            Метод загрузки:
          </label>
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio h-5 w-5 text-blue-600 dark:text-blue-400"
                value="YouTube"
                checked={uploadMethod === 'YouTube'}
                onChange={handleMethodChange}
              />
              <span className="ml-2 text-gray-800 dark:text-gray-200">YouTube</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio h-5 w-5 text-blue-600 dark:text-blue-400"
                value="YandexDisk"
                checked={uploadMethod === 'YandexDisk'}
                onChange={handleMethodChange}
              />
              <span className="ml-2 text-gray-800 dark:text-gray-200">Яндекс.Диск</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio h-5 w-5 text-blue-600 dark:text-blue-400"
                value="Device"
                checked={uploadMethod === 'Device'}
                onChange={handleMethodChange}
              />
              <span className="ml-2 text-gray-800 dark:text-gray-200">С устройства</span>
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="lectureUrl" className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
            {uploadMethod === 'YouTube' ? 'Ссылка на YouTube:' : 'Ссылка на Яндекс.Диск:'}
          </label>
          <input
            type="text"
            id="lectureUrl"
            name="lectureUrl"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder={
              uploadMethod === 'YouTube'
                ? 'Введите ссылку на YouTube'
                : 'Введите ссылку на Яндекс.Диск'
            }
            value={lectureUrl}
            onChange={(e) => setLectureUrl(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="lectureMaterials" className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
            Вставьте материалы лекции:
          </label>
          <textarea
            id="lectureMaterials"
            name="lectureMaterials"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="Введите материалы лекции (Текст материалов)"
            value={lectureMaterials}
            onChange={(e) => setLectureMaterials(e.target.value)}
          ></textarea>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <MiniLoadingSpinner />
          </div>
        ) : (
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Загрузить лекцию
          </button>
        )}

        {successMessage && (
          <p className="mt-4 text-green-600 dark:text-green-400 text-center">{successMessage}</p>
        )}
        {errorMessage && (
          <p className="mt-4 text-red-600 dark:text-red-400 text-center">{errorMessage}</p>
        )}
      </form>
    </div>
  );
};

export default UploadLecturePage;