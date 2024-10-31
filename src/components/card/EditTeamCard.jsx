import React, { useState } from 'react';
import Dropdown from '../dropDown/DropDown';
import SimpleTag from '../tag/Tag';

const EditTeamCard = ({ project, allStudents, onStudentChange }) => {
    const [selectedStudentIds, setSelectedStudentIds] = useState(project.students.map(s => s.id_st));

    const handleSelectChange = (selectedIds) => {
        setSelectedStudentIds(selectedIds);
        onStudentChange(project.id, selectedIds);
    };

    const handleRemoveStudent = (studentId) => {
        const newSelectedStudentIds = selectedStudentIds.filter(id => id !== studentId);
        setSelectedStudentIds(newSelectedStudentIds);
        onStudentChange(project.id, newSelectedStudentIds);
    };

    const selectedStudents = allStudents.filter(student => selectedStudentIds.includes(student.id));

    return (
        <div className="bg-white dark:bg-gray-700 shadow-lg rounded-lg p-4 flex flex-col md:flex-row justify-between">
            <div>
                <h3 className="text-lg font-semibold dark:text-white">{project.project_name}</h3>
                <p className="text-gray-600 dark:text-gray-300">{project.description}</p>
            </div>
            <div className="flex flex-col items-end">
                <Dropdown
                    items={allStudents.map(student => ({ id: student.id, label: student.full_name }))}
                    placeholder="Выберите студентов"
                    selectedItems={selectedStudentIds}
                    onSelectionChange={handleSelectChange}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                    {selectedStudents.map((student) => (
                        <SimpleTag
                            key={student.id}
                            tagName={student.full_name}
                            color="blue"
                            onRemove={() => handleRemoveStudent(student.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EditTeamCard;