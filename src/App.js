import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layout/Layout';
import NotFound from './pages/notFound/NotFoundPage';
import WelcomePage from './pages/welcome/WelcomePage';
import SignUpPage from './pages/signUp/SignUpPage';
import LoginPage from './pages/login/LoginPage';
import UploadLecturePage from './pages/uploadLecture/UploadLecturePage';
import CreateTestPage from './pages/createTest/CreateTestPage';
import Catalog from './pages/projectCatalog/ProjectCatalogPage';
import TestCatalogPage from './pages/testsCatalog/TestCatalogPage';
import TestInfoPage from './pages/testInfo/TestInfoPage';
import EditTestPage from './pages/editTest/EditTestPage';


const requireAuthAndRole = (component, role) => {
  const isAuthenticated = localStorage.getItem('accessToken');
  const userRole = localStorage.getItem('userRole'); 
  if (isAuthenticated && userRole === role) {
    return component;
  } else if (isAuthenticated){
    return <Navigate to="/NotFound" />;
  }
  else {
    return <Navigate to="/Login" />; 
  }
};

function App() {
  return (
    <Router>
      <div className="App bg-lightHeader dark:bg-darkGray min-w-[350px] min-h-screen max-h-200px">
        <Routes>
          <Route index element={<WelcomePage />} />
          <Route path="/" element={<Layout />}>
            <Route path="SignUp/" element={<SignUpPage />} />
            <Route path="Login/" element={<LoginPage />} />
            
            <Route path="test/" element={<Catalog />} />
            <Route path="test/:id" element={<TestInfoPage />} />
            <Route path="upload/"element={ <UploadLecturePage/>} />
            <Route path="create/test"element={ <CreateTestPage/>} />
            <Route path="tests"element={ <TestCatalogPage/>} />
            <Route path="/tests/edit" element={<EditTestPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;