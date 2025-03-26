// src/pages/EditTestPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL } from '../../config/config'; // Импортируем конечные точки

const EditTestPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const existingTest = location.state;

  // Проверка наличия accessToken в localStorage
  const isLoggedIn = !!localStorage.getItem('accessToken');

  useEffect(() => {
    if (existingTest) {
      console.log('Полученные данные теста для редактирования:', existingTest);
      // Проверка, что lectureMaterials является массивом
      if (!Array.isArray(existingTest.lectureMaterials)) {
        console.warn('lectureMaterials не является массивом. Инициализируем как пустой массив.');
        setLectureMaterials([]);
      }
    } else {
      console.error('Данные теста для редактирования отсутствуют.');
      toast.error('Данные теста отсутствуют.');
      navigate('/tests'); // Перенаправление в случае отсутствия данных теста
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingTest, navigate]);

  // Инициализация состояний
  const [testTitle, setTestTitle] = useState(existingTest?.title || '');
  const [questions, setQuestions] = useState(existingTest?.questions || []);
  const [lectureMaterials, setLectureMaterials] = useState(
    Array.isArray(existingTest?.lectureMaterials) ? existingTest.lectureMaterials : []
  );
  const [loading, setLoading] = useState(false);

  // Обработчики для изменения названия теста
  const handleTestTitleChange = (e) => {
    setTestTitle(e.target.value);
  };

  // Обработчики для добавления нового вопроса
  const handleAddQuestion = () => {
    const newQuestion = {
      type: 'open',
      question: '',
      answer: '',
      options: null,
    };
    setQuestions([...questions, newQuestion]);
  };

  // Обработчик для удаления вопроса
  const handleRemoveQuestion = (index) => {
    const updatedQuestions = questions.filter((_, idx) => idx !== index);
    setQuestions(updatedQuestions);
  };

  // Обработчик для изменения текста или данных вопроса
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = questions.map((q, idx) => {
      if (idx === index) {
        return { ...q, [field]: value };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  // Обработчик для изменения типа вопроса
  const handleQuestionTypeChange = (qIndex, newType) => {
    const updatedQuestions = questions.map((q, idx) => {
      if (idx === qIndex) {
        if (newType === 'mc' && (!q.options || q.options.length === 0)) {
          return { ...q, type: 'mc', options: ['', '', ''] };
        } else if (newType === 'open') {
          return { ...q, type: 'open', options: null };
        }
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  // Обработчики для добавления, изменения и удаления вариантов ответов
  const handleOptionChange = (qIndex, optIndex, value) => {
    const updatedQuestions = questions.map((q, idx) => {
      if (idx === qIndex && q.type === 'mc' && Array.isArray(q.options)) {
        const updatedOptions = q.options.map((opt, oIdx) => {
          if (oIdx === optIndex) {
            return value;
          }
          return opt;
        });
        return { ...q, options: updatedOptions };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  const handleAddOption = (qIndex) => {
    const updatedQuestions = questions.map((q, idx) => {
      if (idx === qIndex && q.type === 'mc') {
        return { ...q, options: [...(q.options || []), ''] };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  const handleRemoveOption = (qIndex, optIndex) => {
    const updatedQuestions = questions.map((q, idx) => {
      if (idx === qIndex && q.type === 'mc' && Array.isArray(q.options)) {
        const updatedOptions = q.options.filter((_, oIdx) => oIdx !== optIndex);
        return { ...q, options: updatedOptions };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  // Добавление материала лекции
  const handleAddLectureMaterial = () => {
    setLectureMaterials([...lectureMaterials, '']);
  };

  // Обработчик для изменения материала лекции
  const handleLectureMaterialChange = (index, value) => {
    const updatedLectureMaterials = lectureMaterials.map((item, idx) => {
      if (idx === index) {
        return value;
      }
      return item;
    });
    setLectureMaterials(updatedLectureMaterials);
  };

  // Удаление материала лекции
  const handleRemoveLectureMaterial = (index) => {
    const updatedLectureMaterials = lectureMaterials.filter((_, idx) => idx !== index);
    setLectureMaterials(updatedLectureMaterials);
  };

  // Перегенерация вопроса
  const handleRegenerateQuestion = (index) => {
    const updatedQuestions = questions.map((q, idx) => {
      if (idx === index) {
        return {
          ...q,
          question: '', // Пустой вопрос
          answer: '', // Пустой правильный ответ
          options: q.type === 'mc' ? ['', '', ''] : null, // Пустые варианты для множественного выбора
        };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  // Обработчик сохранения теста (только для авторизованных пользователей)
  const handleSave = async () => {
    if (!isLoggedIn) {
      toast.error('Только авторизованные пользователи могут сохранять тесты.');
      return;
    }

    // Проверка заполненности формы
    if (!testTitle.trim()) {
      toast.error('Пожалуйста, введите название теста.');
      return;
    }

    if (!questions.length) {
      toast.error('Пожалуйста, добавьте хотя бы один вопрос.');
      return;
    }

    // Валидация вопросов
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        toast.error(`Введите текст вопроса для вопроса №${i + 1}.`);
        return;
      }
      if (!q.answer.trim()) {
        toast.error(`Введите правильный ответ для вопроса №${i + 1}.`);
        return;
      }
      if (q.type === 'mc') {
        if (!Array.isArray(q.options) || q.options.length < 2) {
          toast.error(`Добавьте как минимум два варианта ответа для вопроса №${i + 1}.`);
          return;
        }
        for (let j = 0; j < q.options.length; j++) {
          if (!q.options[j].trim()) {
            toast.error(`Введите текст варианта ответа №${j + 1} для вопроса №${i + 1}.`);
            return;
          }
        }
        if (!q.options.includes(q.answer)) {
          toast.error(`Правильный ответ должен быть одним из вариантов ответов для вопроса №${i + 1}.`);
          return;
        }
      }
    }

    setLoading(true);

    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      };

      const payload = {
        test_name: testTitle, 
        questions: questions.map(q => ({
          type: q.type,
          question: q.question,
          answer: q.answer,
          options: q.type === 'mc' ? q.options : null,
          sentence: q.sentence ? q.sentence : ''
        })),
        lectureMaterials: lectureMaterials,
      };

      console.log('Отправляемые данные для сохранения теста:', payload);
      var url = `${API_BASE_URL}/tests/save/`;
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // // Обработка ответа как файла
        // const blob = await response.blob();
        // const contentDisposition = response.headers.get('Content-Disposition');
        // let fileName = 'test.gift';
        // if (contentDisposition && contentDisposition.includes('filename=')) {
        //   fileName = contentDisposition.split('filename=')[1].replace(/"/g, '');
        // }

        // // Создание URL для скачивания файла
        // const url = window.URL.createObjectURL(blob);
        // const link = document.createElement('a');
        // link.href = url;
        // link.setAttribute('download', fileName); // имя файла
        // document.body.appendChild(link);
        // link.click();
        // link.parentNode.removeChild(link);
        // window.URL.revokeObjectURL(url); // Освобождение памяти

        // toast.success('Тест успешно сохранен и файл GIFT скачан!');
        navigate('/tests');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Не удалось сохранить тест. Пожалуйста, попробуйте снова.');
      }
    } catch (error) {
      console.error('Ошибка при сохранении теста:', error);
      toast.error(error.message || 'Не удалось сохранить тест. Пожалуйста, попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  // Обработчик скачивания теста
  const handleDownload = async () => {
    setLoading(true);

    try {
      const headers = {
        'Content-Type': 'application/json',

      };

      const payload = {
        method: 'download',
        title: testTitle,
        questions: questions.map(q => ({
          type: q.type,
          question: q.question,
          answer: q.answer,
          options: q.type === 'mc' ? q.options : null,
          sentence: q.sentence ? q.sentence : ''
        })),
        lectureMaterials: lectureMaterials,
      };

      console.log('Отправляемые данные для скачивания теста:', payload);
      var url = `${API_BASE_URL}/tests/download/`;
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const blob = await response.blob();
        const contentDisposition = response.headers.get('Content-Disposition');
        let fileName = 'test.gift';
        if (contentDisposition && contentDisposition.includes('filename=')) {
          fileName = contentDisposition.split('filename=')[1].replace(/"/g, '');
        }

        // Создание URL для скачивания файла
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName); // имя файла
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url); // Освобождение памяти

        toast.success('Файл GIFT успешно скачан!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Не удалось скачать тест. Пожалуйста, попробуйте снова.');
      }
    } catch (error) {
      console.error('Ошибка при скачивании теста:', error);
      toast.error(error.message || 'Не удалось скачать тест. Пожалуйста, попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="max-w-5xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-md shadow-md mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">Редактирование Теста</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (isLoggedIn) handleSave();
        }}
      >
        {/* Название Теста */}
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-200">Название теста:</label>
          <input
            type="text"
            value={testTitle}
            onChange={handleTestTitleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        {/* Вопросы */}
        <div>
          {questions.map((q, idx) => (
            <div key={idx} className="mb-6">
              <div className="flex justify-end items-center mb-4">
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleRemoveQuestion(idx)}
                >
                  Удалить вопрос
                </button>
              </div>

              {/* Тип вопроса */}
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-200">Тип вопроса:</label>
                <select
                  value={q.type}
                  onChange={(e) => handleQuestionTypeChange(idx, e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="open">Открытый</option>
                  <option value="mc">Множественный выбор</option>
                </select>
              </div>

              {/* Текст вопроса */}
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-200">Текст вопроса:</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={q.question}
                  onChange={(e) => handleQuestionChange(idx, 'question', e.target.value)}
                  required
                />
              </div>

              {/* Правильный ответ */}
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-200">Правильный ответ:</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={q.answer}
                  onChange={(e) => handleQuestionChange(idx, 'answer', e.target.value)}
                  required
                />
              </div>

              {/* Варианты ответа (для множественного выбора) */}
              {q.type === 'mc' && (
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-200">Варианты ответа:</label>
                  {Array.isArray(q.options) && q.options.map((opt, optIdx) => (
                    <div key={optIdx} className="flex items-center mb-2">
                      <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={opt}
                        onChange={(e) => handleOptionChange(idx, optIdx, e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="ml-2 text-red-500 hover:text-red-700"
                        onClick={() => handleRemoveOption(idx, optIdx)}
                      >
                        Удалить
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => handleAddOption(idx)}
                  >
                    Добавить вариант
                  </button>
                </div>
              )}

              {/* Кнопка для перегенерации вопроса */}
              {/* <button
                type="button"
                className="text-yellow-500 hover:text-yellow-700"
                onClick={() => handleRegenerateQuestion(idx)}
              >
                Перегенерировать вопрос
              </button> */}
            </div>
          ))}

          <button
            type="button"
            className="text-green-500 hover:text-green-700 mt-4"
            onClick={handleAddQuestion}
          >
            Добавить вопрос
          </button>
        </div>

        

        {/* Кнопки действия */}
        <div className="flex flex-col md:flex-row justify-between mt-6 space-y-4 md:space-y-0">
          {/* Кнопка для сохранения теста (только для авторизованных пользователей) */}
          {isLoggedIn && (
            <button
              type="submit"
              className="w-full md:w-1/3 py-2 bg-blue-500 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? 'Сохранение...' : 'Сохранить'}
            </button>
          )}

          {/* Кнопка для скачивания теста */}
          <button
            type="button"
            className="w-full md:w-1/3 py-2 bg-green-500 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 hover:bg-green-600"
            onClick={handleDownload}
            disabled={loading}
          >
            {loading ? 'Скачивание...' : 'Скачать'}
          </button>

        </div>
      </form>

      {/* Контейнер для уведомлений */}
      <ToastContainer />
    </div>
  );
};

export default EditTestPage;
