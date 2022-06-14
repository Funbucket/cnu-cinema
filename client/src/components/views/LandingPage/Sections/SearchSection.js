import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from "react-redux";

function SearchSection({ SelectedMovie, setSelectedMovie, setSelectedDate, setSelectedTheater, setSelectedTime}) {
  const [SearchType, setSearchType] = useState("영화제목");
  const [MovieList, setMovieList] = useState([]);
  const [StartDate, setStartDate] = useState("");
  const [EndDate, setEndDate] = useState("");
  const user = useSelector(state => state.user);

  const onMovieClickHandler = (e, movie) => {
    if (validateAge(movie.rating)) {
        setSelectedMovie(movie)
    } else {
        alert(`${movie.rating}세 이상 관람가입니다.`)
    }
    setSelectedDate('')
    setSelectedTheater('')
    setSelectedTime('')
  }

  const validateAge = (movieRating) => {
    if (movieRating > parseInt(user.userData.age)) {
        return false
    } else if (movieRating === "ALL") {
        return true
    } else {
        // movieRating <= parseInt(user.userData.age)
        // or logout
        return true
    }
  }

  const onClickHandler = () => {
    let body = {
      startDate: StartDate,
      endDate: EndDate
    }
    axios.post('/api/movie/moviesWithDate', body).then(response => {
      if(response.data.success) {
        setMovieList(response.data.rows)
      } else {
        alert("조회실패");
      }
    })
  }

  const onChangeHandler = (e) => {
    axios.post('/api/movie/moviesWithTitle', {title: e.target.value}).then(response => {
      if(response.data.success) {
        setMovieList(response.data.rows)
      }
    })
  }
  return (
    <div className='search_box'>
      <div className='tabmenu'>
        <select onChange={(e)=>{setSearchType(e.target.value)}} value={SearchType}>
          <option value="영화제목">영화제목</option>
          <option value="날짜">날짜</option>
        </select>
      </div>
      {SearchType === "날짜" && 
        <div className='search_condition'>
          <input type="date" id='start_date' onChange={(e)=>{setStartDate(e.target.value)}}></input>
          <span>~</span>
          <input type="date" id='end_date' onChange={(e)=>{setEndDate(e.target.value)}}></input>
          <button onClick={onClickHandler}>조회하기</button>
        </div>
      }
      {SearchType === "영화제목" && 
        <div className='search_condition'>
          <input type="text" id='movie_title' onChange={(e)=>{onChangeHandler(e)}}></input>
        </div>
      }
      <div className='search_results'>
        <ul>
          {
            MovieList.map((movie, index) => 
              <li key={index} className={movie.mid === SelectedMovie.mid ? "selected":""}>
                <a href='#!' onClick={(e) => {
                  onMovieClickHandler(e, movie)
                }}>{movie.title}</a>
              </li>
              )
          }
        </ul>
      </div>
    </div>
  )
}

export default SearchSection