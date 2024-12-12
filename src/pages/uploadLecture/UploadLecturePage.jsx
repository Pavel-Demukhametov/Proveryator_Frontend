// UploadLecturePage.jsx

import React, { useState } from 'react';
import axios from 'axios';
import MiniLoadingSpinner from '../../components/loading/MiniLoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config/config'; // Импортируем конечные точки

const UploadLecturePage = () => {
  const [lectureFile, setLectureFile] = useState(null);
  const [lectureMaterials, setLectureMaterials] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setLectureFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Проверка: хотя бы одно из полей должно быть заполнено
    if (!lectureFile && !lectureMaterials.trim()) {
      setErrorMessage('Пожалуйста, загрузите файл лекции или введите материалы лекции.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const headers = {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        // При отправке FormData заголовок Content-Type должен быть установлен автоматически
      };

      const formData = new FormData();
      formData.append('method', 'Device');
      
      // Добавляем файл, только если он выбран
      if (lectureFile) {
        formData.append('file', lectureFile);
      }
      
      // Добавляем материалы лекции, только если они введены
      if (lectureMaterials.trim()) {
        formData.append('materials', lectureMaterials.trim());
      }

      const url = `${API_BASE_URL}/upload/`;
      const response = await axios.post(
        url,
        formData,
        { headers }
      );

      // Перенаправление с передачей данных
      navigate('/create/test', { state: response.data });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || 'Не удалось загрузить лекцию. Пожалуйста, попробуйте снова.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-md shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-gray-200">Загрузка лекции</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="lectureFile" className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
            Загрузить файл лекции (опционально):
          </label>
          <input
            type="file"
            id="lectureFile"
            name="lectureFile"
            className="w-full px-4 py-2 border rounded-md focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            onChange={handleFileChange}
            accept=".docx,.pdf,.txt" // Ограничение типов файлов по необходимости
          />
        </div>

        <div className="mb-4">
          <label htmlFor="lectureMaterials" className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
            Материалы лекции (опционально):
          </label>
          <textarea
            id="lectureMaterials"
            name="lectureMaterials"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            value={lectureMaterials}
            onChange={(e) => setLectureMaterials(e.target.value)}
            placeholder="Введите материалы лекции или оставьте это поле пустым"
            rows={6}
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
        {errorMessage && (
          <p className="mt-4 text-red-600 dark:text-red-400 text-center">{errorMessage}</p>
        )}
      </form>
    </div>
  );
};

export default UploadLecturePage;
