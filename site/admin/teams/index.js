import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

import AdminHeader from "../AdminHeader";
import { Center, Stack } from "../../helpers/Typography";
import { DropDownMenu } from "../../helpers/form";
import { TableCell } from "../../helpers/table";
import { ContainedButton, OutlineButton, TextButton, ActionButton } from '../../helpers/button'
import { CHECKMARK , X } from '../../helpers/constants'

import { fetchLeagues, fetchTeams, editTeam, addTeam } from '../../helpers/api'

const HEX_RE = new RegExp(/^#[a-fA-F0-9]{6}$/)

const Table = ({ items, addTeam, saveEdit, removeEntry }) => {
  const [editingId, setEditingId] = useState('')
  const [newItem, setNewItem] = useState({ name: '', color: '#000000' })
  const [edit, setEdit] = useState({})

  const isValidEntry = ({ name, color }) => name && HEX_RE.test(color)

  const editRow = ({ teamId }) => {
    if (!editingId) {
      setEditingId(teamId)
      setEdit({ ...items[teamId] })
    }
  }

  const editField = ({ field, value }) => setEdit(prev => ({ ...prev, [field]: value }))

  const save = ({ teamId }) => {
    const name = edit.name
    const color = edit.color

    setEditingId('')

    if (!isValidEntry({ name , color })) return

    if (name !== items[teamId].name || color !== items[teamId].color) saveEdit({ teamId, name, color })

  }

	const cancel = ({ teamId }) => {
		setEditingId('')
	}

  const remove = ({ teamId }) => {

  }

  return (
    <table className={'table large narrow center'}>
      <thead>
	      <tr className={'tr bg-primary color-secondary'}>
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
								{
									[{ field: 'name' }, { field: 'color', type: 'color' }].map(cell => {
										return <TableCell
											type={cell.type}
											dropDownItems={cell.dropDownItems}
											form={cell.form}
											value={edit[cell.field]}
											onChange={value => editField({ field: cell.field, value })} />
									})
								}
	              <td>
									<div style={{ display: 'flex' }}>
										<ContainedButton display={CHECKMARK} onClick={e => save({ teamId })} />
										<OutlineButton display={X} onClick={e => cancel({ teamId })} />
										{removeEntry && <TextButton display={'Remove'} onClick={e => remove({ teamId })} />}
									</div>
								</td>
	            </tr>
	          ) : (
	            <tr className={`tr disabled ${editingId ? 'fade' : ''} editable`} key={teamId}>
								{
									[items[teamId].name, items[teamId].color].map(value => {
										// TODO: should probably have a better check
										return <TableCell type={value.startsWith('#') ? 'color' : 'text'} value={value} disabled={true}/>
									})
								}
	              <td>
									<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
										<ActionButton display={'•••'} onClick={e => editRow({ teamId })} />
									</div>
								</td>
	            </tr>
	          )
	        })
	      }
	      <tr className={'tr'}>
					{
						[{ field: 'name', placeholder: 'Team Name' }, { field: 'color', type: 'color' }].map(cell => {
							return <TableCell
								type={cell.type}
								placeholder={cell.placeholder}
								dropDownItems={cell.dropDownItems}
								value={newItem[cell.field]}
								disabled={cell.disabled}
								onChange={value => setNewItem(prev => ({ ...prev, [cell.field]: value }))} />
						})
					}
	        <td>
						<ContainedButton display={'Add Team'} onClick={e => {
		          addTeam({ name: newItem.name, color: newItem.color })
							// TODO: check if add was successful...
		          setNewItem({ name: '', color: '#000000' })
		        }} disabled={!isValidEntry({ name: newItem.name , color: newItem.color })}/>
					</td>
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
      <AdminHeader current={'Teams'}/>
      <Center>
        <Stack.Small>
          <DropDownMenu items={leagues} selection={league} setSelection={setLeague}/>
        </Stack.Small>
      </Center>

      <Center>
        <Stack.Small>
          <h1>Teams</h1>
        </Stack.Small>
      </Center>

      {
        leagues.length > 0 &&
        <Table
          items={teams}
          addTeam={({ name, color }) => addTeam({ leagueId: league.id, name, color })
              .then(team => setTeams(teams => ({ ...teams, [team.id]: { name: team.name, color: team.color } })))
          }
          saveEdit={({ teamId, name, color }) => editTeam({ leagueId: league.id, teamId, name, color })
              .then(team => setTeams(teams => ({ ...teams, [team.id]: { name: team.name, color: team.color } })))
          }
        />
      }
    </>
  )
}

ReactDOM.render(<Teams />, document.querySelector('#root'))
