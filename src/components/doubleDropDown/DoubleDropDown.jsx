import React, { useState } from 'react';

const DoubleDropDown = ({ directions, courses, addConstraint }) => {
  const [selectedDirectionId, setSelectedDirectionId] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');

  const handleAddConstraint = () => {
    if (selectedDirectionId && selectedCourseId) {
      addConstraint({
        directionId: parseInt(selectedDirectionId), 
        courseId: parseInt(selectedCourseId)
      });
      setSelectedDirectionId('');
      setSelectedCourseId('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <select
          value={selectedDirectionId}
          onChange={(e) => setSelectedDirectionId(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Выберите направление</option>
          {directions.map((dir) => (
            <option key={dir.id} value={dir.id}>{dir.direction_name}</option>
          ))}
        </select>

        <select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Выберите курс</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>{course.course_name}</option>
          ))}
        </select>

        <button
  type="button"
  onClick={handleAddConstraint}
  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
>
  Добавить
</button>
      </div>
    </div>
  );
};

export default DoubleDropDown;