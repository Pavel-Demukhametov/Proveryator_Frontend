import React, { useState } from 'react';
import Dropdown from '../dropDown/DropDown';
import SimpleTag from '../tag/Tag';



const StudentCard = ({ student, roles, onRolesChange }) => {
    const [selectedRoleIds, setSelectedRoleIds] = useState(student.role || []);

    const handleSelectChange = (selectedIds) => {
        setSelectedRoleIds(selectedIds);
        onRolesChange(student.id, selectedIds);
    };


    const handleRemoveRole = (roleId) => {
        const newSelectedRoleIds = selectedRoleIds.filter(id => id !== roleId);
        setSelectedRoleIds(newSelectedRoleIds);
        onRolesChange(student.id, newSelectedRoleIds);
    };


    const selectedRoles = roles.filter(role => selectedRoleIds.includes(role.id));


    return (
        <div className="bg-white dark:bg-gray-700 shadow-lg rounded-lg p-4 flex flex-col  md:flex-row justify-between">
            <div>
                <h3 className="text-lg font-semibold dark:text-white">{student.full_name}</h3>
                <p className="text-gray-600 dark:text-gray-300">{student.email}</p>
                <p className="text-gray-600 dark:text-gray-300">{`Курс: ${student.course}, Направление: ${student.direction}`}</p>
            </div>
           
    <div className="flex flex-col items-end">
        <Dropdown
            items={roles.map(role => ({ id: role.id, label: role.label }))}
            placeholder="Выберите роли"
            selectedItems={selectedRoleIds}
            onSelectionChange={handleSelectChange}
        />
        <div className="flex flex-wrap gap-2 mt-2">
            {selectedRoles.map((role) => (
                <SimpleTag
                    key={role.id}
                    tagName={role.label}
                    color="blue"
                    onRemove={() => handleRemoveRole(role.id)}
                />
            ))}
        </div>
            </div>
        </div>
    );
};
export default StudentCard;