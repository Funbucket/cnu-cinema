import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_actions/user_action';
import { useNavigate } from 'react-router-dom'; 
import './Sections/LoginPage.css'

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
}

const divStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100vh'
}

const inputStyle = {
  marginBottom: '1em',
}

function LoginPage(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const onEmailHandler = (e) => {
    setEmail(e.currentTarget.value)
  }

  const onPasswordHandler = (e) => {
    setPassword(e.currentTarget.value)
  }

  const onSubmitHandler = (e) => {
    e.preventDefault();

    let body = {
      email: Email,
      password: Password
    }

    dispatch(loginUser(body))
      .then(response => {
          if(response.payload.loginSuccess) {
            window.localStorage.setItem('userId', response.payload.userId);
            navigate('/')
          } else {
            alert('Error');
          }
      })
  }

  return (
    <div style={divStyle}>
      <form onSubmit={onSubmitHandler} style={formStyle}>  
        <input type="email" title="이메일" value={Email} placeholder="이메일" onChange={onEmailHandler} style={inputStyle}/>
        <input type="password" title="비밀번호" value={Password} placeholder="비밀번호" onChange={onPasswordHandler} style={inputStyle}/> 
        <button type="submit">로그인</button>
      </form>
    </div>
  )
}

export default LoginPage