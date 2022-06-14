import React, { useEffect, useState } from 'react';
import axios from 'axios';

function DateSection({ SelectedMovie, SelectedDate, setSelectedDate, setSelectedTheater, setSelectedTime }) {
    const [Dates, setDates] = useState([])

    const onDateClickHandler = (e, date) => {
        setSelectedDate(date);
        setSelectedTheater("");
        setSelectedTime("");
    }

    const toStringDate = (strDate) => {
        const strs = strDate.split("-");
        return `${strs[1]}-${strs[2]}`;
    }

    useEffect(() => {
        const fetch = async () => {
            const result = await axios.post(`/api/movie/date`, SelectedMovie);
            let dates = [];
            let today = new Date();
            result.data.dates.forEach(date => {
                let d = new Date(date.sdate);
                if (today <= d) {
                    dates.push({sdate: date.sdate});
                }
            });
            if (dates.length === 0) {
                alert('선택한 영화에 원하시는 상영스케줄이 없습니다.');
                setDates(dates);
            } else {
                setDates(dates);
            }
        };
        if(Object.keys(SelectedMovie).length !== 0) {
            fetch();
        }
    }, [SelectedMovie]); 

    return (
        <div className='section_date'>
            <div className='col_head flex_center'>
                <span>날짜</span>
            </div>
            <div className='col_body'>
                <div className='date_select'>
                    <div className='date_list'>
                    <ul>
                        {
                        Dates.map((date, index) => 
                            <li key={index} className={date.sdate === SelectedDate.sdate ? "selected" : ""}>
                                <a href='#!' onClick={(e) => {
                                    onDateClickHandler(e, date)
                                }}>{toStringDate(date.sdate)}</a>
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

export default DateSection