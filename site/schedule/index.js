import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import NonAdminHeader from "../NonAdminHeader";
import { XMLHttpRequestAsPromise } from "../helpers/request";
import { randomBits } from '../helpers/unique'
import DateTime from 'luxon/src/datetime'

const fetchSchedule = ({ leagueId }) => {
  return XMLHttpRequestAsPromise({
    method: 'GET',
    url: `http://localhost:8010/leagues/${leagueId}/schedule`,
    options: {
      responseType: 'json'
    }
  })
}

const formatMMMM_DD_YYYY = (date) => {
  const asDate = DateTime.fromFormat(date, 'yyyy-MM-dd')

  return `${asDate.monthLong} ${asDate.day}, ${asDate.year}`
}

const Tab = ({ text, onClick }) => {

  return (
    <li className={'tab'} onClick={onClick}>{text}</li>
  )
}

const Schedule = () => {
  const [leagueIds, setLeagueIds] = useState(["1", "2"])
  const [leagueId, setLeagueId] = useState(leagueIds[0])
  const [schedule, setSchedule] = useState({})

  useEffect(() => {
    fetchSchedule({ leagueId })
      .then(schedule => setSchedule(schedule))
  }, [leagueId])

  return (
    <>
      <NonAdminHeader />
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '80%' }}>
          <ul style={{
            display: 'flex',
            listStyle: 'none',
            padding: '1rem 0',
            width: '100%',
            marginBottom: '2rem',
            fontSize: '2rem'
          }}>
            {
              leagueIds.map(leagueId =>
                <Tab key={randomBits()} text={`League ${leagueId}`} onClick={() => setLeagueId(leagueId)} />
              )
            }
          </ul>
          <table className={'schedule'} style={{ width: '100%' }}>
            <tbody>
            {
              Object.keys(schedule)
                .sort((a, b) => {
                  return DateTime.fromJSDate(new Date(a)).diff(DateTime.fromJSDate(new Date(b)))
                })
                .map(date => {
                const { time, away, home } = schedule[date]
                return <tr key={randomBits()}>
                  <td>{formatMMMM_DD_YYYY(date)}</td>
                  <td>{time || 'F'}</td>
                  <td style={{ backgroundColor: away.color }}>{away.name}<span> {away.runs || ''}</span></td>
                  <td className={'atSign'}>@</td>
                  <td style={{ backgroundColor: home.color }}>{home.name}<span> {home.runs || ''}</span></td>
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

