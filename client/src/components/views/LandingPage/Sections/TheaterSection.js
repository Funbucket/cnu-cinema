import React, { useEffect, useState} from 'react'
import axios from 'axios';

function TheaterSection({ SelectedMovie, SelectedDate, SelectedTheater, setSelectedTheater, setSelectedTime }) {
    const [Theaters, setTheaters] = useState([]);

    const onTheaterClickHandler = (e, theater) => {
        setSelectedTheater(theater);
        setSelectedTime("");
    }

    useEffect(() => {
        const fetch = async () => {
            const result = await axios.post(`/api/movie/theater`, {mid: SelectedMovie.mid, sdate: SelectedDate.sdate});
            setTheaters(result.data.dates);
        };
        fetch();
    }, [SelectedMovie, SelectedDate]); 

    return (
        <div className='section_theather'>
            <div className='col_head flex_center'>
                <span>상영관</span>
            </div>
            <div className='col_body'>
                <div className='theater_select'>
                    <div className='theater_list'>
                    <ul>
                        {
                        Theaters.map((theater, index) => 
                            <li key={index} className={theater.tname === SelectedTheater.tname ? "selected":""}>
                                <a href='#!' onClick={(e) => {
                                    onTheaterClickHandler(e, theater)
                                }}>{theater.tname}</a>
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

export default TheaterSection