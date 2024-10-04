import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { MainProvider } from './context/MainContext';
import Routes from './routes';
import './styles/global.css';

const App = () => {
  return (
    <AuthProvider>
      <MainProvider>
        <Routes />
      </MainProvider>
    </AuthProvider>
  );
};

export default App;
