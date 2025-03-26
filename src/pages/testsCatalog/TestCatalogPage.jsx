import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/config';
import MiniLoadingSpinner from '../../components/loading/MiniLoadingSpinner';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const TestCatalog = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [inputValue, setInputValue] = useState('');

  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/tests/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTests(response.data);
        setLoading(false);
      } catch (err) {
        setError('Ошибка при загрузке тестов.');
        setLoading(false);
      }
    };

    fetchTests();
  }, [token]);

  const handleExportTest = async (test) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tests/download/${test}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${test.replace(/\s+/g, '_')}_test.gift`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError('Ошибка при выгрузке теста.');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = () => {
    // Здесь вы можете добавить логику для обработки создания лекции или курса
    console.log(`Создание ${modalType}: ${inputValue}`);
    closeModal();
  };

  if (loading) {
    return <MiniLoadingSpinner />;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-md shadow-md mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">Каталог тестов</h1>


      <ul className="space-y-4">
        {tests.map((test) => (
          <li
            key={test}
            className="p-4 border rounded-md dark:border-gray-600 bg-gray-50 dark:bg-gray-700 flex justify-between items-center"
          >
            <span className="text-gray-800 dark:text-gray-200">{test}</span>
            <div className="flex gap-4">
              <a
                href={`https://example.com/tests/${test}`}
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

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel={`Создать ${modalType}`}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2 className="text-xl font-bold mb-4">Создать {modalType}</h2>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={`Введите название ${modalType}`}
          className="w-full p-2 border rounded-md mb-4"
        />
        <div className="flex justify-end space-x-4">
          <button onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
            Отмена
          </button>
          <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Создать
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default TestCatalog;