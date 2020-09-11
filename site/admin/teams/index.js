import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

import AdminHeader from "../AdminHeader";
import { fetchLeagues, fetchTeams, editTeam, addTeam } from '../../helpers/api'
import Stack from "../../helpers/Stack";
import { DropDownMenu } from "../../helpers/form";

const HEX_RE = new RegExp(/^#[a-fA-F0-9]{6}$/)

const Table = ({ items, addTeam, saveEdit }) => {
  const [editingId, setEditingId] = useState()
  const [newItem, setNewItem] = useState({ name: '', color: '#000000' })
  const [edit, setEdit] = useState({})

  const isValidEntry = ({ name, color }) => name && HEX_RE.test(color)

  const editRow = ({ teamId }) => {
    if (!editingId) {
      setEditingId(teamId)
      setEdit({...items[teamId]})
    }
  }

  const editField = ({ field, value }) => setEdit(prev => ({ ...prev, [field]: value }))

  const save = ({ teamId }) => {
    const name = edit.name
    const color = edit.color

    setEditingId(null)

    if (!isValidEntry({ name , color })) return

    if (name !== items[teamId].name || color !== items[teamId].color) saveEdit({ teamId, name, color })

  }

  const remove = ({ teamId }) => {

  }

  return (
    <table style={{ margin: 'auto', width: '70%', tableLayout: 'fixed' }}>
      <caption>Teams</caption>
      <thead>
      <tr>
        {['Name', 'Color', ''].map(col =>
          <td key={col}>{col}</td>
        )}
      </tr>
      </thead>
      <tbody>
      {
        Object.keys(items).map(teamId => {
          return editingId === teamId ? (
            <tr className={'tr edit'} key={teamId}>
              <td><input type={'text'} value={edit.name} onChange={e => editField({ field: 'name', value: e.target.value })}/></td>
              <td><input type={'color'} value={edit.color} onChange={e => editField({ field: 'color', value: e.target.value })}/></td>
              <td style={{ display: 'flex' }}><div onClick={e => save({ teamId })}>Save</div><div onClick={e => remove({ teamId })}>Remove</div></td>
            </tr>
          ) : (
            <tr className={`tr disabled ${editingId ? 'fade' : ''}`} key={teamId}>
              <td><input type={'text'} value={items[teamId].name} disabled={true}/></td>
              <td><input type={'color'} value={items[teamId].color} disabled={true}/></td>
              <td onClick={e => editRow({ teamId })}>Edit</td>
            </tr>
          )
        })
      }
      <tr className={'tr'}>
        <td><input type={'text'} placeholder={'Team Name'} value={newItem.name} onChange={e => {
          const value = e.target.value
          setNewItem(prev => ({ ...prev, name: value}))
        }}/></td>
        <td><input type={'color'} value={newItem.color} onChange={e => {
          const value = e.target.value
          setNewItem(prev => ({ ...prev, color: value}))
        }}/></td>
        <td><input type={'submit'} value={'Add Team'} onClick={e => {
          if (!isValidEntry({ name: newItem.name , color: newItem.color })) return

          addTeam({ name: newItem.name, color: newItem.color })
          setNewItem({ name: '', color: '#000000' })
        }}/></td>
      </tr>
      </tbody>
    </table>
  )
}

const Teams = () => {
  const [leagues, setLeagues] = useState([])
  const [league, setLeague] = useState({})
  const [teams, setTeams] = useState({})

  useEffect(() => {
    fetchLeagues()
      .then(leagues => {
        setLeagues(leagues)
        setLeague(leagues[0] || {})
      })
  }, [])

  useEffect(() => {
    if (!league.id) return

    fetchTeams({ leagueId: league.id })
      .then(teams => setTeams(teams))
  }, [league])

  return (
    <>
      <AdminHeader />
      <Stack.Small style={{ display: 'flex', justifyContent: 'space-around' }}>
        <DropDownMenu items={leagues} selection={league} setSelection={setLeague}/>
      </Stack.Small>
      {
        leagues.length > 0 &&
        <Table
          items={teams}
          addTeam={({ name, color }) => addTeam({ leagueId: league.id, name, color })
              .then(team => setTeams(teams => ({ ...teams, [team.id]: { name: team.name, color: team.color } })))
          }
          saveEdit={({ teamId, name, color }) => editTeam({ teamId, name, color })
              .then(team => setTeams(teams => ({ ...teams, [team.id]: { name: team.name, color: team.color } })))
          }
        />
      }
    </>
  )
}

ReactDOM.render(<Teams />, document.querySelector('#root'))