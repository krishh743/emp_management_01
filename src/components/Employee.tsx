import React from "react";
import {Employees} from "../interfaces/Employees";

interface EmployeeComponentProps {
  employee: Employees;
  moveEmployee: (employeeID: number, supervisorID: number) => void;
}

const EmployeeComponent: React.FC<EmployeeComponentProps> = ({
  employee,
  moveEmployee,
}) => {
  const handleMoveClick = (subordinateId: number) => {
    moveEmployee(subordinateId, employee.uniqueId);
  };

  return (
    <div className="employee">
      <h3>{employee.name}</h3>
      {employee.subordinates.length > 0 && (
        <ul className="subordinates-list">
          {employee.subordinates.map((subordinate: Employees) => (
            <li key={subordinate.uniqueId} className="subordinate-item">
              <span>{subordinate.name}</span>
              <button
                className="move-button"
                onClick={() => handleMoveClick(subordinate.uniqueId)}
              >
                Move
              </button>
              <EmployeeComponent
                employee={subordinate}
                moveEmployee={moveEmployee}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmployeeComponent;
