import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MiniLoadingSpinner from '../../components/loading/MiniLoadingSpinner';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomRadio from '../../components/сustomRadio/CustomRadio';
import CustomCheckbox from '../../components/сustomCheckbox/CustomCheckbox';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateTestPage = () => {
  const location = useLocation(); // Получение данных от предыдущей страницы
  const navigate = useNavigate();

  // Данные от предыдущей страницы
  const lectureData = location.state;

  // Логика обработки данных от предыдущей страницы
  useEffect(() => {
    if (lectureData) {
      console.log('Полученные данные от предыдущей страницы:', lectureData);
    } else {
      console.error('Данные от предыдущей страницы отсутствуют.');
    }
  }, [lectureData]);

  const [testTitle, setTestTitle] = useState('');
  const [creationMethod, setCreationMethod] = useState('general');
  const [totalQuestions, setTotalQuestions] = useState('');
  const [themes, setThemes] = useState([
    {
      id: 1,
      title: '',
      description: `Классификация текста...`,
      isIncluded: false,
      questionCount: '',
    },
    {
      id: 2,
      title: '',
      description: `Тема классификации объектов...`,
      isIncluded: false,
      questionCount: '',
    },
    // Дополнительные темы можно добавить здесь...
  ]);
  const [loading, setLoading] = useState(false);

  const handleCreationMethodChange = (e) => {
    setCreationMethod(e.target.value);
    setTotalQuestions('');
    setThemes((prevThemes) =>
      prevThemes.map((theme) => ({
        ...theme,
        isIncluded: false,
        questionCount: '',
      }))
    );
  };

  const handleThemeToggle = (id) => {
    setThemes((prevThemes) =>
      prevThemes.map((theme) =>
        theme.id === id
          ? { ...theme, isIncluded: !theme.isIncluded, questionCount: theme.isIncluded ? '' : theme.questionCount }
          : theme
      )
    );
  };

  const handleThemeQuestionCountChange = (id, count) => {
    if (count === '' || (/^\d+$/.test(count) && parseInt(count, 10) > 0)) {
      setThemes((prevThemes) =>
        prevThemes.map((theme) =>
          theme.id === id ? { ...theme, questionCount: count } : theme
        )
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!testTitle.trim()) {
      toast.error('Пожалуйста, введите название теста.');
      return;
    }
  
    if (creationMethod === 'general') {
      if (!totalQuestions || isNaN(totalQuestions) || parseInt(totalQuestions, 10) <= 0) {
        toast.error('Пожалуйста, введите корректное количество вопросов.');
        return;
      }
    } else if (creationMethod === 'byThemes') {
      const selectedThemes = themes.filter((theme) => theme.isIncluded);
      if (selectedThemes.length === 0) {
        toast.error('Пожалуйста, выберите хотя бы одну тему.');
        return;
      }
      for (let theme of selectedThemes) {
        if (!theme.questionCount || isNaN(theme.questionCount) || parseInt(theme.questionCount, 10) <= 0) {
          toast.error(`Введите корректное количество вопросов для темы "${theme.title}".`);
          return;
        }
      }
    }
  
    setLoading(true);
  
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Убедитесь, что токен есть
      };
  
      const payload = {
        method: creationMethod,
        title: testTitle,
        totalQuestions: creationMethod === 'general' ? parseInt(totalQuestions, 10) : undefined,
        themes: creationMethod === 'byThemes' ? themes.filter((theme) => theme.isIncluded) : undefined,
        lectureMaterials: lectureData ? lectureData.materials : undefined,
      };
  
      console.log('Отправляемый payload:', payload);
  
      const response = await axios.post('http://127.0.0.1:8000/api/tests/create/', payload, { headers });
  
      toast.success('Тест успешно создан!');
      setTimeout(() => {
        navigate(`/test/${response.data.testId}`); // Перенаправление на страницу теста
      }, 1500);
    } catch (error) {
      console.error('Ошибка при создании теста:', error);
      toast.error(
        error.response?.data?.detail || 'Не удалось создать тест. Пожалуйста, попробуйте снова.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getHintText = () => {
    if (creationMethod === 'general') {
      return 'Автоматически создадутся выбранное количество вопросов.';
    } else if (creationMethod === 'byThemes') {
      return 'Вы можете выбрать сегменты для теста.';
    }
    return '';
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-md shadow-md mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">Создание теста</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="testTitle" className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
            Название теста:
          </label>
          <input
            type="text"
            id="testTitle"
            name="testTitle"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="Введите название теста"
            value={testTitle}
            onChange={(e) => setTestTitle(e.target.value)}
            required
          />
        </div>

        {/* Текст лекции */}
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
            Текст лекции:
          </label>
          <textarea
            className="w-full h-64 px-4 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white cursor-not-allowed"
            value={lectureData ? lectureData.materials : ''}
            readOnly
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
            Метод создания теста:
          </label>
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio h-5 w-5 text-blue-600 dark:text-blue-400"
                value="general"
                checked={creationMethod === 'general'}
                onChange={handleCreationMethodChange}
              />
              <span className="ml-2 text-gray-800 dark:text-gray-200">Общее количество вопросов</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio h-5 w-5 text-blue-600 dark:text-blue-400"
                value="byThemes"
                checked={creationMethod === 'byThemes'}
                onChange={handleCreationMethodChange}
              />
              <span className="ml-2 text-gray-800 dark:text-gray-200">По темам</span>
            </label>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{getHintText()}</p>
        </div>

        {creationMethod === 'general' && (
          <div className="mb-6">
            <label htmlFor="totalQuestions" className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
              Количество вопросов:
            </label>
            <input
              type="number"
              id="totalQuestions"
              name="totalQuestions"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="Введите количество вопросов"
              value={totalQuestions}
              onChange={(e) => setTotalQuestions(e.target.value)}
              min="1"
              step="1"
              required
            />
          </div>
        )}
        {/* Форма для выбора тем */}
        {creationMethod === 'byThemes' && (
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
              Выберите сегменты для теста:
            </label>
            <div className="space-y-4">
              {themes.map((theme) => (
                <div key={theme.id} className="p-4 border rounded-md dark:border-gray-600 bg-gray-50 dark:bg-gray-700 w-full">
                  <div className="flex flex-col w-full justify-between">
                    <div className="w-full">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{theme.title}</h3>
                      
                      {/* Многострочное поле для описания */}
                      <textarea
                        className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        rows="5"
                        value={theme.description}
                        readOnly
                      ></textarea>
                    </div>
                    <div className="mt-4 w-full">
                      <CustomCheckbox
                        id={`theme-${theme.id}`}
                        checked={theme.isIncluded}
                        onChange={() => handleThemeToggle(theme.id)}
                        label="Включить"
                      />
                    </div>
                  </div>
                  {theme.isIncluded && (
                    <div className="mt-4 w-full">
                      <label htmlFor={`questionCount-${theme.id}`} className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                        Количество вопросов с одним правильным ответом для этой темы:
                      </label>
                      <input
                        type="number"
                        id={`questionCount-${theme.id}`}
                        name={`questionCount-${theme.id}`}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Введите количество вопросов"
                        value={theme.questionCount}
                        onChange={(e) => handleThemeQuestionCountChange(theme.id, e.target.value)}
                        min="1"
                        step="1"
                        required
                      />
                      <label htmlFor={`questionCount-${theme.id}`} className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                        Количество вопросов с открытым ответом для этой темы:
                      </label>
                      <input
                        type="number"
                        id={`questionCount-${theme.id}`}
                        name={`questionCount-${theme.id}`}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Введите количество вопросов"
                        value={theme.questionCount}
                        onChange={(e) => handleThemeQuestionCountChange(theme.id, e.target.value)}
                        min="1"
                        step="1"
                        required
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Кнопка создания теста */}
        <div className="flex justify-center">
          {loading ? (
            <MiniLoadingSpinner />
          ) : (
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Создать тест
            </button>
          )}
        </div>
      </form>

      {/* Контейнер для уведомлений */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default CreateTestPage;