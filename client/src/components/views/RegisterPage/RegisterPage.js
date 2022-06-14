import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import { registerUser } from '../../../_actions/user_action';
import './Sections/RegisterPage.css';

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

function RegisterPage(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [Email, setEmail] = useState("");
  const [Name, setName] = useState("");
  const [Password, setPassword] = useState("");
  const [BirthDate, setBirthDate] = useState("");
  const [Sex, setSex] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("")

  const onNameHandler = (e) => {
    setName(e.currentTarget.value)
  }

  const onEmailHandler = (e) => {
    setEmail(e.currentTarget.value)
  }

  const onPasswordHandler = (e) => {
    setPassword(e.currentTarget.value)
  }

  const onConfirmPasswordHandler = (e) => {
    setConfirmPassword(e.currentTarget.value)
  }

  const onBirthdayHandler = (e) => {
    setBirthDate(e.currentTarget.value)
  }

  const onSexHandler = (e) => {
    setSex(e.currentTarget.value);
  }

  const onSubmitHandler = (e) => {
    e.preventDefault();

    if (Password !== ConfirmPassword) {
      return alert('비밀번호가 일치하지 않습니다.')
    }

    let body = {
      name: Name,
      birthDate: BirthDate,
      sex: Sex,
      email: Email,
      password: Password
    }

    dispatch(registerUser(body))
      .then(response => {
          if(response.payload.registerSuccess) {
            navigate('/login')
          } else {
            alert('회원가입 실패');
          }
      })
  }

  return (
    <div style={divStyle}>
      <form onSubmit={onSubmitHandler} style={formStyle}>  
        <input type="text" value={Name} placeholder="이름" onChange={onNameHandler} style={inputStyle}/>
        <input type="date" value={BirthDate} placeholder="생년월일" onChange={onBirthdayHandler} style={inputStyle}></input>
        <div style={{marginBottom: "1em"}}>
          <label>남</label>
          <input type="radio" value="m" checked={Sex === "m"} onChange={onSexHandler}></input>
          <label>여</label>
          <input type="radio" value="w" checked={Sex === "w"} onChange={onSexHandler}></input>
        </div>
        <input type="email" value={Email} placeholder="이메일" onChange={onEmailHandler} style={inputStyle}/>        
        <input type="password" value={Password} placeholder="비밀번호" onChange={onPasswordHandler} style={inputStyle}/> 
        <input type="password" value={ConfirmPassword} placeholder="비밀번호 확인" onChange={onConfirmPasswordHandler} style={inputStyle}/> 
        <button type="submit">회원가입</button>
      </form>
    </div>
  )
}

export default RegisterPage