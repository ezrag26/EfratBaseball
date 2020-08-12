import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import Header from "../Header";
import { XMLHttpRequestAsPromise } from "../helpers/request";
import { randomBits } from '../helpers/unique'

const fetchSchedule = ({ leagueId }) => {
  return XMLHttpRequestAsPromise({
    method: 'GET',
    url: `http://localhost:8010/leagues/${leagueId}/schedule`,
    options: {
      responseType: 'json'
    }
  })
}

const Schedule = () => {
  const [schedule, setSchedule] = useState({})

  useEffect(() => {
    fetchSchedule({ leagueId: 1 })
      .then(schedule => setSchedule(schedule))
  }, [])

  return (
    <>
      <Header />
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <ul style={{ display: 'flex', justifyContent: 'space-evenly', listStyle: 'none', padding: '0', width: '100%' }}>
            <li onClick={() => {
              fetchSchedule({ leagueId: 1 })
                .then(schedule => setSchedule(schedule))
            }}>League 1</li>
            <li onClick={() => {
              fetchSchedule({ leagueId: 2 })
                .then(schedule => setSchedule(schedule))
            }}>League 2</li>
          </ul>
          <table>
            <tbody>
            {
              Object.values(schedule).map(game => {
                const { date, time, away, home } = game
                return <tr key={randomBits()}>
                  <td>{date}</td>
                  <td>{time}</td>
                  <td style={{ backgroundColor: away.color }}>{away.name}</td>
                  <td className={'strudel'}>@</td>
                  <td style={{ backgroundColor: home.color }}>{home.name}</td>
                </tr>
              })
            }
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

ReactDOM.render(<Schedule />, document.querySelector('#root'))

