import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { EmpireProvider } from './context/EmpireContext';
import ErrorBoundary from './components/ui/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <EmpireProvider>
        <App />
      </EmpireProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
