// src/pages/EditTestPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import CustomCheckbox from '../../components/customCheckbox/CustomCheckbox'; // Исправлен импорт
import 'react-toastify/dist/ReactToastify.css';

const EditTestPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const existingTest = location.state;

  useEffect(() => {
    if (existingTest) {
      console.log('Полученные данные теста для редактирования:', existingTest);
    } else {
      console.error('Данные теста для редактирования отсутствуют.');
      toast.error('Данные теста отсутствуют.');
      // navigate('/tests'); // Можно оставить перенаправление, если данные отсутствуют
    }
  }, [existingTest, navigate]);

  const [testTitle, setTestTitle] = useState(existingTest?.title || '');
  const [creationMethod, setCreationMethod] = useState(existingTest?.method || 'general');
  const [themes, setThemes] = useState(existingTest?.themes || []);
  const [questions, setQuestions] = useState(existingTest?.questions || []);
  const [loading, setLoading] = useState(false);

  // Функции для обработки изменений

  const handleCreationMethodChange = (e) => {
    setCreationMethod(e.target.value);
    // В зависимости от метода, можно сбросить или сохранить определенные поля
  };

  const handleTestTitleChange = (e) => {
    setTestTitle(e.target.value);
  };

  // Обработка изменения темы
  const handleThemeToggle = (keyword) => {
    setThemes((prevThemes) =>
      prevThemes.map((theme) =>
        theme.keyword === keyword
          ? { ...theme, isIncluded: !theme.isIncluded }
          : theme
      )
    );
  };

  const handleThemeQuestionCountChange = (keyword, count, type) => {
    if (count === '' || (/^\d+$/.test(count) && parseInt(count, 10) >= 0)) {
      setThemes((prevThemes) =>
        prevThemes.map((theme) =>
          theme.keyword === keyword
            ? { ...theme, [type]: count }
            : theme
        )
      );
    }
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      type: 'open', // По умолчанию открытый вопрос
      question: '',
      answer: '',
      options: null,
      sentence: '',
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = questions.filter((_, idx) => idx !== index);
    setQuestions(updatedQuestions);
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = questions.map((q, idx) => {
      if (idx === index) {
        return { ...q, [field]: value };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updatedQuestions = questions.map((q, idx) => {
      if (idx === qIndex && q.type === 'mc' && q.options) {
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
        return { ...q, options: [...q.options, ''] };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  const handleRemoveOption = (qIndex, optIndex) => {
    const updatedQuestions = questions.map((q, idx) => {
      if (idx === qIndex && q.type === 'mc' && q.options) {
        const updatedOptions = q.options.filter((_, oIdx) => oIdx !== optIndex);
        return { ...q, options: updatedOptions };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  const handleQuestionTypeChange = (qIndex, newType) => {
    const updatedQuestions = questions.map((q, idx) => {
      if (idx === qIndex) {
        if (newType === 'mc' && (!q.options || q.options.length === 0)) {
          return { ...q, type: 'mc', options: ['', '', ''] }; // Инициализация с 3 пустыми вариантами
        } else if (newType === 'open') {
          return { ...q, type: 'open', options: null };
        }
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Валидация данных
    if (!testTitle.trim()) {
      toast.error('Пожалуйста, введите название теста.');
      return;
    }

    if (creationMethod === 'byThemes') {
      const selectedThemes = themes.filter((theme) => theme.isIncluded);
      if (selectedThemes.length === 0) {
        toast.error('Пожалуйста, выберите хотя бы одну тему.');
        return;
      }

      for (let theme of selectedThemes) {
        if (
          theme.multipleChoiceCount === '' ||
          isNaN(theme.multipleChoiceCount) ||
          parseInt(theme.multipleChoiceCount, 10) < 0
        ) {
          toast.error(`Введите корректное количество вопросов с одним правильным ответом для темы "${theme.keyword}".`);
          return;
        }

        if (
          theme.openAnswerCount === '' ||
          isNaN(theme.openAnswerCount) ||
          parseInt(theme.openAnswerCount, 10) < 0
        ) {
          toast.error(`Введите корректное количество вопросов с открытым ответом для темы "${theme.keyword}".`);
          return;
        }
      }
    } else if (creationMethod === 'general') {
      if (!questions.length) {
        toast.error('Пожалуйста, добавьте хотя бы один вопрос.');
        return;
      }

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
          if (!q.options || q.options.length < 2) {
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
    }

    setLoading(true);

    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      };

      // Формируем данные для отправки
      const payload = {
        method: creationMethod,
        title: testTitle,
        themes: creationMethod === 'byThemes' ? themes.filter(theme => theme.isIncluded).map(theme => ({
          keyword: theme.keyword,
          sentences: theme.sentences,
          multipleChoiceCount: parseInt(theme.multipleChoiceCount, 10) || 0,
          openAnswerCount: parseInt(theme.openAnswerCount, 10) || 0,
        })) : themes.map(theme => ({
          keyword: theme.keyword,
          sentences: theme.sentences,
        })),
        lectureMaterials: existingTest.lectureMaterials,
        questions: questions.map(q => ({
          type: q.type,
          question: q.question,
          answer: q.answer,
          options: q.type === 'mc' ? q.options : null,
          sentence: q.sentence,
        })),
      };

      console.log('Отправляемые данные для обновления теста:', payload);

      // Отправка данных на сервер
      const response = await fetch(`http://127.0.0.1:5000/api/tests/update/${existingTest.id}/`, { // Предполагаемый эндпоинт
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success('Тест успешно обновлен!');
        navigate('/tests'); // Перенаправление на страницу тестов после успешного обновления
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Не удалось обновить тест. Пожалуйста, попробуйте снова.');
      }
    } catch (error) {
      console.error('Ошибка при обновлении теста:', error);
      toast.error(error.message || 'Не удалось обновить тест. Пожалуйста, попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-md shadow-md mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">Редактирование Теста</h1>
      <form onSubmit={handleSubmit}>
        {/* Название Теста */}
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
            onChange={handleTestTitleChange}
            required
          />
        </div>

        {/* Метод создания теста */}
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
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {creationMethod === 'general'
              ? 'Автоматически создадутся выбранное количество вопросов.'
              : 'Вы можете выбрать сегменты для теста.'}
          </p>
        </div>

        {/* Темы */}
        {(creationMethod === 'byThemes') && (
          <div className="mb-6 space-y-4">
            <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">Темы теста:</label>
            {themes.map((theme) => (
              <div key={theme.keyword} className="border border-gray-300 rounded-lg p-4 bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                <div className="flex flex-col space-y-5">
                  <div className="flex items-center space-x-2">
                    <CustomCheckbox
                      id={`theme-${theme.keyword}`}
                      checked={theme.isIncluded}
                      onChange={() => handleThemeToggle(theme.keyword)}
                      label={theme.keyword}
                    />
                  </div>
                  {theme.isIncluded && (
                    <>
                      <textarea
                        value={theme.relatedSentences.join('\n')}
                        onChange={(e) => {
                          const updatedSentences = e.target.value.split('\n');
                          setThemes((prevThemes) =>
                            prevThemes.map((t) =>
                              t.keyword === theme.keyword
                                ? { ...t, sentences: updatedSentences }
                                : t
                            )
                          );
                        }}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Связанные предложения из лекции (каждое предложение на новой строке)"
                      />
                      <div className="flex space-x-4">
                        <div className="flex-1">
                          <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                            Количество вопросов с одним правильным ответом:
                          </label>
                          <input
                            type="number"
                            min="0"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            value={theme.multipleChoiceCount}
                            onChange={(e) => handleThemeQuestionCountChange(theme.keyword, e.target.value, 'multipleChoiceCount')}
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                            Количество вопросов с открытым ответом:
                          </label>
                          <input
                            type="number"
                            min="0"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            value={theme.openAnswerCount}
                            onChange={(e) => handleThemeQuestionCountChange(theme.keyword, e.target.value, 'openAnswerCount')}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Вопросы */}
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">Вопросы:</label>
          {questions.map((q, idx) => (
            <div key={idx} className="border border-gray-300 rounded-lg p-4 mb-4 bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Вопрос {idx + 1}</h3>
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleRemoveQuestion(idx)}
                >
                  Удалить
                </button>
              </div>
              {/* Тип Вопроса */}
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">Тип вопроса:</label>
                <select
                  value={q.type}
                  onChange={(e) => handleQuestionTypeChange(idx, e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="open">Открытый</option>
                  <option value="mc">Множественный выбор</option>
                </select>
              </div>
              {/* Текст Вопроса */}
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">Текст вопроса:</label>
                <textarea
                  value={q.question}
                  onChange={(e) => handleQuestionChange(idx, 'question', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Введите текст вопроса"
                  required
                />
              </div>
              {/* Текст Правильного Ответа */}
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">Правильный ответ:</label>
                <input
                  type="text"
                  value={q.answer}
                  onChange={(e) => handleQuestionChange(idx, 'answer', e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Введите правильный ответ"
                  required
                />
              </div>
              {/* Варианты Ответов для Множественного Выбора */}
              {q.type === 'mc' && (
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">Варианты ответов:</label>
                  {q.options && q.options.map((opt, optIdx) => (
                    <div key={optIdx} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleOptionChange(idx, optIdx, e.target.value)}
                        className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        placeholder={`Вариант ${optIdx + 1}`}
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
                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    onClick={() => handleAddOption(idx)}
                  >
                    Добавить вариант ответа
                  </button>
                </div>
              )}
              {/* Предложение из Лекции */}
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">Связанное предложение из лекции:</label>
                <textarea
                  value={q.sentence}
                  onChange={(e) => handleQuestionChange(idx, 'sentence', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Введите предложение из лекции, связанное с вопросом"
                  required
                />
              </div>
            </div>
          ))}

          {/* Кнопка Добавления Вопроса */}
          <div className="text-center">
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={handleAddQuestion}
            >
              Добавить Вопрос
            </button>
          </div>
        </div>

        {/* Кнопка Сохранения Изменений */}
        <div className="text-center">
          <button
            type="submit"
            className={`w-full px-4 py-2 bg-green-600 dark:bg-green-500 text-white font-semibold rounded-md hover:bg-green-700 dark:hover:bg-green-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-400`}
            disabled={loading}
          >
            {loading ? 'Сохраняю изменения...' : 'Сохранить Изменения'}
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default EditTestPage;
