import React, { useState } from 'react';
import axios from 'axios';
import MiniLoadingSpinner from '../../components/loading/MiniLoadingSpinner';
import { useNavigate } from 'react-router-dom';

const UploadLecturePage = () => {
  const [uploadMethod, setUploadMethod] = useState('YandexDisk');
  const [lectureUrl, setLectureUrl] = useState('');
  const [lectureFile, setLectureFile] = useState(null);
  const [lectureMaterials, setLectureMaterials] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleMethodChange = (e) => {
    setUploadMethod(e.target.value);
    setLectureUrl('');
    setLectureFile(null);
    setErrorMessage('');
  };

  const handleFileChange = (e) => {
    setLectureFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (uploadMethod === 'YandexDisk' && !lectureUrl.trim()) {
      setErrorMessage('Пожалуйста, введите ссылку на лекцию.');
      return;
    }

    if (uploadMethod === 'Device' && !lectureFile) {
      setErrorMessage('Пожалуйста, загрузите файл лекции.');
      return;
    }

    if (!lectureMaterials.trim()) {
      setErrorMessage('Пожалуйста, введите материалы лекции.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const headers = {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      };

      const formData = new FormData();
      formData.append('method', uploadMethod);
      if (uploadMethod === 'YandexDisk') {
        formData.append('url', lectureUrl.trim());
      }
      if (uploadMethod === 'Device') {
        formData.append('file', lectureFile);
      }
      formData.append('materials', lectureMaterials.trim());

      const response = await axios.post(
        'http://127.0.0.1:5000/api/upload',
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
          <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">Метод загрузки:</label>
          <div className="flex items-center space-x-4">
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

        {uploadMethod === 'YandexDisk' && (
          <div className="mb-4">
            <label htmlFor="lectureUrl" className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
              Ссылка на Яндекс.Диск:
            </label>
            <input
              type="text"
              id="lectureUrl"
              name="lectureUrl"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              value={lectureUrl}
              onChange={(e) => setLectureUrl(e.target.value)}
            />
          </div>
        )}

        {uploadMethod === 'Device' && (
          <div className="mb-4">
            <label htmlFor="lectureFile" className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
              Загрузить файл:
            </label>
            <input
              type="file"
              id="lectureFile"
              name="lectureFile"
              className="w-full px-4 py-2 border rounded-md focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              onChange={handleFileChange}
            />
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="lectureMaterials" className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
            Материалы лекции:
          </label>
          <textarea
            id="lectureMaterials"
            name="lectureMaterials"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
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
        {errorMessage && (
          <p className="mt-4 text-red-600 dark:text-red-400 text-center">{errorMessage}</p>
        )}
      </form>
    </div>
  );
};

export default UploadLecturePage;