import React, {useState} from "react";
// import {Employee} from "../interfaces/Employee";
import EmployeeComponent from "./Employee";
import {Employees} from "../interfaces/Employees";

interface EmployeeOrgAppProps {
  ceo: Employees;
}

const EmployeeOrgApp: React.FC<EmployeeOrgAppProps> = ({ceo}) => {
  const [history, setHistory] = useState<
    {employeeID: number; oldSupervisorID: number}[]
  >([]);
  const [future, setFuture] = useState<
    {employeeID: number; newSupervisorID: number}[]
  >([]);

  const findEmployees = (employeeID: number, supervisorID: number) => {
    const findEmployee = (employee: Employees): Employees | undefined => {
      if (employee.uniqueId === employeeID) {
        return employee;
      }
      for (const sub of employee.subordinates) {
        const found = findEmployee(sub);
        if (found) {
          return found;
        }
      }
      return undefined;
    };

    const findSupervisor = (
      employee: Employees,
      supervisorID: number
    ): Employees | undefined => {
      if (employee.uniqueId === supervisorID) {
        return employee;
      }
      for (const sub of employee.subordinates) {
        if (sub.uniqueId === supervisorID) {
          return sub;
        }
        const found = findSupervisor(sub, supervisorID);
        if (found) {
          return found;
        }
      }
      return undefined;
    };

    const employee = findEmployee(ceo);
    const oldSupervisor = findSupervisor(ceo, employeeID);
    const newSupervisor = findSupervisor(ceo, supervisorID);

    return {employee, oldSupervisor, newSupervisor};
  };

  const moveEmployee = (employeeID: number, supervisorID: number) => {
    const {employee, oldSupervisor, newSupervisor} = findEmployees(
      employeeID,
      supervisorID
    );

    if (!employee || !oldSupervisor || !newSupervisor) {
      return; // Employee or supervisors not found
    }

    // Remove the employee from the old supervisor's subordinates
    oldSupervisor.subordinates = oldSupervisor.subordinates.filter(
      (emp) => emp.uniqueId !== employeeID
    );

    // Add the employee to the new supervisor's subordinates
    newSupervisor.subordinates.push(employee);

    // Save the move action to the history
    setHistory([
      ...history,
      {employeeID, oldSupervisorID: oldSupervisor.uniqueId},
    ]);

    // Clear the future (redo) actions after a new move action
    setFuture([]);
  };

  const undoMove = () => {
    if (history.length === 0) {
      return; // Nothing to undo
    }

    // Get the last move action from the history
    const {employeeID, oldSupervisorID} = history[history.length - 1];

    const {employee, oldSupervisor, newSupervisor} = findEmployees(
      employeeID,
      oldSupervisorID
    );

    if (!employee || !oldSupervisor || !newSupervisor) {
      return; // Employee or supervisors not found
    }

    // Revert the move action
    oldSupervisor.subordinates.push(employee);
    newSupervisor.subordinates = newSupervisor.subordinates.filter(
      (emp) => emp.uniqueId !== employeeID
    );

    // Save the move action to the future for potential redo
    setFuture([
      ...future,
      {employeeID, newSupervisorID: newSupervisor.uniqueId},
    ]);

    // Remove the move action from the history
    setHistory(history.slice(0, -1));
  };

  const redoMove = () => {
    if (future.length === 0) {
      return; // Nothing to redo
    }

    // Get the last undone action from the future
    const {employeeID, newSupervisorID} = future[future.length - 1];

    const {employee, oldSupervisor, newSupervisor} = findEmployees(
      employeeID,
      newSupervisorID
    );

    if (!employee || !oldSupervisor || !newSupervisor) {
      return; // Employee or supervisors not found
    }

    // Redo the move action
    oldSupervisor.subordinates = oldSupervisor.subordinates.filter(
      (emp) => emp.uniqueId !== employeeID
    );
    newSupervisor.subordinates.push(employee);

    // Save the move action back to the history for potential undo
    setHistory([
      ...history,
      {employeeID, oldSupervisorID: oldSupervisor.uniqueId},
    ]);

    // Remove the redo action from the future
    setFuture(future.slice(0, -1));
  };

  return (
    <div>
      <h1>Employee Organization Chart</h1>
      <EmployeeComponent employee={ceo} moveEmployee={moveEmployee} />
      {/* Display other employees and their subordinates */}
      {/* ... */}
      <div>
        {/* Disable the Undo button when history is empty */}
        <button
          className={`btn-style ${history.length === 0 ? "disabled" : ""}`}
          onClick={undoMove}
          disabled={history.length === 0}
        >
          Undo
        </button>
        {/* Disable the Redo button when future is empty */}
        <button
          className={`btn-style ${future.length === 0 ? "disabled" : ""}`}
          onClick={redoMove}
          disabled={future.length === 0}
        >
          Redo
        </button>
      </div>
    </div>
  );
};

export default EmployeeOrgApp;
