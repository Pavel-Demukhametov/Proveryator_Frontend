import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputField from '../../components/inputField/InputField';

const LoginPage = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:8000/api/auth/login', loginData)
    .then(response => {
      const { access, refresh, user } = response.data; 
      const { role } = user; 
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('userRole', role);
      toast.success("Вход выполнен успешно!");
      navigate('/');
    })
    .catch(error => {
      toast.error("Произошла ошибка при входе!");
      console.error("Ошибка входа:", error);
    });
  };

  return (
    <div className="flex justify-center min-h-screen">
      <ToastContainer />
      <div className="w-full max-w-[1300px] ">
        <main className="mt-[10%] w-full h-[100vh] ">
          <form className="max-w-[400px] mx-auto p-5 shadow-xl rounded-xl" onSubmit={handleSubmit}>
            <InputField label="Email" name="email" type="email" required value={loginData.email} onChange={handleInputChange} />

            <InputField label="Пароль" name="password" type="password" required value={loginData.password} onChange={handleInputChange} />

            <button type="submit" className="w-full bg-[#89abfc] dark:bg-[#4b6cb7] hover:bg-[#4b6cb7] dark:hover:bg-[#89abfc] text-customGray dark:text-trueWhite hover:text-trueWhite dark:hover:text-customGray font-semibold rounded-md transition duration-300 p-2.5">Войти</button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default LoginPage;