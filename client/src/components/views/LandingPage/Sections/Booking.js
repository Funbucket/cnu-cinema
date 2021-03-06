import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom'; 

function Booking({ SelectedMovie, SelectedDate, SelectedTheater, SelectedTime }) {
  const navigate = useNavigate();
  const user = useSelector(state => state.user);
  const [PplNum, setPplNum] = useState("1");
  const [ScheduleId, setScheduleId] = useState("");
  const [TotalSeats, setTotalSeats] = useState("");
  const [BookedSeats, setBookedSeats] = useState("");
  const [CumulativeAudiences, setCumulativeAudiences] = useState("");
  const [NumberOfBookers, setNumberOfBookers] = useState("");
  const [IsBooked, setIsBooked] = useState(false);

  useEffect(() => {
    let body = {
      mid: SelectedMovie.mid,
      sdate: SelectedDate.sdate,
      tname: SelectedTheater.tname,
      stime: SelectedTime.stime
    }
    if (SelectedTime !== '') {
      const fetch = async () => {
        const scheduleId = await axios.post(`/api/movie/scheduleId`, body);
        setScheduleId(scheduleId.data.sid);

        const seats = await axios.post(`/api/movie/seats`, {sid: scheduleId.data.sid});
        setBookedSeats(seats.data.booked_seats);
        setTotalSeats(seats.data.total_seats);
      };
      setIsBooked(false);
      fetch();
    };
  }, [SelectedTime, IsBooked]); 

  useEffect(() => {
    const fetch = async () => {
      const cumulativeAudiences = await axios.post('/api/movie/cumulativeAudiences', {mid: SelectedMovie.mid});
      setCumulativeAudiences(cumulativeAudiences.data.cumulative_audiences);

      const numberOfBookers = await axios.post('/api/movie/numberOfBookers', {mid: SelectedMovie.mid});
      setNumberOfBookers(numberOfBookers.data.number_of_bookers);
    };
    setIsBooked(false);
    fetch();
  }, [SelectedMovie, IsBooked])
  

  const toStringDatetime = (strDate, strTime) => {
    strDate = strDate.split("-");
    strTime = strTime.split(":");
    return `${strDate[0]}.${strDate[1]}.${strDate[2]} ${strTime[0]}:${strTime[1]}`
  }

  const isObjectEmpty = (obj) => {
    return Object.keys(obj).length === 0;
  }

  const onPplNumHandler = (e) => {
    setPplNum(e.target.value);
  }

  const onClickHandler = (e) => {
    if (!user.userData.isAuth) {
      alert('???????????? ????????? ??????????????????.')
      navigate('/login')
    } else {
      if (isObjectEmpty(SelectedMovie)) {
        alert('????????? ????????? ?????????.')
      } else if (SelectedDate === '') {
        alert('????????? ????????? ?????????.')
      } else if (SelectedTheater === '') {
        alert('???????????? ????????? ?????????.')
      } else if (SelectedTime === '') {
        alert('????????? ????????? ?????????.')
      } else if (parseInt(PplNum) > parseInt(TotalSeats) - parseInt(BookedSeats)) {
        alert("????????? ???????????????.")
      } else {
        let body = {
          name: user.userData.name,
          title: SelectedMovie.title,
          sdate: SelectedDate.sdate,
          tname: SelectedTheater.tname,
          stime: SelectedTime.stime,
          cid: user.userData.cid,
          email: user.userData.email,
          sid: ScheduleId,
          mid: SelectedMovie.mid,
          seats: parseInt(PplNum)
        }
        axios.post('/api/movie/book', body).then(response => {
          if (response.data.success) {
            alert("?????? ??????");
            setIsBooked(true);
          } else {
            alert('?????? ??????');
          }
        })
      }
    }
  }
  const toStringSeats = (booked_seats, total_seats) => {
    if (booked_seats) {
      return `${parseInt(total_seats)-parseInt(booked_seats)}`
    } else {
      return `${total_seats}` 
    }
  }

  const toStringRating = (strRating) => {
    switch (strRating) {
        case "ALL":
          return "?????? ?????????";
        case "18":
          return "?????????????????????";
        default:
          return `${strRating}??? ?????????`;
    }
  }

  return (
    <div className='booking_container flex_center'>
        <div className='booking_contents'>
            <div className='info movie'>
              <div>
                <span className='header'>????????????</span>
                {!isObjectEmpty(SelectedMovie) && 
                  <span className='body'>{SelectedMovie.title}</span>
                }
              </div>
              <div>
                <span className='header'>????????????</span>
                {!isObjectEmpty(SelectedMovie) &&
                  <span className='body'>{toStringRating(SelectedMovie.rating)}</span>
                }
              </div>
              <div>
                <span className='header'>??????</span>
                {SelectedMovie.mid && 
                  <span className='body'>{SelectedMovie.director}</span>
                }
              </div>
              <div>
                <span className='header'>????????????</span>
                {SelectedMovie.mid && 
                  <span className='body'>{NumberOfBookers?NumberOfBookers:'0'}</span>
                }
              </div>
              <div>
                <span className='header'>???????????????</span>
                {SelectedMovie.mid && 
                  <span className='body'>{CumulativeAudiences?CumulativeAudiences:'0'}</span>
                }
              </div>
            </div>
            <div className='info theater'>
              <div>
                <span className='header'>?????????</span>
                {SelectedTheater !== '' &&
                  <span className='body'>{SelectedTheater.tname}</span>
                }
              </div>
              <div>
                <span className='header'>??????</span>
                {SelectedDate !== '' && SelectedTime !== '' &&
                  <span className='body'>{toStringDatetime(SelectedDate.sdate, SelectedTime.stime)}</span>
                }
              </div>
              <div>
                <span className='header'>??????</span>
                {SelectedDate !== '' && SelectedTime !== '' &&
                  <span className='body'>{toStringSeats(BookedSeats, TotalSeats)}</span>
                }
              </div>
              <div>
                <span className='header'>??????</span>
                <div className='body ppl'>
                  <select onChange={onPplNumHandler} value={PplNum}>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                  </select>
                </div>
              </div>
            </div>
            <button className='booking_btn' onClick={onClickHandler}>??????</button>
        </div>
    </div>
  )
}

export default Booking