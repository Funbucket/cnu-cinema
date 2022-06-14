import React, { useState, useEffect } from 'react'
import { useSelector } from "react-redux";
import axios from 'axios';
import './Sections/MyPage.css'

function MyPage() {
    const user = useSelector(state => state.user);
    const [HistoryType, setHistoryType] = useState("");
    const [StartDate, setStartDate] = useState("");
    const [EndDate, setEndDate] = useState("");
    const [SearchResults, setSearchResults] = useState([])
    
    const onHistoryTypeHandler = (e) => {
        setHistoryType(e.target.value);
    }

    const toStringDateType = (str) => {
        if (str === "예매내역") {
            return "예매일";
        } else if (str === "취소내역") {
            return "취소일";
        } else {
            return "관람일";
        }
    }

    const toStringDatetime = (strDate, strTime) => {
        strDate = strDate.split("-");
        strTime = strTime.split(":");
        return `${strDate[0]}.${strDate[1]}.${strDate[2]} ${strTime[0]}:${strTime[1]}`
      }

    const onSearchBtHandler = (e) => {
        let body = {
            cid: user.userData.cid,
            startDate: StartDate,
            endDate: EndDate
        }
        if (StartDate === "") {
            alert("시작일을 선택해주세요.");
        }
        if (EndDate === "") {
            alert("종료일을 선택해주세요.")
        }
        if (HistoryType === "예매내역") {
            axios.post('/api/movie/historyBooked', body).then(response => {
                if(response.data.success) {
                    setSearchResults(response.data.rows);
                } else {
                    alert("조회실패");
                }
            })
        } else if (HistoryType === "취소내역") {
            axios.post('/api/movie/historyCanceled', body).then(response => {
                if(response.data.success) {
                    setSearchResults(response.data.rows);
                } else {
                    alert("조회실패");
                }
            })
        } else if (HistoryType === "관람내역") {
            axios.post('/api/movie/historyWatched', body).then(response => {
                if(response.data.success) {
                    setSearchResults(response.data.rows);
                } else {
                    alert("조회실패");
                }
            })
        }
    }

    const onStartDateHandler = (e) => {
        setStartDate(e.target.value);
    }

    const onEndDateHandler = (e) => {
        setEndDate(e.target.value);
    }

    const onCancelHandler = (e) => {
        console.log(e.target.id)
        axios.post('/api/movie/cancel', {tid: e.target.id}).then(response => {
            if(response.data.success) {
                alert("예매 취소 완료");
                onSearchBtHandler();
            } else {
                alert("예매 취소 실패")
            }
        })
    }

    useEffect(() => {
        setSearchResults([])
    }, [HistoryType])
    

    return (
        <div className='mypage_container flex_center flex_column'>
            <div className='search_container'>
                <div className='inner_box'>
                    <span className='align_center'>
                        <span className='title'>조회내용</span>
                        <label>예매내역</label>
                        <input type="radio" className='history_bt' value="예매내역" checked={HistoryType === "예매내역"} onChange={onHistoryTypeHandler}></input>
                        <label>취소내역</label>
                        <input type="radio" className='history_bt' value="취소내역" checked={HistoryType === "취소내역"} onChange={onHistoryTypeHandler}></input>
                        <label>관람내역</label>
                        <input type="radio" className='history_bt' value="관람내역" checked={HistoryType === "관람내역"} onChange={onHistoryTypeHandler}></input>
                    </span>
                </div>
                <div className='inner_box'>
                    <span className='align_center'>
                        <span className='title'>조회기간</span>
                        <input type="date" id='start_date' onChange={onStartDateHandler}></input>
                        <span>~</span>
                        <input type="date" id='end_date' onChange={onEndDateHandler}></input>
                        <button className='search_bt' onClick={onSearchBtHandler}>조회하기</button>
                    </span>
                </div>
            </div>
            <div className='tbl_data'>
                <div>총 {Object.keys(SearchResults).length}개</div>
                <table>
                    <thead>
                        <tr>
                            <th>{toStringDateType(HistoryType)}</th>
                            {HistoryType !== "관람내역" &&
                                <th>상영일시</th>
                            }
                            {HistoryType === "관람내역" &&
                                <th>예매일</th>
                            }
                            <th>영화제목</th>
                            <th>예매좌석수</th>
                            {HistoryType === "예매내역" &&
                                <th>취소</th>
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {SearchResults.map((row, index) => 
                            <tr key={index}>
                                {HistoryType !== "관람내역" &&
                                    <td>{row.rc_date}</td>
                                }
                                {HistoryType === "관람내역" &&
                                    <td>{row.sdate}</td>
                                }
                                {row.stime && row.sdate && HistoryType !== "관람내역" &&
                                    <td>{toStringDatetime(row.sdate, row.stime)}</td>
                                }
                                {HistoryType === "관람내역" &&
                                    <td>{row.rc_date}</td>
                                }
                                <td>{row.title}</td>
                                <td>{row.seats}</td>
                                {HistoryType === "예매내역" &&
                                    <td className='cancel_td'><button id={row.tid} onClick={onCancelHandler}>취소</button></td>
                                }
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default MyPage