import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import CustomCheckbox from '../../components/customCheckbox/CustomCheckbox';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL } from '../../config/config';

const CreateTestPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const lectureData = location.state;

  const [testTitle, setTestTitle] = useState('');
  
  // Состояния для работы с типами теста
  const [testTypes, setTestTypes] = useState([]);

  // Остальные состояния
  const [creationMethod, setCreationMethod] = useState('general');
  const [totalQuestions, setTotalQuestions] = useState('');
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [multipleChoiceCount, setMultipleChoiceCount] = useState('');
  const [openAnswerCount, setOpenAnswerCount] = useState('');

  const [newThemeKeyword, setNewThemeKeyword] = useState('');
  const [newThemeSentences, setNewThemeSentences] = useState('');
  const [isAddingTheme, setIsAddingTheme] = useState(false);

  useEffect(() => {
    if (lectureData) {
      console.log('Полученные данные от предыдущей страницы:', lectureData);
      if (lectureData.segments && Array.isArray(lectureData.segments)) {
        const initializedThemes = lectureData.segments.map((theme) => ({
          keyword: theme.keyword,
          sentences: theme.sentences,
          isIncluded: false,
          multipleChoiceCount: '',
          openAnswerCount: '',
          relatedSentences: theme.sentences.join(' '),
        }));
        setThemes(initializedThemes);
        console.log('Инициализированные темы:', initializedThemes);
      } else {
        console.error('Поле "segments" отсутствует или имеет неверный формат.');
      }
    } else {
      console.error('Данные от предыдущей страницы отсутствуют.');
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
    if (value === '' || (/^\d+$/.test(value) && parseInt(value, 10) >= 0)) {
      setMultipleChoiceCount(value);
    } else {
      setMultipleChoiceCount('0');
    }
  };

  const handleOpenAnswerCountChange = (e) => {
    const value = e.target.value;
    if (value === '' || (/^\d+$/.test(value) && parseInt(value, 10) >= 0)) {
      setOpenAnswerCount(value);
    } else {
      setOpenAnswerCount('0');
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
    if (count === '' || (/^\d+$/.test(count) && parseInt(count, 10) >= 0)) {
      setThemes((prevThemes) =>
        prevThemes.map((theme) =>
          theme.keyword === id ? { ...theme, [type]: count } : theme
        )
      );
    } else {
      setThemes((prevThemes) =>
        prevThemes.map((theme) =>
          theme.keyword === id ? { ...theme, [type]: '0' } : theme
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

  const handleAddNewTheme = () => {
    if (!newThemeKeyword.trim()) {
      toast.error('Пожалуйста, введите ключевое слово для новой темы.');
      return;
    }

    if (themes.some((theme) => theme.keyword === newThemeKeyword.trim())) {
      toast.error('Тема с таким ключевым словом уже существует.');
      return;
    }

    const newTheme = {
      keyword: newThemeKeyword.trim(),
      sentences: newThemeSentences.split('\n'),
      isIncluded: false,
      multipleChoiceCount: '',
      openAnswerCount: '',
      relatedSentences: newThemeSentences.trim(),
    };

    setThemes((prevThemes) => [...prevThemes, newTheme]);
    setNewThemeKeyword('');
    setNewThemeSentences('');
    setIsAddingTheme(false);
    toast.success('Новая тема успешно добавлена.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!testTitle.trim()) {
      toast.error('Пожалуйста, введите название теста.');
      return;
    }

    let selectedThemes = [];
    if (creationMethod === 'byThemes') {
      selectedThemes = themes.filter((theme) => theme.isIncluded);
      if (selectedThemes.length === 0) {
        toast.error('Пожалуйста, выберите хотя бы одну тему.');
        return;
      }

      for (let theme of selectedThemes) {
        const mcCount = parseInt(theme.multipleChoiceCount, 10) || 0;
        const oaCount = parseInt(theme.openAnswerCount, 10) || 0;
        if (mcCount <= 0 && oaCount <= 0) {
          toast.error(`Для темы "${theme.keyword}" необходимо указать хотя бы одно количество вопросов.`);
          return;
        }
        if (mcCount < 0 || oaCount < 0) {
          toast.error(`Количество вопросов в теме "${theme.keyword}" не может быть отрицательным.`);
          return;
        }
      }
      selectedThemes = selectedThemes.map((theme) => ({
        keyword: theme.keyword,
        sentences: theme.sentences,
        multipleChoiceCount: parseInt(theme.multipleChoiceCount, 10) || 0,
        openAnswerCount: parseInt(theme.openAnswerCount, 10) || 0,
      }));
    } else if (creationMethod === 'general') {
      const mcCount = parseInt(multipleChoiceCount, 10) || 0;
      const oaCount = parseInt(openAnswerCount, 10) || 0;

      if (mcCount <= 0 && oaCount <= 0) {
        toast.error('Необходимо указать хотя бы одно количество вопросов: с одним правильным ответом или с открытым ответом.');
        return;
      }

      if (mcCount < 0 || oaCount < 0) {
        toast.error('Количество вопросов не может быть отрицательным.');
        return;
      }

      selectedThemes = themes.map((theme) => ({
        keyword: theme.keyword,
        sentences: theme.sentences,
        multipleChoiceCount: mcCount,
        openAnswerCount: oaCount,
      }));
    }

    setLoading(true);

    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      };


      const payload = {
        method: creationMethod,
        title: testTitle,
        multipleChoiceCount: creationMethod === 'general' ? parseInt(multipleChoiceCount, 10) || 0 : undefined,
        openAnswerCount: creationMethod === 'general' ? parseInt(openAnswerCount, 10) || 0 : undefined,
        themes: selectedThemes,
        lectureMaterials: lectureData ? lectureData.materials : undefined,
      };

      console.log('Отправляемый payload:', payload);

      const url = `${API_BASE_URL}/tests/create/`;
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success('Тест успешно создан!');
        navigate('/tests/edit', { state: result });
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
      return 'Автоматически создадутся выбранное количество вопросов. Необходимо указать хотя бы одно количество вопросов: с одним правильным ответом или с открытым ответом.';
    } else if (creationMethod === 'byThemes') {
      return 'Вы можете создать вопросы по предложениям включающие определённые термины';
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
              <span className="ml-2 text-gray-800 dark:text-gray-200">Термины</span>
            </label>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{getHintText()}</p>
        </div>

        {(creationMethod === 'byThemes') && (
          <div className="mb-6 space-y-4">
            <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">Термины теста:</label>

            {/* Форма добавления новой темы */}
            <div className="mb-6">
              {!isAddingTheme ? (
                <button
                  type="button"
                  onClick={() => setIsAddingTheme(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
                >
                  Добавить термин
                </button>
              ) : (
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                  <div className="mb-4">
                    <label htmlFor="newThemeKeyword" className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                      Ответ:
                    </label>
                    <input
                      type="text"
                      id="newThemeKeyword"
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                      placeholder="Введите термин"
                      value={newThemeKeyword}
                      onChange={(e) => setNewThemeKeyword(e.target.value)}
                    />
                  </div>
              
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={handleAddNewTheme}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                    >
                      Сохранить
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingTheme(false);
                        setNewThemeKeyword('');
                        setNewThemeSentences('');
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-300"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              )}
            </div>

            {themes.map((theme) => (
              <div key={theme.keyword} className="border border-gray-300 rounded-lg p-4 bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                <div className="flex flex-col space-y-5">
                  <div className="flex items-center space-x-2">
                    <CustomCheckbox
                      id={`theme-${theme.keyword}`}
                      checked={creationMethod === 'byThemes' ? theme.isIncluded : true}
                      onChange={() => creationMethod === 'byThemes' && handleThemeToggle(theme.keyword)}
                      label={theme.keyword}
                      disabled={creationMethod === 'general'} 
                    />
                  </div>
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
                              placeholder="Введите количество вопросов или оставьте пустым"
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
                              placeholder="Введите количество вопросов или оставьте пустым"
                              value={theme.openAnswerCount}
                              onChange={(e) => handleThemeQuestionCountChange(theme.keyword, e.target.value, 'openAnswerCount')}
                            />
                          </div>
                        </>
                      )}
                      {creationMethod === 'general' && (
                        <>
                          <div className="mb-6">
                            <label htmlFor="multipleChoiceCount" className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                              Количество вопросов с одним правильным ответом:
                            </label>
                            <input
                              type="number"
                              id="multipleChoiceCount"
                              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                              placeholder="Введите количество вопросов или оставьте пустым"
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
                              placeholder="Введите количество вопросов или оставьте пустым"
                              value={openAnswerCount}
                              onChange={handleOpenAnswerCountChange}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}

        {(creationMethod === 'general') && (
          <div className="mb-6 space-y-4">
            <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">Общее количество вопросов:</label>

            <div className="mb-6">
              <label htmlFor="multipleChoiceCount" className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                Количество вопросов с одним правильным ответом:
              </label>
              <input
                type="number"
                id="multipleChoiceCount"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="Введите количество вопросов или оставьте пустым"
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
                placeholder="Введите количество вопросов или оставьте пустым"
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
