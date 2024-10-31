import React from 'react';
import { Link } from 'react-router-dom';
import SimpleTag from '../tag/Tag';

const OpenCard = ({
  id,
  project_name,
  description,
  created_date,
  status_name,
  onInterestChange,
  supervisors, 
  roles 
}) => {
  return (
    <article className="w-full group p-4 rounded-md shadow-md bg-white dark:bg-gray-800 hover:bg-gray-100 hover:dark:bg-gray-700 flex justify-between">
      <div className="flex-grow">
        <div className="text-sm text-gray-500 dark:text-gray-300 mb-2">
          {new Date(created_date).toLocaleDateString()}
        </div>
        <Link to={`/projects/${id}`} className="no-underline">
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
      </div>
      <div className="flex flex-col justify-start ml-4 space-y-2"> 
        <div className="text-sm text-gray-500 dark:text-gray-300">
          {status_name}
        </div>
        {supervisors && supervisors.length > 0 && (
          <div className="flex flex-col items-end">
            {supervisors.map((supervisor) => (
              <div key={supervisor.id_sv} className="text-sm text-gray-600 dark:text-gray-400">
                {supervisor.full_name}
              </div>
            ))}
          </div>
        )}
        <div>
          <label htmlFor={`interest-select-${id}`} className="text-sm text-gray-500 dark:text-gray-300 mb-1 block">
            Заинтересованность:
          </label>
          <select
            id={`interest-select-${id}`}
            className="bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 p-1 rounded"
            onChange={(e) => onInterestChange(id, e.target.value)}
          >
            <option value="">Выберите...</option>
            <option value="1">Не хочу участвовать</option>
            <option value="2">Нейтральное отношение</option>
            <option value="3">Хочу участвовать</option>
          </select>
        </div>
      </div>
    </article>
  );
};

export default OpenCard;