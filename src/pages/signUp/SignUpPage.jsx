// SignUpPage.js

import React, { useState } from 'react';
import axios from 'axios';
import InputField from '../../components/inputField/InputField';
import SubmitButton from '../../components/submitButton/submitButton';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL } from '../../config/config'; // Импортируем конечные точки

const SignUpPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };
  var url = `${API_BASE_URL}/login/`;
  const handleLogin = (email, password) => { // Изменены параметры на email и password
    axios.post(url, { email, password }) // Изменен URL
      .then(response => {
        const { access_token, token_type } = response.data;
        localStorage.setItem('accessToken', access_token);
        localStorage.setItem('tokenType', token_type); 
        toast.success("Вход выполнен успешно!");
        navigate('/'); 
      })
      .catch(error => {
        let errorMessage = "Ошибка при входе";
        if (error.response && error.response.data && error.response.data.detail) {
          if (Array.isArray(error.response.data.detail)) {
            errorMessage = error.response.data.detail.map(d => `${d.loc.join('.')} - ${d.msg}`).join("\n");
          } else {
            errorMessage = error.response.data.detail;
          }
        }
        toast.error(errorMessage);
        console.error("Ошибка входа:", error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requestData = {
      username: userData.username.trim(),
      email: userData.email.trim(),
      password: userData.password,
    };
    var url = `${API_BASE_URL}/register/`;
    axios.post(url, requestData) // Изменен порт
      .then(response => {
        if (response.status === 201) {
          toast.success("Регистрация прошла успешно!");
          handleLogin(userData.email, userData.password); // Передаем email
        } else {
          toast.error(response.data.detail || "Ошибка регистрации");
        }
      })
      .catch(error => {
        let errorMessage = "Произошла ошибка при регистрации!";
        if (error.response && error.response.data && error.response.data.detail) {
          errorMessage = error.response.data.detail;
        }
        toast.error(errorMessage);
        console.error("Ошибка регистрации:", error);
      });
  };

  return (
    <div className="flex justify-center min-h-screen">
      <ToastContainer />
      <div className="w-full max-w-[1300px] ">
        <main className="mt-[10%] w-full h-[100vh] ">
          <form className="max-w-[400px] mx-auto p-5 shadow-xl rounded-xl " onSubmit={handleSubmit}>
            <InputField label="Email" name="email" type="email" required value={userData.email} onChange={handleInputChange} />
            <InputField label="Логин" name="username"  type="text" required  value={userData.username} onChange={handleInputChange}  />
            <InputField label="Пароль" name="password" type="password" required value={userData.password} onChange={handleInputChange} />
            <button type="submit" className="w-full  bg-[#89abfc] dark:bg-[#4b6cb7] hover:bg-[#4b6cb7] dark:hover:bg-[#89abfc] text-customGray dark:text-trueWhite hover:text-trueWhite dark:hover:text-customGray font-semibold rounded-md transition duration-300 p-2.5">Зарегистрироваться</button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default SignUpPage;
