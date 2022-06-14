const db = require('../dbconfig');
require('dotenv').config();

const movieController = {
    playing: async (req, res) => {
        db.query('select * from movie where open_day <= now() and now() <= date_add(open_day, interval 10 day)', (err, row) => {
            if(err) return res.json({success: false, err});
            return res.json({success: true, movies: row})
        })
    },
    upcoming: async (req, res) => {
        db.query('select * from movie where open_day > now()', (err, row) => {
            if(err) return res.json({success: false, err});
            return res.json({success: true, movies: row})
        })
    },
    date: async (req, res) => {
        db.query('select distinct sdate from Schedule where mid = ? order by sdate', req.body.mid, (err, row) => {
            if(err) return res.json({success: false, err});
            return res.json({success: true, dates: row})
        })
    },
    theater: async (req, res) => {
        db.query('select distinct tname from Schedule where mid = ? and sdate = ?', [req.body.mid, req.body.sdate], (err, row) => {
            if(err) return res.json({success: false, err});
            return res.json({success: true, dates: row})
        })
    },
    time: async (req, res) => {
        db.query('select distinct stime from Schedule where mid = ? and sdate = ? and tname = ?', [req.body.mid, req.body.sdate, req.body.tname], (err, row) => {
            if(err) return res.json({success: false, err});
            return res.json({success: true, times: row})
        })
    },
    book: async (req, res, next) => {
        db.query('insert into Ticketing (cid, sid, mid, seats, rc_date) values (?, ?, ?, ?, curdate())',
            [req.body.cid, req.body.sid, req.body.mid, req.body.seats],
            (err, row) => {
                if(err) return res.json({success: false, err});
                req.body.email = req.body.email;
                req.body.html = `
                                <h1>예매인: ${req.body.name}</h1>
                                <h1>예매 좌석수: ${req.body.seats}</h1>
                                <h1>영화 제목: ${req.body.title}</h1>
                                <h1>상영관: ${req.body.tname}</h1>
                                <h1>상영일시: ${req.body.sdate} ${req.body.stime}</h1>
                                `
                next();
            }
        )
    },
    scheduleId: async (req, res) => {
        db.query('select sid from Schedule where mid = ? and sdate = ? and tname = ? and stime = ?',
        [req.body.mid, req.body.sdate, req.body.tname, req.body.stime],
        (err, row) => {
            if(err) return res.json({success: false, err});
            return res.json({success: true, sid: row[0].sid})
        }
    ) 
    },
    seats: async (req, res) => {
        db.query("select seats total_seats, (select sum(seats) booked_seats from Ticketing where sid = ? and status not like 'C') booked_seats from Theater T where T.tname = (select tname from Schedule S where S.sid = ?)",
            [req.body.sid, req.body.sid],
            (err, row) => {
                if(err) return res.json({success: false, err});
                return res.json({success: true, total_seats: row[0].total_seats, booked_seats: row[0].booked_seats})
            }
        ) 
    },
    cumulativeAudiences: async (req, res) => {
        db.query("select sum(seats) cumulative_audiences from Ticketing where sid in (select sid from Schedule where mid = ? and now() > DATE_ADD(STR_TO_DATE(concat(sdate, ' ', stime), '%Y-%m-%d %H:%i:%s'), INTERVAL (select length from Movie where mid = ?) minute)) and status not like 'C'",
            [req.body.mid, req.body.mid],
            (err, row) => {
                if(err) return res.json({success: false, err});
                return res.json({success: true, cumulative_audiences: row[0].cumulative_audiences})
            }
        ) 
    },
    numberOfBookers: async (req, res) => {
        db.query("select sum(seats) number_of_bookers from Ticketing where sid in (select sid from Schedule where mid = ? and now() < STR_TO_DATE(concat(sdate, ' ', stime), '%Y-%m-%d %H:%i:%s')) and status not like 'C'",
            req.body.mid,
            (err, row) => {
                if(err) return res.json({success: false, err});
                return res.json({success: true, number_of_bookers: row[0].number_of_bookers})
            }
        ) 
    },
    historyBooked: async (req, res) => {
        db.query("select T.tid, T.rc_date, T.seats, M.title, S.sdate, S.stime from Ticketing T join Movie M on M.mid = T.mid join Schedule S on S.sid = T.sid where T.cid = ? and T.rc_date >= ? and T.rc_date <= ? and T.status = 'R' and now() <= DATE_ADD(STR_TO_DATE(concat(S.sdate, ' ', S.stime), '%Y-%m-%d %H:%i:%s'), INTERVAL (select length from Movie where mid = S.mid) minute)order by rc_date desc",
            [req.body.cid, req.body.startDate, req.body.endDate],
            (err, row) => {
                if(err) return res.json({success: false, err});
                return res.json({success: true, rows: row})
            }
        ) 
    },
    historyCanceled: async (req, res) => {
        db.query("select T.rc_date, T.seats, M.title, S.sdate, S.stime from Ticketing T join Movie M on M.mid = T.mid join Schedule S on S.sid = T.sid where T.cid = ? and T.rc_date >= ? and T.rc_date <= ? and T.status = 'C' order by rc_date desc",
            [req.body.cid, req.body.startDate, req.body.endDate],
            (err, row) => {
                if(err) return res.json({success: false, err});
                return res.json({success: true, rows: row})
            }
        ) 
    },
    historyWatched: async (req, res) => {
        db.query("select T.rc_date, T.seats, M.title, S.sdate from Ticketing T join Schedule S on S.sid = T.sid join Movie M on M.mid = T.mid where T.cid = ? and now() > DATE_ADD(STR_TO_DATE(concat(S.sdate, ' ', S.stime), '%Y-%m-%d %H:%i:%s'), INTERVAL (select length from Movie where mid = S.mid) minute) and T.status = 'R' and S.sdate >= ? and S.sdate <= ? order by S.sdate desc",
            [req.body.cid, req.body.startDate, req.body.endDate],
            (err, row) => {
                if(err) return res.json({success: false, err});
                return res.json({success: true, rows: row})
            }
        ) 
    },
    cancel: async (req, res) => {
        db.query("update Ticketing set status = 'C' where tid = ?",
            req.body.tid,
            (err, row) => {
                if(err) return res.json({success: false, err});
                return res.json({success: true})
            }
        )      
    },
    genderRatio: async (req, res) => {
        db.query("select M.mid, M.open_day, M.title, count(case when C.sex = 'm' then 1 end) men, count(case when C.sex = 'w' then 1 end) women from Movie M join Ticketing T on M.mid = T.mid join Customer C on C.cid = T.cid where M.open_day <= now() and now() <= date_add(M.open_day, interval 10 day) group by M.mid",
            (err, row) => {
                if(err) return res.json({success: false, err});
                return res.json({success: true, rows: row})
            }
        )      
    },
    ticketingRank: async (req, res) => {
        db.query("select M.title, dense_rank() over (order by sum(T.seats) desc) ranking, sum(T.seats) seats, M.open_day from Movie M join Ticketing T on M.mid = T.mid where T.status not like 'C' and now() <= date_add(M.open_day, interval 10 day) group by M.title, M.open_day",
            (err, row) => {
                if(err) return res.json({success: false, err});
                return res.json({success: true, rows: row})
            }
        )      
    },
    moviesWithDate: async (req, res) => {
        db.query("select * from movie where open_day <= now() and now() <= date_add(open_day, interval 10 day) and open_day >= ? and open_day <= ?",
            [req.body.startDate, req.body.endDate],
            (err, row) => {
                if(err) return res.json({success: false, err});
                return res.json({success: true, rows: row})
        }
    ) 
    },
    moviesWithTitle: async (req, res) => {
        db.query("select * from Movie where open_day <= now() and now() <= date_add(open_day, interval 10 day) and title REGEXP ?",
            req.body.title,
            (err, row) => {
                if(err) return res.json({success: false, err});
                return res.json({success: true, rows: row})
            }
        ) 
    }
}

module.exports = movieController