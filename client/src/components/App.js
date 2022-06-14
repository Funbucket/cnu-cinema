import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Auth from '../hoc/auth';
import LandingPage from './views/LandingPage/LandingPage';
import LoginPage from './views/LoginPage/LoginPage';
import RegisterPage from './views/RegisterPage/RegisterPage';
import NavBar from "./views/NavBar/NavBar";
import AdminPage from "./views/AdminPage/AdminPage";
import MyPage from "./views/MyPage/MyPage";

export default function App() {
  const AuthLandingPage = Auth(LandingPage, null);
  const AuthLoginPage = Auth(LoginPage, false);
  const AuthRegisterPage = Auth(RegisterPage, false);
  const AuthAdminPage = Auth(AdminPage, true, true);
  const AuthMyPage = Auth(MyPage, true);

  return (
    <div className="App">
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={ <AuthLandingPage /> } />
          <Route path="/login" element={ <AuthLoginPage /> }/>
          <Route path="/register" element={ <AuthRegisterPage /> } />
          <Route path="/admin" element={ <AuthAdminPage /> } />
          <Route path="/mypage" element={ <AuthMyPage /> } />
        </Routes>
      </Router>
      
    </div>
  );
}
