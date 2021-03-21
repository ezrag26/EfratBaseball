import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

import AdminHeader from "../AdminHeader";
import { TableCell } from '../../helpers/table'
import { ContainedButton, OutlineButton, TextButton, ActionButton } from '../../helpers/button'
import { Center, Stack } from "../../helpers/Typography";
import { CHECKMARK , X } from '../../helpers/constants'

import { fetchLeagues, addLeague, editLeague } from '../../helpers/api'

const Table = ({ items, addLeague, saveEdit, removeEntry }) => {
  const [editingId, setEditingId] = useState('')
  const [newItem, setNewItem] = useState({ name: '' })
  const [edit, setEdit] = useState({})

  const isValidEntry = ({ name }) => name

  const editRow = ({ leagueId }) => {
    setEditingId(leagueId)
    setEdit({ ...items[leagueId] })
  }

  const editField = ({ field, value }) => setEdit(prev => ({ ...prev, [field]: value }))

  const save = ({ leagueId }) => {
    const name = edit.name

    setEditingId('')

    if (isValidEntry({ name }) && name !== items[leagueId].name) saveEdit({ leagueId, name })
  }

	const cancel = () => {
		setEditingId('')
	}

  const remove = ({ leagueId }) => {

  }

  return (
    <table className={'table large narrow center'}>
      <thead>
      <tr className={'tr bg-primary color-secondary'}>
        {['Name', ''].map(col =>
          <td key={col}>{col}</td>
        )}
      </tr>
      </thead>
      <tbody>
	      {
	        Object.keys(items).map(leagueId => {
	          return editingId === leagueId ? (
	            <tr className={'tr edit'} key={leagueId}>
								{
									[{ field: 'name' }].map(cell => {
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
										<ContainedButton display={CHECKMARK} onClick={e => save({ leagueId })} />
										<OutlineButton display={X} onClick={e => cancel({ leagueId })} />
										{removeEntry && <TextButton display={'Remove'} onClick={e => remove({ leagueId })} />}
									</div>
								</td>
	            </tr>
	          ) : (
	            <tr className={`tr disabled ${editingId ? 'fade' : ''} editable`} key={leagueId}>
								{
									[items[leagueId].name].map(v => {
										return <TableCell type={typeof v === 'boolean' ? 'checkbox' : 'text'} value={v} disabled={true} />
									})
								}
	              <td>
									<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
										<ActionButton display={'•••'} onClick={e => editRow({ leagueId })} />
									</div>
								</td>
	            </tr>
	          )
	        })
	      }
	      <tr className={'tr'}>
					{
						[{ field: 'name', placeholder: 'League Name' }].map(cell => {
							return <TableCell
								type={cell.type}
								placeholder={cell.placeholder}
								dropDownItems={cell.dropDownItems}
								form={cell.form}
								value={newItem[cell.field]}
								disabled={cell.disabled}
								onChange={value => setNewItem(prev => ({ ...prev, [cell.field]: value }))} />
						})
					}
	        <td>
						<ContainedButton display={'Add League'} onClick={e => {
		          addLeague({ name: newItem.name })
							//TODO: check if add was successful...
		          setNewItem({ name: '' })
		        }} disabled={!isValidEntry({ name: newItem.name })} />
					</td>
	      </tr>
      </tbody>
    </table>
  )
}

const Leagues = () => {
  const [leagues, setLeagues] = useState([])

  useEffect(() => {
    fetchLeagues()
      .then(leagues => {
        setLeagues(leagues)
      })
  }, [])

  return (
    <>
      <AdminHeader current={'Leagues'}/>
      <Center>
        <Stack.Small>
          <h1>Leagues</h1>
        </Stack.Small>
      </Center>

      <Table
        items={
          leagues.reduce((reduced, { id, ...rest }) => ({
            ...reduced,
            [id]: rest
          }), {})
        }

        addLeague={({ name }) => addLeague({ name })
          .then(league => setLeagues(leagues => leagues.concat(league)))
        }

        saveEdit={({ leagueId, name }) => {
          editLeague({ leagueId, name })
            .then(editedLeague => {
              setLeagues(leagues => leagues.map(league => {
                if (league.id === editedLeague.id) league.name = editedLeague.name
                return league
              }))
            })
        }}
      />
      {/*<table style={{ width: '80%' }}>*/}
      {/*  <thead>*/}
      {/*    <tr>*/}
      {/*      <td>League Name</td>*/}
      {/*      <td>Age Range (Yrs)</td>*/}
      {/*      <td></td>*/}
      {/*      <td></td>*/}
      {/*    </tr>*/}
      {/*  </thead>*/}
      {/*  <tbody>*/}
      {/*    {*/}
      {/*      leagues.map(league =>*/}
      {/*        <tr key={league.id} style={{ border: 'solid 1px grey' }}>*/}
      {/*          <td>{league.name}</td>*/}
      {/*          <td>{league.youngest} - {league.oldest}</td>*/}
      {/*          <td>Edit</td>*/}
      {/*          <td>Remove</td>*/}
      {/*        </tr>*/}
      {/*      )*/}
      {/*    }*/}
      {/*  </tbody>*/}
      {/*</table>*/}
    </>
  )
}

ReactDOM.render(<Leagues />, document.querySelector('#root'))
