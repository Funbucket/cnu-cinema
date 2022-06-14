import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useSelector } from "react-redux";

function MovieSection({ SelectedMovie, setSelectedMovie, setSelectedDate, setSelectedTheater, setSelectedTime}) {
    const [MovieState, setMovieState] = useState("playing");
    const [MovieList, setMovieList] = useState([]);
    const user = useSelector(state => state.user);

    const onMovieStateHandler = (e) => {
        setMovieState(e.target.value);
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
    
    useEffect(() => {
        const fetch = async () => {
            const result = await axios.get(`/api/movie/${MovieState}`);
            setMovieList(result.data.movies)          
        };
        fetch();
    }, [MovieState]);

    return (
        <div className='section_movie'>
            <div className='col_head flex_center'>
            <span>영화</span>
                <div className='tabmenu'>
                    <select onChange={onMovieStateHandler} value={MovieState}>
                        <option value="playing">상영중</option>
                        <option value="upcoming">상영예정</option>
                    </select>
                </div>
            </div>
            <div className='col_body'>
                <div className='movie_select'>
                    <div className='movie_list'>
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
            </div>
        </div>
  )
}

export default MovieSection
