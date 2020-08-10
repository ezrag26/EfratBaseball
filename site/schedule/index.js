import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import Header from "../Header";
const request = new XMLHttpRequest()

const fetchSchedule = ({ setSchedule, leagueId = 'bypass' }) => {
  request.onload = () => {
    setSchedule(request.response)
  }
  request.open('GET', `http://localhost:8010/${leagueId}/schedule`)
  request.responseType = "json"
  request.send()
}

const Schedule = () => {
  const [schedule, setSchedule] = useState({})

  useEffect(() => {
    fetchSchedule({ setSchedule })
  }, [])

  return (
    <>
      <Header />
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '2rem' }}>
        <table>
          <tbody>
          {
            Object.values(schedule).map(game => {
              const { date, time, away, home, awayColor, homeColor } = game
              return <tr key={`${game.date}-${game.time}-${game.away}-${game.home}`}>
                <td>{date}</td>
                <td>{time}</td>
                <td style={{ backgroundColor: awayColor }}>{away}</td>
                <td className={'strudel'}>@</td>
                <td style={{ backgroundColor: homeColor }}>{home}</td>
              </tr>
            })
          }
          </tbody>
        </table>
      </div>
    </>
  )
}

ReactDOM.render(<Schedule />, document.querySelector('#root'))

