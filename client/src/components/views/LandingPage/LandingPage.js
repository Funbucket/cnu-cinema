import React, { useState } from 'react';
import './Sections/LandingPage.css'
import Booking from './Sections/Booking';
import MovieSection from './Sections/MovieSection';
import DateSection from './Sections/DateSection';
import TheatherSection from './Sections/TheaterSection';
import TimeSection from './Sections/TimeSection';
import SearchSection from './Sections/SearchSection';

function LandingPage() {
  const [SelectedMovie, setSelectedMovie] = useState({});
  const [SelectedDate, setSelectedDate] = useState("");
  const [SelectedTheater, setSelectedTheater] = useState("");
  const [SelectedTime, setSelectedTime] = useState("");
  const [ShowSearchSection, setShowSearchSection] = useState(false)

  return (
    <div>
      <div className='section_header'>
        <button className='search_bt' onClick={()=>setShowSearchSection(!ShowSearchSection)}>영화검색</button>
        { ShowSearchSection?
          <SearchSection 
            setShowSearchSection={setShowSearchSection}
            SelectedMovie={SelectedMovie}
            setSelectedMovie={setSelectedMovie}
            setSelectedDate={setSelectedDate}
            setSelectedTheater={setSelectedTheater}
            setSelectedTime={setSelectedTime}
          />:null
        }
      </div>

      <div className='section_container flex_center'>
        <MovieSection
          SelectedMovie={SelectedMovie}
          setSelectedMovie={setSelectedMovie}
          setSelectedDate={setSelectedDate}
          setSelectedTheater={setSelectedTheater}
          setSelectedTime={setSelectedTime}
        />
        <DateSection 
          SelectedMovie={SelectedMovie}
          SelectedDate={SelectedDate}
          setSelectedDate={setSelectedDate}
          setSelectedTheater={setSelectedTheater}
          setSelectedTime={setSelectedTime}
        />
        <TheatherSection
          SelectedMovie={SelectedMovie}
          SelectedDate={SelectedDate}
          SelectedTheater={SelectedTheater}
          setSelectedTheater={setSelectedTheater}
          setSelectedTime={setSelectedTime}
        />
        <TimeSection
          SelectedMovie={SelectedMovie}
          SelectedDate={SelectedDate}
          SelectedTheater={SelectedTheater}
          SelectedTime={SelectedTime}
          setSelectedTime={setSelectedTime}
        />
      </div>
      <Booking 
        SelectedMovie={SelectedMovie}
        SelectedDate={SelectedDate}
        SelectedTheater={SelectedTheater}
        SelectedTime={SelectedTime}
      />
    </div>  
  )
}

export default LandingPage