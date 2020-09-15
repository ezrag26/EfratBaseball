import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import AdminHeader from "../AdminHeader";
import { fetchLeagues, fetchTeams, fetchSchedule, addGame, editGame } from '../../helpers/api'
import { DropDownMenu } from "../../helpers/form";
import { Center, Stack } from "../../helpers/Typography";
import { randomBits } from '../../helpers/unique'
import { sortAscending } from '../../helpers/schedule'

const minsToHours = mins => ( mins / 60 )

const minsTo12HH_MM = mins => {
  const hoursMinutes = minsToHours(mins).toFixed(2).split('.')

  const hr = hoursMinutes[0]
  const min = ((hoursMinutes[1] / 100) * 60).toFixed(0)
  const [hrs, AM_PM] = (hr % 24) < 12 ? [hr % 24 || 12, 'AM'] : [hr % 12 || 12, 'PM']

  return `${hrs < 10 ? `0${hrs}` : hrs}:${min < 10 ? `0${min}` : min}${AM_PM}`
}

const _12HH_MM_ToMins = (time) => {
  const isAM = new RegExp(/[aA][mM]$/).test(time)
  const [hours, minutes] = time.substr(0, time.length - 2).split(':')

  const hrs = parseInt(hours)
  const mins = parseInt(minutes)

  if (isAM && hrs === 12) return mins
  if (!isAM && hrs !== 12) return ((hrs + 12) * 60) + mins
  return (hrs * 60) + mins
}

const _12HH_MM_RE = new RegExp(/^(0?[1-9]|\d|1[0-2]):[0-5][0-9][aApP][mM]$/)

const YYYY_MM_DD_RE = new RegExp(/^\d{4}-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])$/)

const isValidDate = (date) => {
  if (!YYYY_MM_DD_RE.test(date)) {
    console.error('Date must be a valid date in the format yyyy-MM-dd')
    return false
  }
  return true
}

const isValidTime = (time) => {
  if (!_12HH_MM_RE.test(time)) {
    console.error('Time must be a valid time in the format HH:MM and must directly followed by AM or PM (no space in between)')
    return false
  }
  return true
}

const TableCell = ({ children, type = 'text', placeholder = '', value, onChange, disabled = false }) => {
  return (
    <td>
    {
      children ||
      <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} disabled={disabled}/>
    }
    </td>
  )
}

const Table = ({ items, teams, addGame, saveEdit }) => {
  const [editingId, setEditingId] = useState()
  const [newItem, setNewItem] = useState({ date: "", time: "" })
  const [edit, setEdit] = useState({})
  const [hover, setHover] = useState({ gameId: undefined })
  const [teamInfo, setTeamInfo] = useState()

  const editField = ({ setter, field, value }) => setter(prev => ({ ...prev, [field]: value }))

  useEffect(() => {
    setTeamInfo(Object.keys(teams).map(teamId => ({ id: teamId, name: teams[teamId].name })))
  }, [teams])

  useEffect(() => {
    if (!teamInfo) return

    setNewItem(prev => ({ ...prev, away: teamInfo[0], home: teamInfo[1] }))
  }, [teamInfo])

  const editRow = ({ game }) => {
    const { gameId, ...g } = game

    setEditingId(gameId)
    setEdit({
      ...g,
      time: minsTo12HH_MM(game.time),
      away: teamInfo.find(team => team.id === game.awayId),
      home: teamInfo.find(team => team.id === game.homeId)
    })
  }

  const save = ({ gameId }) => {
    const { date, time: formattedTime, away, home, awayRS, homeRS, isFinal } = edit

    if (!isValidDate(date) || !isValidTime(formattedTime)) return

    const game = items[date]?.filter(game => gameId === game.gameId)[0] || undefined
    const time = _12HH_MM_ToMins(formattedTime)
    const awayId = away.id
    const homeId = home.id

    if (
      !game ||
      game.time !== time ||
      game.awayId !== awayId ||
      game.homeId !== homeId ||
      game.awayRS !== awayRS ||
      game.homeRS !== homeRS ||
      game.isFinal !== isFinal
    ) saveEdit({ gameId, edit: { date, time, awayId, homeId, awayRS, homeRS, isFinal } })

    setEditingId(null)
    setEdit({})

  }

  const remove = ({ gameId }) => {

  }

  return (
    <table style={{ margin: 'auto', width: '90%', tableLayout: 'fixed' }}>
      <thead>
      <tr>
        {['Date', 'Time', 'Away', 'Away - Runs','', 'Home', 'Home - Runs', 'Final', ''].map(col =>
          <td key={randomBits()}>{col}</td>
        )}
      </tr>
      </thead>
      <tbody>
      {
        Object.keys(items).map(date => items[date].map(game => {
          const { gameId } = game
          return editingId && editingId === gameId ? (
            <tr className={'tr edit'} key={gameId}>
              <TableCell placeholder={'yyyy-MM-dd'} value={edit.date} onChange={value => editField({ setter: setEdit, field: 'date', value })}/>
              <TableCell value={edit.time} onChange={value => editField({ setter: setEdit, field: 'time', value })}/>
              <TableCell>
                <DropDownMenu items={teamInfo} selection={edit.away} setSelection={value => {
                  editField({ setter: setEdit, field: 'away', value })
                }}/>
              </TableCell>
              <TableCell type={'number'} value={edit.awayRS} onChange={value => editField({ setter: setEdit, field: 'awayRS', value })}/>
              <td className={'atSign'}>@</td>
              <TableCell>
                <DropDownMenu items={teamInfo} selection={edit.home} setSelection={value => {
                  editField({ setter: setEdit, field: 'home', value })
                }}/>
              </TableCell>
              <TableCell type={'number'} value={edit.homeRS} onChange={value => editField({ setter: setEdit, field: 'homeRS', value })}/>
              <TableCell><input type={'checkbox'} checked={edit.isFinal} onChange={e => {
                const value = e.target.checked
                editField({ setter: setEdit, field: 'isFinal', value })
              }}/></TableCell>
              <td style={{ display: 'flex' }}><div onClick={e => save({ gameId })}>Save</div><div onClick={e => remove({ gameId })}>Remove</div></td>
            </tr>
          ) : (
            <tr className={'tr disabled'} key={gameId} onMouseOver={() => setHover({ gameId })} onMouseOut={() => setHover({ gameId: null })}>
              <TableCell value={date} disabled={true}/>
              <TableCell value={minsTo12HH_MM(game.time)} disabled={true}/>
              {/* if not using ReactDOM.unstable_batchUpdates() => teams[game.home/awayId]?.name as the component will update with teams that are not in the schedule since schedule will still not be updated until next render */}
              <TableCell value={teams[game.awayId].name} disabled={true}/>
              <TableCell value={game.awayRS} disabled={true}/>
              <td className={'atSign'}>@</td>
              <TableCell value={teams[game.homeId].name} disabled={true}/>
              <TableCell value={game.homeRS} disabled={true}/>
              <TableCell><input type={'checkbox'} checked={game.isFinal} disabled={true}/></TableCell>
              <td onClick={e => editRow({ game: { ...game, date } })}>{hover.gameId === gameId ? 'Edit' : ''}</td>
            </tr>
          )
        }))
      }
      <tr className={'tr'}>
        <TableCell placeholder={'ex. 2020-05-31'} value={newItem.date} onChange={value => editField({ setter: setNewItem, field: 'date', value })}/>
        <TableCell placeholder={'ex. 10:00AM'} value={newItem.time} onChange={value => editField({ setter: setNewItem, field: 'time', value })}/>
        {/*<TableCell placeholder={'Away'} value={newItem.awayId} onChange={value => editField({ setter: setNewItem, field: 'awayId', value })}/>*/}
        <TableCell>
          <DropDownMenu items={teamInfo} selection={newItem.away} setSelection={value => {
            editField({ setter: setNewItem, field: 'away', value })
          }}/>
        </TableCell>
        <td></td>
        <td className={'atSign'}>@</td>
        {/*<TableCell placeholder={'Home'} value={newItem.homeId} onChange={value => editField({ setter: setNewItem, field: 'homeId', value })}/>*/}
        <TableCell>
          <DropDownMenu items={teamInfo} selection={newItem.home} setSelection={value => {
            editField({ setter: setNewItem, field: 'home', value })
          }}/>
        </TableCell>
        <td></td>
        <td></td>
        <TableCell><input type={'submit'} value={'Add Game'} onClick={e => {
          const { date, time, away, home } = newItem

          if (!isValidDate(date) || !isValidTime(time)) return

          addGame({ date, time: _12HH_MM_ToMins(time), awayId: away.id, homeId: home.id })
          setNewItem({ date: "", time: "", away: teamInfo[0], home: teamInfo[1] })
        }}/></TableCell>
      </tr>
      </tbody>
    </table>
  )
}

const Schedule = () => {
  const [leagues, setLeagues] = useState([])
  const [league, setLeague] = useState({})
  const [teams, setTeams] = useState([])
  const [schedule, setSchedule] = useState({})

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
        ReactDOM.unstable_batchedUpdates(() => { // need teams and schedule to update in same render, otherwise might try to access team not in the schedule
          setTeams(teams)
          setSchedule(sortAscending({ schedule }))
        })
      })
  }, [league])

  useEffect(() => {
  },[teams, schedule])

  return (
    <>
      <AdminHeader />
      <Center>
        <Stack.Small>
          <DropDownMenu items={leagues} selection={league} setSelection={setLeague}/>
        </Stack.Small>
      </Center>

      <Center>
        <Stack.Small>
          <h1>Games</h1>
        </Stack.Small>
      </Center>

      {
      <Table
        items={schedule}
        teams={teams}
        addGame={({ date, time, awayId, homeId }) =>
          addGame({ date, time, awayId, homeId })
            .then(({ date, ...newGame }) => {
              setSchedule(prevSched => {
                const newSched = { ...prevSched }
                newSched[date] = newSched[date]?.concat(newGame) || [newGame]

                return sortAscending({ schedule: newSched })
              })
            })
        }
        saveEdit={({ gameId, edit }) =>
          editGame({ gameId, edit })
            .then(({ date, ...editedGame }) => {
              setSchedule(prevSched => {
                const newSched = Object.keys(prevSched).reduce((reduced, date) => ({
                  ...reduced,
                  [date]: prevSched[date].filter(game => game.gameId !== editedGame.gameId)
                }), {})

                newSched[date] = newSched[date]?.concat(editedGame) || [editedGame]

                return sortAscending({ schedule: newSched })
              })
            })
        }
      />
      }
    </>
  )
}

ReactDOM.render(<Schedule />, document.querySelector('#root'))