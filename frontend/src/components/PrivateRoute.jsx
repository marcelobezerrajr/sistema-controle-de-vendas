import React, { useContext } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { LoginContext } from '../context/LoginContext';

const PrivateRoute = ({ element: Component, ...rest }) => {
  const { user } = useContext(LoginContext);

  return user ? (
    <Route {...rest} element={<Component />} />
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
