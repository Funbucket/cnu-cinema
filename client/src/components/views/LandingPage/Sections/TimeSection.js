import React, { useEffect, useState} from 'react'
import axios from 'axios';

function TimeSection({ SelectedMovie, SelectedDate, SelectedTheater, SelectedTime, setSelectedTime }) {
  const [Times, setTimes] = useState([]);

  const onTimeClickHandler = (e, time) => {
    setSelectedTime(time)
  }

  const toStringTime = (strTime) => {
    const strs = strTime.split(":");
    return `${strs[0]}:${strs[1]}`;
}

  useEffect(() => {
      const fetch = async () => {
          const result = await axios.post(`/api/movie/time`, {mid: SelectedMovie.mid, sdate: SelectedDate.sdate, tname: SelectedTheater.tname});
          setTimes(result.data.times);
      };
      fetch();
  }, [SelectedMovie, SelectedDate, SelectedTheater]); 

  return (
    <div className='section_time'>
        <div className='col_head flex_center'>
          <span>시간</span>
        </div>
        <div className='col_body'>
            <div className='time_select'>
              <div className='time_list'>
                <ul>
                      {
                        Times.map((time, index) => 
                            <li key={index} className={time.stime === SelectedTime.stime ? "selected":""}>
                                <a href='#!' onClick={(e) => {
                                    onTimeClickHandler(e, time)
                                }}>{toStringTime(time.stime)}</a>
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

export default TimeSection