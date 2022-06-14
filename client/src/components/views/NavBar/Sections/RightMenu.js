import React from 'react';
import axios from 'axios';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom'; 

function RightMenu() {
  const user = useSelector(state => state.user)
  const navigate = useNavigate();

  const logoutHandler = () => {
    axios.get('/api/user/logout').then(response => {
      if (response.data.logoutSuccess) {
        navigate("/login");
      } else {
        alert('로그아웃 실패')
      }
    });
  };

  const myPageHandler = () => {
    navigate("/mypage");
  }

  const adminPageHandler = () => {
    navigate('/admin');
  }
  if (user.userData && user.userData.isAdmin) {
    return(
      <div>
        <a href="#" onClick={adminPageHandler}>어드민페이지</a>
        <a href="#" onClick={logoutHandler}>로그아웃</a>
      </div>
    )
  } else if (user.userData && !user.userData.isAuth) {
    return (
      <div>
          <a href="/login">로그인</a>
          <a href="/register">회원가입</a>
      </div>
    )
  } else {
    return (
      <div>
          <a href="#" onClick={myPageHandler}>마이페이지</a>
          <a href="#" onClick={logoutHandler}>로그아웃</a>
      </div>
    )
  }
}

export default RightMenu;