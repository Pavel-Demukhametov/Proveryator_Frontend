import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ studentComponent: StudentComponent, curatorComponent: CuratorComponent, defaultComponent: DefaultComponent }) => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('accessToken');
  const role = localStorage.getItem('role');

  if (!isAuthenticated) {
    return <Navigate to="/Login" state={{ from: location }} replace />;
  }

  switch (role) {
    case 'STUDENT':
      return StudentComponent ? <StudentComponent /> : <DefaultComponent />;
    case 'CURATOR':
      return CuratorComponent ? <CuratorComponent /> : <DefaultComponent />;
    default:
      return DefaultComponent ? <DefaultComponent /> : null;
  }
};

export default PrivateRoute;