import React, { useState, useEffect } from 'react';
import Card from '../../components/card/Card';
import MiniLoadingSpinner from '../../components/loading/MiniLoadingSpinner';
import { useNavigate } from 'react-router-dom'; // Импортируйте useNavigate

const Catalog = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSupervisor, setIsSupervisor] = useState(false);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate(); // Используем хук для навигации

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://127.0.0.1:8000/api/projects/');
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setIsSupervisor(role === 'SUPERVISOR');
    setUserRole(role);
  }, []);


  const handleEditTeams = () => {
    navigate('/EditTeamPage'); 
  };

  const handleJoinProject = () => {
    navigate(`/Join-project/`); 
  };

  return (
    <div className="flex flex-wrap justify-center w-full relative">
      {loading ? (
        <MiniLoadingSpinner />
      ) : projects.length > 0 ? (
        <>
        <div className="w-full flex justify-end">
          {isSupervisor && (
            <button
              className="m-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
              onClick={handleEditTeams}
            >
              Изменить команды
            </button>
          )}
          {userRole === 'STUDENT' && (
                <button
                  className="m-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
                  onClick={() => handleJoinProject()}
                >
                  Вступить в проект
                </button>
              )}
          </div>
          {projects.map((project) => (
            <Card key={project.id} {...project}>
            </Card>
          ))}
        </>
      ) : (
        <p className="text-xl text-center w-full">Проекты не найдены.</p>
      )}
    </div>
  );
};

export default Catalog;