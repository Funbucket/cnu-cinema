import React, { useState } from 'react';
import './Sections/AdminPage.css';
import axios from 'axios';

function AdminPage() {
  const [SearchResults, setSearchResults] = useState([])
  const [SearchType, setSearchType] = useState("")

  const onTicketingRankHandler = () => {
    setSearchType("예매순위")
    axios.post('/api/movie/ticketingRank').then(response => {
      if (response.data.success) {
        console.log(response.data.rows)
        setSearchResults(response.data.rows)
      } else {
        alert("조회실패");
      }
    })
  }

  const onGenderRatioBtHandler = () => {
    setSearchType("성별예매추이")
    axios.post('/api/movie/genderRatio').then(response => {
      if (response.data.success) {
        console.log(response.data.rows)
        setSearchResults(response.data.rows)
      } else {
        alert("조회실패");
      }
    })
  }

  return (
    <div className='adminpage_container flex_center flex_column'>
      <div className='search_container'>
        <div className='inner_box'>
          <span className='align_center'>
              <span className='title'>성별 예매추이</span>
              <button className='search_bt' onClick={onGenderRatioBtHandler}>조회하기</button>
          </span>
        </div>
        <div className='inner_box'>
          <span className='align_center'>
              <span className='title'>예매 순위</span>
              <button className='search_bt' onClick={onTicketingRankHandler}>조회하기</button>
          </span>
        </div>
      </div>
      <div className='tbl_data'>
          <table>
              <thead>
                <tr>
                  { SearchType === "예매순위" &&
                  <th>순위</th>
                  }
                  { SearchType !== "" && 
                    <th>영화</th>
                  }
                  { SearchType !== "" && 
                    <th>개봉일</th>
                  }
                  { SearchType === "성별예매추이" &&
                    <th>남</th>
                  }
                  { SearchType === "성별예매추이" &&
                    <th>여</th>
                  }
                  { SearchType === "예매순위" &&
                    <th>예매좌석수</th>
                  }  
                </tr>
              </thead>
              <tbody>
                {SearchResults.map((row, index) => 
                  <tr key={index}>
                    {SearchType === "예매순위" &&
                      <td>{row.ranking}</td>
                    }
                    <td>{row.title}</td>
                    <td>{row.open_day}</td>
                    {SearchType === "예매순위" &&
                      <td>{row.seats}</td>
                    }
                    {SearchType === "성별예매추이" &&
                      <td>{row.men}</td>
                    }
                    {SearchType === "성별예매추이" &&
                      <td>{row.women}</td>
                    }
                  </tr>
                )}
              </tbody>
          </table>
      </div>
    </div>
  )
}

export default AdminPage