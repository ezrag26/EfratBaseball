import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import DateTime from 'luxon/src/datetime'

import NonAdminHeader from "../NonAdminHeader";
import { DropDownMenu } from "../helpers/form";
import { Center, Stack } from "../helpers/Typography";

import { fetchLeagues, fetchSchedule, fetchTeams } from '../helpers/api'
import { randomBits } from '../helpers/unique'
import { sortAscending } from '../helpers/schedule'

const formatMMMM_DD_YYYY = (date) => {
  const asDate = DateTime.fromFormat(date, 'yyyy-MM-dd')

  return `${asDate.monthLong} ${asDate.day}, ${asDate.year}`
}

const minsToHours = mins => ( mins / 60 )

const minsTo12HH_MM = mins => {
  const hoursMinutes = minsToHours(mins).toFixed(2).split('.')

  const hr = hoursMinutes[0]
  const min = ((hoursMinutes[1] / 100) * 60).toFixed(0)
  const [hrs, AM_PM] = (hr % 24) < 12 ? [hr % 24 || 12, 'AM'] : [hr % 12 || 12, 'PM']

  return `${hrs < 10 ? `0${hrs}` : hrs}:${min < 10 ? `0${min}` : min}${AM_PM}`
}

const sortDateAscending = (a, b) => DateTime.fromJSDate(new Date(a)).diff(DateTime.fromJSDate(new Date(b)))

const Schedule = () => {
  const [leagues, setLeagues] = useState([])
  const [league, setLeague] = useState({})
  const [schedule, setSchedule] = useState({})
  const [teamInfo, setTeamInfo] = useState({})

  useEffect(() => {
    fetchLeagues()
      .then(leagues => {
        setLeagues(leagues)
        setLeague(leagues[0])
      })
  }, [])

  useEffect(() => {
    if (!league.id) return
    Promise.all([
      fetchTeams({ leagueId: league.id }),
      fetchSchedule({ leagueId: league.id })
    ])
      .then(([teams, schedule]) => {
        setTeamInfo(teams)

        Object.keys(schedule).length !== 0 ? setSchedule(Object.keys(schedule).reduce((acc, date) => ({ ...acc, [date]: sortAscending({ schedule: schedule[date] }) }), {})) : setSchedule(null)
    })
  }, [league])

  return (
    <>
      <NonAdminHeader current={'Schedule'}/>

      <Center>
        <Stack.Small>
          <DropDownMenu items={leagues} selection={league} setSelection={setLeague}/>
        </Stack.Small>
      </Center>

      <Center>
        <Stack.Small>
          <h1>Schedule</h1>
        </Stack.Small>
      </Center>

      <Center>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '80%' }}>
          {
            schedule ?
              Object.keys(schedule).sort(sortDateAscending)
                .map(date => (
                  <div key={randomBits()} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', margin: '0 0 3rem' }}>
										<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', width: '100%' }}>
	                    <div style={{ position: 'sticky', position: '-webkit-sticky', top: 0, textAlign: 'right', fontSize: '1.5rem', whiteSpace: 'nowrap', padding: '0 1em 1em 0', marginTop: '.75rem', minWidth: '20%' }}>{formatMMMM_DD_YYYY(date)}</div>
	                    <div style={{ width: '100%' }}>
	                      <table className={'table'} style={{ width: 'inherit' }}>
	                        <tbody>
	                        {
	                          schedule[date].map(game => {
	                            const { time, awayId, homeId, isFinal, awayRS, homeRS } = game
	                            return (
	                              <tr key={randomBits()} className={'tr'}>
	                                <td style={{ borderLeft: `solid .5rem ${teamInfo[awayId]?.color}`, borderRadius: '0', width: '25%' }}>{teamInfo[awayId]?.name}<span className={'rs'}> {isFinal ? ` - ${awayRS}` : ''}</span></td>
	                                {/*<td className={'atSign'} style={{ width: '5%' }}>@</td>*/}
	                                <td style={{ borderLeft: `solid .5rem ${teamInfo[homeId]?.color}`, width: '25%' }}>{teamInfo[homeId]?.name}<span className={'rs'}> {isFinal ? ` - ${homeRS}` : ''}</span></td>
	                                <td>{isFinal ? 'F' : minsTo12HH_MM(time)}</td>
	                              </tr>
	                            )
	                          })
	                        }
	                        </tbody>
	                      </table>
	                    </div>
										</div>
                  </div>
                ))
            : <div>There are no games scheduled for this league</div>
          }
        </div>
      </Center>
    </>
  )
}

ReactDOM.render(<Schedule />, document.querySelector('#root'))
