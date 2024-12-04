import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import CustomCheckbox from '../../components/сustomCheckbox/CustomCheckbox';
import 'react-toastify/dist/ReactToastify.css';

const CreateTestPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const lectureData = location.state;

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
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [multipleChoiceCount, setMultipleChoiceCount] = useState('');
  const [openAnswerCount, setOpenAnswerCount] = useState('');

  useEffect(() => {
    if (lectureData && lectureData.results && Array.isArray(lectureData.segments)) {
      const extractedThemes = lectureData.segments.map((segment) => ({
        keyword: segment.keyword,
        sentences: segment.sentences,
        isIncluded: false,
        multipleChoiceCount: '',  // Количество вопросов с одним правильным ответом
        openAnswerCount: '',      // Количество вопросов с открытым ответом
        relatedSentences: segment.sentences.join('\n'),
      }));
      setThemes(extractedThemes);
    }
  }, [lectureData]);

  const handleCreationMethodChange = (e) => {
    setCreationMethod(e.target.value);
    setTotalQuestions('');
    setThemes((prevThemes) =>
      prevThemes.map((theme) => ({
        ...theme,
        isIncluded: false,
        multipleChoiceCount: '',
        openAnswerCount: '',
      }))
    );
  };

  const handleMultipleChoiceCountChange = (e) => {
    const value = e.target.value;
    if (value === '' || (/^\d+$/.test(value) && parseInt(value, 10) >= 1)) {
      setMultipleChoiceCount(value);
    } else {
      setMultipleChoiceCount('1'); // Если меньше 1, ставим 1
    }
  };

  const handleOpenAnswerCountChange = (e) => {
    const value = e.target.value;
    if (value === '' || (/^\d+$/.test(value) && parseInt(value, 10) >= 1)) {
      setOpenAnswerCount(value);
    } else {
      setOpenAnswerCount('1'); // Если меньше 1, ставим 1
    }
  };

  const handleThemeToggle = (id) => {
    setThemes((prevThemes) =>
      prevThemes.map((theme) =>
        theme.keyword === id
          ? { ...theme, isIncluded: !theme.isIncluded }
          : theme
      )
    );
  };

  const handleThemeQuestionCountChange = (id, count, type) => {
    if (count === '' || (/^\d+$/.test(count) && parseInt(count, 10) >= 1)) {
      setThemes((prevThemes) =>
        prevThemes.map((theme) =>
          theme.keyword === id
            ? { ...theme, [type]: count }
            : theme
        )
      );
    } else {
      setThemes((prevThemes) =>
        prevThemes.map((theme) =>
          theme.keyword === id
            ? { ...theme, [type]: '1' }
            : theme
        )
      );
    }
  };

  const handleTotalQuestionsChange = (e) => {
    const value = e.target.value;
    if (value === '' || (/^\d+$/.test(value) && parseInt(value, 10) >= 1)) {
      setTotalQuestions(value);
    } else {
      setTotalQuestions('1');
    }
  };

  const handleRelatedSentencesChange = (id, value) => {
    setThemes((prevThemes) =>
      prevThemes.map((theme) =>
        theme.keyword === id ? { ...theme, relatedSentences: value } : theme
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Проверка на название теста
    if (!testTitle.trim()) {
      toast.error('Пожалуйста, введите название теста.');
      return;
    }

    // Проверка на корректность данных
    if (creationMethod === 'byThemes') {
      const selectedThemes = themes.filter((theme) => theme.isIncluded);
      if (selectedThemes.length === 0) {
        toast.error('Пожалуйста, выберите хотя бы одну тему.');
        return;
      }

      for (let theme of selectedThemes) {
        if (!theme.multipleChoiceCount || isNaN(theme.multipleChoiceCount) || parseInt(theme.multipleChoiceCount, 10) <= 0) {
          toast.error(`Введите корректное количество вопросов с одним правильным ответом для темы "${theme.keyword}".`);
          return;
        }

        if (!theme.openAnswerCount || isNaN(theme.openAnswerCount) || parseInt(theme.openAnswerCount, 10) <= 0) {
          toast.error(`Введите корректное количество вопросов с открытым ответом для темы "${theme.keyword}".`);
          return;
        }
      }
    } else if (creationMethod === 'general') {
      // При методе 'general' проверяем наличие тем
      if (themes.length === 0) {
        toast.error('Нет доступных тем для создания теста.');
        return;
      }
      // Дополнительные проверки, если необходимо
    }

    setLoading(true);

    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      };

      // Формируем данные для отправки
      const selectedThemes = themes.filter((theme) => theme.isIncluded).map((theme) => ({
        keyword: theme.keyword,
        sentences: theme.relatedSentences.split('\n'), // Преобразуем строку в список строк
        multipleChoiceCount: parseInt(theme.multipleChoiceCount, 10) || 0, // Преобразуем в число
        openAnswerCount: parseInt(theme.openAnswerCount, 10) || 0,        // Преобразуем в число
      }));

      // Для метода 'general' отправляем все темы без учета isIncluded и количества вопросов
      const allThemes = themes.map((theme) => ({
        keyword: theme.keyword,
        sentences: theme.relatedSentences.split('\n'), // Преобразуем строку в список строк
      }));
      const payload = {
        method: creationMethod,
        title: testTitle,
        totalQuestions: creationMethod === 'general' ? parseInt(totalQuestions, 10) : undefined,
        multipleChoiceCount: creationMethod === 'general' ? parseInt(multipleChoiceCount, 10) : undefined,
        openAnswerCount: creationMethod === 'general' ? parseInt(openAnswerCount, 10) : undefined,
        themes: creationMethod === 'byThemes' ? selectedThemes : allThemes,
        lectureMaterials: lectureData ? lectureData.materials : undefined,
      };
      console.log(payload);

      // Отправка данных на сервер
      const response = await fetch('http://127.0.0.1:5000/api/tests/create/', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success('Тест успешно создан!');
        navigate('/tests');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Не удалось создать тест. Пожалуйста, попробуйте снова.');
      }
    } catch (error) {
      console.error('Ошибка при создании теста:', error);
      toast.error(error.message || 'Не удалось создать тест. Пожалуйста, попробуйте снова.');
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
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{getHintText()}</p>
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
                      checked={creationMethod === 'byThemes' ? theme.isIncluded : true}
                      onChange={() => creationMethod === 'byThemes' && handleThemeToggle(theme.keyword)}
                      label={theme.keyword}
                      disabled={creationMethod === 'general'} // Отключаем чекбокс при 'general'
                    />
                  </div>
                  <textarea
                    value={theme.relatedSentences}
                    onChange={(e) => handleRelatedSentencesChange(theme.keyword, e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Связанные предложения"
                    disabled={creationMethod === 'general' && !theme.isIncluded} // Отключаем редактирование при 'general' если тема не включена
                  />
                  {(creationMethod === 'byThemes' && theme.isIncluded) || creationMethod === 'general' ? (
                    <div className="space-y-2 mt-2">
                      {creationMethod === 'byThemes' && theme.isIncluded && (
                        <>
                          <div className="mb-6">
                            <label htmlFor={`multipleChoiceCount-${theme.keyword}`} className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                              Количество вопросов с одним правильным ответом:
                            </label>
                            <input
                              type="number"
                              id={`multipleChoiceCount-${theme.keyword}`}
                              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                              placeholder="Введите количество вопросов"
                              value={theme.multipleChoiceCount}
                              onChange={(e) => handleThemeQuestionCountChange(theme.keyword, e.target.value, 'multipleChoiceCount')}
                            />
                          </div>

                          <div className="mb-6">
                            <label htmlFor={`openAnswerCount-${theme.keyword}`} className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                              Количество вопросов с открытым ответом:
                            </label>
                            <input
                              type="number"
                              id={`openAnswerCount-${theme.keyword}`}
                              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                              placeholder="Введите количество вопросов"
                              value={theme.openAnswerCount}
                              onChange={(e) => handleThemeQuestionCountChange(theme.keyword, e.target.value, 'openAnswerCount')}
                            />
                          </div>
                        </>
                      )}
                      {creationMethod === 'general' && (
                        <>
                          {/* Для метода 'general' можно добавить общие поля, если необходимо */}
                        </>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Общее количество вопросов */}
        {creationMethod === 'general' && (
          <div className="mb-6">
            <div className="mb-6">
              <label htmlFor="multipleChoiceCount" className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                Количество вопросов с одним правильным ответом:
              </label>
              <input
                type="number"
                id="multipleChoiceCount"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="Введите количество вопросов"
                value={multipleChoiceCount}
                onChange={handleMultipleChoiceCountChange}
              />
            </div>

            <div className="mb-6">
              <label htmlFor="openAnswerCount" className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                Количество вопросов с открытым ответом:
              </label>
              <input
                type="number"
                id="openAnswerCount"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="Введите количество вопросов"
                value={openAnswerCount}
                onChange={handleOpenAnswerCountChange}
              />
            </div>
          </div>
        )}

        {/* Кнопка отправки */}
        <div className="text-center">
          <button
            type="submit"
            className={`w-full px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400`}
            disabled={loading}
          >
            {loading ? 'Создаю тест...' : 'Создать тест'}
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CreateTestPage;
