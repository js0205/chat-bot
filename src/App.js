import React, { useEffect, useState } from 'react';
import './App.css';
import Layout from './layout/index';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './login/login';
import Register from './login/Register';
import Cookies from 'js-cookie';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const cookies = Cookies.get('user');
    setIsAuthenticated(cookies !== undefined && cookies !== '');
  }, []);

  // 处理默认路由的变量
  const defaultRoute = isAuthenticated ? <Route path="/main" element={<Layout />} /> : <Route path="/" element={<Navigate to="/login" />} />;

  return (
    <Router>
      <div className="App">
        <div className="chat-page-container">
          <Routes>
            <Route path="/main" element={<Layout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* 其他路由 */}
            {defaultRoute} {/* 将默认路由放在最后 */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;