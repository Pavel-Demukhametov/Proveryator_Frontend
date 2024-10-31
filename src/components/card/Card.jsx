import React from 'react';
import { Link } from 'react-router-dom';
import SimpleTag from '../tag/Tag'; 

const Card = ({
  id,
  project_name,
  description,
  created_date,
  status_name,
  supervisors,
  students,
  roles
}) => {
  return (
    <article className="w-full p-4 rounded-md shadow-md bg-white dark:bg-gray-800 hover:bg-gray-100 hover:dark:bg-gray-700">
      <div className='flex justify-between mb-2'>
        <div className="text-sm text-gray-500 dark:text-gray-300">
          {new Date(created_date).toLocaleDateString()}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-300">
          {status_name}
        </div>
      </div>
      <div className="flex justify-between">
        <Link to={`/projects/${id}`} className="no-underline flex-grow">
          <div>
            <h3 className="text-lg font-semibold leading-6 text-left dark:text-blueText">
              {project_name || "Проект без названия"}
            </h3>
            <div className="flex flex-wrap mt-2">
              {roles.map((role) => (
                <SimpleTag
                  key={role.id}
                  tagName={role.role_name}
                  color="blue"
                />
              ))}
            </div>
            <p className="mt-2 text-sm leading-6 text-left line-clamp-3 text-gray-600 dark:text-gray-400">
              {description || "Описание отсутствует"}
            </p>
          </div>
        </Link>
        {supervisors && supervisors.length > 0 && (
          <div className="flex flex-col justify-start ml-4">
            {supervisors.map((supervisor) => (
              <div key={supervisor.id_sv} className="text-sm leading-6 text-right text-gray-600 dark:text-gray-400">
                {supervisor.full_name}
              </div>
            ))}
          </div>
        )}
      </div>
      {students && students.length > 0 && (
        <div className="mt-2 text-sm leading-6 text-left text-gray-600 dark:text-gray-400">
          <h4 className="text-md font-semibold">Студенты:</h4>
          {students.map((student) => (
            <div key={student.id_st}>{student.full_name}</div>
          ))}
        </div>
      )}
    </article>
  );
};

export default Card;