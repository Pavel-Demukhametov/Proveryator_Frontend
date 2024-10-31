import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import MiniLoadingSpinner from '../../components/loading/MiniLoadingSpinner';
import Tag from '../../components/tag/Tag';
import FeedbackForm from '../../components/feedback/FeedBackForm';
import FeedbackSection from '../../components/feedback/FeedbackSection';

const InformationBlock = ({ title, children }) => (
  <div className="mb-4 p-3 rounded-md shadow-md dark:bg-customGray bg-trueWhite">
    <h2 className="mb-2 text-xl md:text-md lg:text-lg xl:text-xl font-semibold dark:text-blueText">{title}</h2>
    {children}
  </div>
);

const ProjectPage = () => {
  const { projectId } = useParams();
  const [projectData, setProjectData] = useState({
    documentation: [],
    project_name: '',
    status_name: '',
    created_date: '',
    feedback: []
  });
  const [loading, setLoading] = useState(true);
  const [docUrl, setDocUrl] = useState(''); 

  const fetchProjectData = async () => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    };

    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/projects/${projectId}`, { headers });
      setProjectData(response.data);
      fetchFeedback();
      setLoading(false);
    } catch (error) {
      console.error('Error fetching project data:', error);
      setLoading(false);
    }
  };

  const fetchFeedback = async () => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    };

    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/projects/${projectId}/feedback/`, { headers });
      setProjectData(prevState => ({
        ...prevState,
        feedback: response.data || []
      }));
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setProjectData(prevState => ({
        ...prevState,
        feedback: [] 
      }));
    }
  };

  useEffect(() => {
    fetchProjectData();
    fetchFeedback();
  }, [projectId]);

  const handleDocSubmit = async (event) => {
    event.preventDefault();
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      };
      const response = await axios.post(`http://127.0.0.1:8000/api/projects/${projectId}/post/`, {
        docUrl
      }, { headers });

      fetchProjectData(); 
      setDocUrl(''); 
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add documentation');
    }
  };

  if (loading) {
    return <MiniLoadingSpinner />;
  }

  return (
    <div className="mx-auto min-h-screen pt-5 bg-lightHeader dark:bg-darkGray dark:text-lightGray">
      <Link to="/projects" className="flex no-underline">
        <button className="dark:text-trueWhite text-customGray font-bold mb-3 dark:bg-customGray bg-gray-200 hover:underline cursor-pointer mt-2 rounded-md p-2">
          Back
        </button>
      </Link>

      <div className="p-3 rounded-md shadow-md dark:bg-customGray bg-trueWhite flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(projectData.created_date).toLocaleDateString()}</p>
          <h1 className="text-3xl font-bold dark:text-blueText">{projectData.project_name}</h1>
        </div>
        <div className="mt-2 flex flex-col items-end">
          <p className="text-lg font-semibold text-gray-800 dark:text-blueText">{projectData.status_name}</p>
        </div>
      </div>

      <div className="flex flex-wrap justify-between">
        <div className="w-full lg:w-2/3 p-3">
          <InformationBlock title="Описание">
            {projectData.description ? (
              <p>{projectData.description}</p>
            ) : (
              <p>Без описания</p>
            )}
          </InformationBlock>
          <InformationBlock title="Отзывы от куратора">
            <FeedbackSection feedback={projectData.feedback} />
            {projectData.participation === 1 && (
              <FeedbackForm projectId={projectId} fetchFeedback={fetchFeedback} />
            )}
          </InformationBlock>
        </div>
        <div className="w-full lg:w-1/3 p-3">
          <InformationBlock title="Кураторы">
            {projectData.supervisors && projectData.supervisors.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {projectData.supervisors.map((supervisor, index) => (
                  <Tag key={index} id={supervisor.id_sv} color="orange" tagName={supervisor.full_name} />
                ))}
              </div>
            ) : (
              <p>Нет кураторов</p>
            )}
          </InformationBlock>
          <InformationBlock title="Команда">
            {projectData.students && projectData.students.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {projectData.students.map((student, index) => (
                  <Tag key={index} Id={student.id_st} color="blue" tagName={student.full_name} />
                ))}
              </div>
            ) : (
              <p>Нет команды</p>
            )}
          </InformationBlock>
          <InformationBlock title="Документация">
            {projectData.documentation && projectData.documentation.length > 0 ? (
              <div>
                {projectData.documentation.map((doc, index) => (
                  <p key={index} className="break-words">
                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-200 truncate inline-block w-full">
                      {doc.url}
                    </a>
                  </p>
                ))}
              </div>
            ) : (
              <p>Нет документации</p>
            )}
            {projectData.participation === 1 && (
              <form className="mt-4" onSubmit={handleDocSubmit}>
                <label htmlFor="docUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Добавить ссылку на облако:</label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    name="docUrl"
                    id="docUrl"
                    className="flex-1 block w-full rounded-l-md sm:text-sm border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Введите url"
                    value={docUrl}
                    onChange={(e) => setDocUrl(e.target.value)}
                  />
                  <button type="submit" className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700">
                    Добавить документацию
                  </button>
                </div>
              </form>
            )}
          </InformationBlock>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;