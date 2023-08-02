import React from 'react';
import logo from './logo.svg';
import './App.css';
import EmployeeOrgApp from './components/EmployeeOrgApp';
import { ceo } from './data'; // Import your CEO data here


function App() {
  return (
    <div className="App">
      <EmployeeOrgApp ceo={ceo} />
    </div>
  );
}

export default App;
