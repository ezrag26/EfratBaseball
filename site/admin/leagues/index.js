import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import AdminHeader from "../AdminHeader";
import { fetchLeagues, addLeague, editLeague } from '../../helpers/api'

const Table = ({ items, addLeague, saveEdit }) => {
  const [editing, setEditing] = useState({ leagueId: undefined })
  const [newItem, setNewItem] = useState({ name: '' })
  const [edit, setEdit] = useState({})

  const isValidEntry = ({ name }) => name

  const editRow = ({ leagueId }) => {
    setEditing({ leagueId })
    setEdit({ ...items[leagueId] })
  }

  const editField = ({ field, value }) => setEdit(prev => ({ ...prev, [field]: value }))

  const save = ({ leagueId }) => {
    const name = edit.name

    setEditing({ leagueId: null })

    if (isValidEntry({ name }) && name !== items[leagueId].name) saveEdit({ leagueId, name })
  }

  const remove = ({ leagueId }) => {

  }

  return (
    <table style={{ margin: 'auto', width: '70%', tableLayout: 'fixed' }}>
      <caption>Leagues</caption>
      <thead>
      <tr>
        {['Name', ''].map(col =>
          <td key={col}>{col}</td>
        )}
      </tr>
      </thead>
      <tbody>
      {
        Object.keys(items).map(leagueId => {
          return editing.leagueId === leagueId ? (
            <tr className={'tr edit'} key={leagueId}>
              <td><input type={'text'} value={edit.name} onChange={e => editField({ field: 'name', value: e.target.value })}/></td>
              <td style={{ display: 'flex' }}><div onClick={e => save({ leagueId })}>Save</div><div onClick={e => remove({ leagueId })}>Remove</div></td>
            </tr>
          ) : (
            <tr className={'tr disabled'} key={leagueId}>
              <td><input type={'text'} value={items[leagueId].name} disabled={true}/></td>
              <td onClick={e => editRow({ leagueId })}>Edit</td>
            </tr>
          )
        })
      }
      <tr className={'tr'}>
        <td><input type={'text'} placeholder={'League Name'} value={newItem.name} onChange={e => {
          const value = e.target.value
          setNewItem(prev => ({ ...prev, name: value}))
        }}/></td>
        <td><input type={'submit'} value={'Add League'} onClick={e => {
          if (!isValidEntry({ name: newItem.name })) return

          addLeague({ name: newItem.name })
          setNewItem({ name: '' })
        }}/></td>
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
      <AdminHeader />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', width: '100%' }}>
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
      </div>
    </>
  )
}

ReactDOM.render(<Leagues />, document.querySelector('#root'))