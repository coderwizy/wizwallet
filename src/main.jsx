import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { EmpireProvider } from './context/EmpireContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <EmpireProvider>
      <App />
    </EmpireProvider>
  </React.StrictMode>
);
