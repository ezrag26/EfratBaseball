import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import AdminHeader from "../AdminHeader";
import { fetchLeagues, fetchTeams, fetchSchedule, addGame } from '../../helpers/api'
import { DropDownMenu } from "../../helpers/form";
import Stack from "../../helpers/Stack";
import { randomBits } from '../../helpers/unique'

const minsToHours = mins => ( mins / 60 )

const minsTo12HH_MM = mins => {
  const hoursMinutes = minsToHours(mins).toFixed(2).split('.')

  const hr = hoursMinutes[0]
  const min = ((hoursMinutes[1] / 100) * 60).toFixed(0)
  const [hrs, AM_PM] = (hr % 24) < 12 ? [hr % 24 || 12, 'AM'] : [hr % 12 || 12, 'PM']

  return `${hrs < 10 ? `0${hrs}` : hrs}:${min < 10 ? `0${min}` : min}${AM_PM}`
}

const TableCell = ({ type, placeholder = '', value, onChange, disabled = false }) => {
  return (
    <td><input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} disabled={disabled}/></td>
  )
}

const Table = ({ items, teams, addGame, saveEdit }) => {
  const [editingId, setEditingId] = useState()
  const [newItem, setNewItem] = useState({ date: "", time: "", awayId: "", homeId: "" })
  const [edit, setEdit] = useState({})
  const [hover, setHover] = useState({ gameId: undefined })

  const editRow = ({ gameId, game }) => {
    setEditingId(gameId)
    setEdit({ ...game })
  }

  const editField = ({ setter, field, value }) => setter(prev => ({ ...prev, [field]: value }))

  const save = ({ gameId }) => {
    // const name = edit.name
    // const color = edit.color

    setEditingId(null)
    setEdit({})

    // if (!name || !hexRE.test(color)) return

    // if (name !== items[gameId].name || color !== items[gameId].color) saveEdit({ gameId, name, color })

  }

  const remove = ({ gameId }) => {

  }

  return (
    <table style={{ margin: 'auto', width: '90%', tableLayout: 'fixed' }}>
      <caption style={{ fontSize: '2rem' }}>Games</caption>
      <thead>
      <tr>
        {['Date', 'Time', 'Away', '', 'Home', 'Away - Runs', 'Home - Runs', 'Final', ''].map(col =>
          <td key={randomBits()}>{col}</td>
        )}
      </tr>
      </thead>
      <tbody>
      {
        Object.keys(items).map(date => items[date].map(game => {
          // console.log(teams, game)
          const { id: gameId } = game
          return editingId && editingId === gameId ? (
            <tr className={'tr edit'} key={gameId}>
              <TableCell type={'text'} placeholder={'yyyy-MM-dd'} value={edit.date} onChange={value => editField({ setter: setEdit, field: 'date', value })}/>
              <TableCell type={'text'} value={minsTo12HH_MM(edit.time)} onChange={value => editField({ setter: setEdit, field: 'time', value })}/>
              {/* if not using ReactDOM.unstable_batchUpdates() => teams[edit.home/awayId]?.name as the component will update with teams that are not in the schedule since schedule will still not be updated until next render */}
              <TableCell type={'text'} value={teams[edit.awayId].name} onChange={value => editField({ setter: setEdit, field: 'awayId', value })}/>
              <td className={'atSign'}>@</td>
              <TableCell type={'text'} value={teams[edit.homeId].name} onChange={value => editField({ setter: setEdit, field: 'homeId', value })}/>
              <TableCell type={'number'} value={edit.awayRS} onChange={value => editField({ setter: setEdit, field: 'awayRS', value })}/>
              <TableCell type={'number'} value={edit.homeRS} onChange={value => editField({ setter: setEdit, field: 'homeRS', value })}/>
              <td><input type={'checkbox'} checked={edit.isFinal} onChange={e => {
                const value = e.target.checked
                setEdit(prev => ({ ...prev, isFinal: value}))
              }}/></td>
              <td style={{ display: 'flex' }}><div onClick={e => save({ gameId })}>Save</div><div onClick={e => remove({ gameId })}>Remove</div></td>
            </tr>
          ) : (
            <tr className={'tr disabled'} key={gameId} onMouseOver={() => setHover({ gameId })} onMouseOut={() => setHover({ gameId: null })}>
              <TableCell type={'text'} value={date} disabled={true}/>
              <TableCell type={'text'} value={minsTo12HH_MM(game.time)} disabled={true}/>
              {/* if not using ReactDOM.unstable_batchUpdates() => teams[game.home/awayId]?.name as the component will update with teams that are not in the schedule since schedule will still not be updated until next render */}
              <TableCell type={'text'} value={teams[game.awayId].name} disabled={true}/>
              <td className={'atSign'}>@</td>
              <TableCell type={'text'} value={teams[game.homeId].name} disabled={true}/>
              <TableCell type={'number'} value={game.awayRS} disabled={true}/>
              <TableCell type={'number'} value={game.homeRS} disabled={true}/>
              <td><input type={'checkbox'} checked={game.isFinal} disabled={true}/></td>
              <td onClick={e => editRow({ gameId, game: { ...game, date } })}>{hover.gameId === gameId ? 'Edit' : ''}</td>
            </tr>
          )
        }))
      }
      <tr className={'tr'}>
        <TableCell type={'text'} placeholder={'Date'} value={newItem.date} onChange={value => editField({ setter: setNewItem, field: 'date', value })}/>
        <TableCell type={'text'} placeholder={'Time'} value={newItem.time} onChange={value => editField({ setter: setNewItem, field: 'time', value })}/>
        <TableCell type={'text'} placeholder={'Away'} value={newItem.awayId} onChange={value => editField({ setter: setNewItem, field: 'awayId', value })}/>
        <td className={'atSign'}>@</td>
        <TableCell type={'text'} placeholder={'Home'} value={newItem.homeId} onChange={value => editField({ setter: setNewItem, field: 'homeId', value })}/>
        <td></td>
        <td></td>
        <td></td>
        <td><input type={'submit'} value={'Add Game'} onClick={e => {
          const { date, time, awayId, homeId } = newItem
          addGame({ date, time, awayId, homeId })
          setNewItem({ date: "", time: "", awayId: "", homeId: "" })
        }}/></td>
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
          setSchedule(schedule)
        })
      })
  }, [league])

  useEffect(() => {
  },[teams, schedule])

  return (
    <>
      <AdminHeader />
      <Stack.Small style={{ display: 'flex', justifyContent: 'space-around' }}>
        <DropDownMenu items={leagues} selection={league} setSelection={setLeague}/>
      </Stack.Small>
      {

      <Table
        items={schedule}
        teams={teams}
        addGame={({ date, time, awayId, homeId }) =>
          addGame({ leagueId: league.id, date, time, awayId, homeId })
            .then(game => fetchSchedule({ leagueId: league.id })
                .then(schedule => {
                  setSchedule(schedule)
                })
            )
        }
      />
      }
      {/*<div>*/}
      {/*  <select>*/}
      {/*    <option value={''}>Away Team</option>*/}
      {/*    { Object.keys(teams).map(teamId => <option key={teamId} value={teamId}>{teams[teamId].name}</option>) }*/}
      {/*  </select>*/}
      {/*  @*/}
      {/*  <select>*/}
      {/*    <option value={''}>Home Team</option>*/}
      {/*    { Object.keys(teams).map(teamId => <option key={teamId} value={teamId}>{teams[teamId].name}</option>) }*/}
      {/*  </select>*/}
      {/*  <select>*/}
      {/*    { ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map(hour =>*/}
      {/*        <option key={hour} value={hour}>{hour}</option>*/}
      {/*      )*/}
      {/*    }*/}
      {/*  </select>*/}
      {/*  <select>*/}
      {/*    { ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map(hour =>*/}
      {/*        <option key={hour} value={hour}>{hour}</option>*/}
      {/*      )*/}
      {/*    }*/}
      {/*  </select>*/}
      {/*  <select>*/}
      {/*    { ['AM', 'PM'].map(hour => <option key={hour} value={hour}>{hour}</option>) }*/}
      {/*  </select>*/}
      {/*</div>*/}
    </>
  )
}

ReactDOM.render(<Schedule />, document.querySelector('#root'))