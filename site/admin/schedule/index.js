import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import AdminHeader from "../AdminHeader";
import { fetchLeagues, fetchTeams, fetchSchedule, addGame, editGame } from '../../helpers/api'
import { DropDownMenu } from "../../helpers/form";
import { Center, Stack } from "../../helpers/Typography";
import { randomBits } from '../../helpers/unique'
import { sortAscending } from '../../helpers/schedule'
import { Table } from '../../helpers/Table'

const minsToHours = mins => ( mins / 60 )

const minsTo12HH_MM = mins => {
  const hoursMinutes = minsToHours(mins).toFixed(2).split('.')

  const hr = hoursMinutes[0]
  const min = ((hoursMinutes[1] / 100) * 60).toFixed(0)
  const [hrs, AM_PM] = (hr % 24) < 12 ? [hr % 24 || 12, 'AM'] : [hr % 12 || 12, 'PM']

  return `${hrs < 10 ? `0${hrs}` : hrs}:${min < 10 ? `0${min}` : min}${AM_PM}`
}

const formatDisplayTime = time => {
  return minsTo12HH_MM(time)
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

const formatTimeForRequest = time => {
  return _12HH_MM_ToMins(time)
}

const _12HH_MM_RE = new RegExp(/^(0?[1-9]|\d|1[0-2]):[0-5][0-9][aApP][mM]$/)

const YYYY_MM_DD_RE = new RegExp(/^\d{4}-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])$/)

const isValidDate = (date) => {
  if (!YYYY_MM_DD_RE.test(date)) {
    // console.error('Date must be a valid date in the format yyyy-MM-dd')
    return false
  }
  return true
}

const isValidTime = (time) => {
  if (!_12HH_MM_RE.test(time)) {
    // console.error('Time must be a valid time in the format HH:MM and must directly followed by AM or PM (no space in between)')
    return false
  }
  return true
}

const TableCell = ({ children, type = 'text', placeholder = '', value, size, onChange, disabled = false }) => {
  return (
    <td>
    {
      children ||
      <input type={type} placeholder={placeholder} value={value} size={size} onChange={e => onChange(e.target.value)} disabled={disabled}/>
    }
    </td>
  )
}

const CreateTable = ({ items, teams, addGame, saveEdit }) => {
  const [editingId, setEditingId] = useState('')
  const [newItem, setNewItem] = useState({ date: "", time: "" })
  const [edit, setEdit] = useState({})
  const [hoverId, setHoverId] = useState('')
  const [teamInfo, setTeamInfo] = useState()

  const editField = ({ setter, field, value }) => setter(prev => ({ ...prev, [field]: value }))

  useEffect(() => {
    setEditingId('')
    setEdit({})

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
      time: formatDisplayTime(game.time),
      away: teamInfo.find(team => team.id === game.awayId),
      home: teamInfo.find(team => team.id === game.homeId)
    })
  }

  const isValidNewGame = () => {
    return isValidDate(newItem.date) && isValidTime(newItem.time)
  }

  const isValidEdit = ({ gameId, edit }) => {
    const { date, time, awayId, homeId, awayRS, homeRS, isFinal } = edit
    const game = items[date]?.filter(game => gameId === game.gameId)[0] || undefined

    return !game ||
      game.time !== time ||
      game.awayId !== awayId ||
      game.homeId !== homeId ||
      game.awayRS !== awayRS ||
      game.homeRS !== homeRS ||
      game.isFinal !== isFinal
  }

  const save = ({ gameId }) => {
    const { date, time, away, home, awayRS, homeRS, isFinal } = edit

    if (!isValidDate(date) || !isValidTime(time)) return

    const formattedEdit = { date, time: formatTimeForRequest(time), awayId: away.id, homeId: home.id, awayRS, homeRS, isFinal }

    if (isValidEdit({ gameId, edit: formattedEdit })) {
      saveEdit({ gameId, edit: formattedEdit })
      setEditingId('')
      setEdit({})
    }
  }

  const remove = ({ gameId }) => {

  }

  const cancel = ({ gameId }) => {
    setEditingId('')
    setEdit({})
  }

  return (
    <table className={'table large wide center'}>
      <thead>
        <tr className={'tr bg-primary color-secondary'}>
          {['Date', 'Time', 'Away', 'Away RS','', 'Home', 'Home RS', 'Final', ''].map(col =>
            <td key={randomBits()}>{col}</td>
          )}
        </tr>
      </thead>
      <tbody>
      {
        Object.keys(items).map(date => items[date].map(game => {
          const { gameId } = game
          return editingId === gameId ? (
            <tr className={'tr edit'} key={gameId}>
              <TableCell placeholder={'yyyy-MM-dd'} value={edit.date} onChange={value => editField({ setter: setEdit, field: 'date', value })}/>
              <TableCell value={edit.time} onChange={value => editField({ setter: setEdit, field: 'time', value })}/>
              <TableCell>
                <DropDownMenu items={teamInfo} selection={edit.away} setSelection={value => {
                  editField({ setter: setEdit, field: 'away', value })
                }}/>
              </TableCell>
              <TableCell value={edit.awayRS} size={3} onChange={value => editField({ setter: setEdit, field: 'awayRS', value })}/>
              <td className={'atSign'}>@</td>
              <TableCell>
                <DropDownMenu items={teamInfo} selection={edit.home} setSelection={value => {
                  editField({ setter: setEdit, field: 'home', value })
                }}/>
              </TableCell>
              <TableCell value={edit.homeRS} size={3} onChange={value => editField({ setter: setEdit, field: 'homeRS', value })}/>
              <TableCell>
                <input type={'checkbox'} checked={edit.isFinal} onChange={e => {
                  const value = e.target.checked
                  editField({ setter: setEdit, field: 'isFinal', value })
                }}/>
              </TableCell>
              <td>
                <div style={{ display: 'flex' }}>
                  <div className={`button small primary`} onClick={e => save({ gameId })}>Save</div>
                  <div className={'button small secondary'} onClick={e => cancel({ gameId })}>Cancel</div>
                  <div className={'button small secondary'} onClick={e => remove({ gameId })}>Remove</div>
                </div>
              </td>
            </tr>
          ) : (
            <tr className={'tr disabled'} key={gameId} onMouseOver={() => editingId || setHoverId(gameId)} onMouseLeave={() => setHoverId('')}>
              <TableCell value={date} disabled={true}/>
              <TableCell value={formatDisplayTime(game.time)} disabled={true}/>
              {/* if not using ReactDOM.unstable_batchUpdates() => teams[game.home/awayId]?.name as the component will update with teams that are not in the schedule since schedule will still not be updated until next render */}
              <TableCell value={teams[game.awayId].name} disabled={true}/>
              <TableCell value={game.awayRS} disabled={true}/>
              <td className={'atSign'}>@</td>
              <TableCell value={teams[game.homeId].name} disabled={true}/>
              <TableCell value={game.homeRS} disabled={true}/>
              <TableCell>
                <input type={'checkbox'} checked={game.isFinal} disabled={true}/>
              </TableCell>
              <td>
                {
                  hoverId === gameId &&
                  <div style={{ display: 'flex' }}>
                    <div className={'button small primary'} onClick={e => editRow({ game: { ...game, date } })}>Edit</div>
                  </div>
                }
              </td>
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
          <TableCell>
            <input className={`button medium primary ${!isValidNewGame() && 'disabled'}`} type={'submit'} value={'Add Game'} onClick={e => {
              const { date, time, away, home } = newItem

              if (!isValidDate(date) || !isValidTime(time)) return

              e.target.value = 'Adding Game...'

              setTimeout(() => {
                addGame({ date, time: formatTimeForRequest(time), awayId: away.id, homeId: home.id })
                setNewItem({ date: "", time: "", away: teamInfo[0], home: teamInfo[1] })
              }, 1000)

            }} disabled={!isValidNewGame()}/>
          </TableCell>
        </tr>
      </tbody>
    </table>
  )
}

const Schedule = () => {
  const [leagues, setLeagues] = useState([])
  const [league, setLeague] = useState({})
  const [teams, setTeams] = useState({})
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

      <Table
        cols={ ['Date', 'Time', 'Away', 'Away RS','', 'Home', 'Home RS', 'Final', ''] }
        entries={[

        ]}
      />
      {
      <CreateTable
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