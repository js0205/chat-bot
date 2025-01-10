import React, { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { useCookies } from "react-cookie";
import Cookies from 'js-cookie';
import { updateUsername } from '../store/userStore'; 

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cookies, setCookie] = useCookies(["user"]);
  const handleLogin = async () => {
    // Cookies.set('user', username.toString(), { expires: 7 }); // 设置一个7天后过期的cookie
    // navigate("/main");

    try {
      const response = await fetch("http://10.98.193.46:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        Cookies.set('user', username, { expires: 7 }); // 设置一个7天后过期的cookie
        const userCookie = Cookies.get('user'); // 读取刚刚设置的cookie
        console.log('登录后设置的user Cookie:', userCookie);
        console.log('登录成功');
        dispatch(updateUsername(username));
        navigate("/main");
      } else {
        window.alert("用户名或密码错误");
        console.error("登录失败");
      }
    } catch (error) {
      console.error("请求错误：", error);
    }
  };

  const handleRegister = () => {
    window.location.href = "https://jsj.top/f/YPTj9b";
  };

  return (
    <div className="login-container">
      <h2 className="login-title">欢迎您使用FabGPT</h2>
      <div className="login-form">
        <input
          type="text"
          placeholder="用户名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="button-container">
          <button className="login-button" onClick={handleLogin}>
            登录
          </button>
          <button className="register-button" onClick={handleRegister}>
            注册
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;