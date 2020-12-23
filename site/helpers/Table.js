import React, { useEffect, useState } from "react";
import { randomBits } from "./unique";

const Table = ({ cols, entries, saveEdit, cancelEdit, removeEntry, newRow, addEntry }) => {
  const [editingId, setEditingId] = useState('')
  const [hoverId, setHoverId] = useState('')

  const save = ({ id }) => {
    saveEdit({ id })
    setEditingId('')
  }

  const remove = ({ id }) => {
    removeEntry({ id })
    setEditingId('')
  }

  const cancel = ({ id }) => {
    cancelEdit({ id })
    setEditingId('')
  }

  const editRow = ({ id }) => {
    setEditingId(id)
  }

  return (
    <table className={'table large wide center'}>
      <thead>
      <tr className={'tr bg-primary color-secondary'}>
        {cols.map(col =>
          <td key={randomBits()}>{col}</td>
        )}
      </tr>
      </thead>
      <tbody>
      {
        entries.map(row => {
          const { id, cells } = row
          return (
            <tr className={`tr ${editingId === id && 'edit'}`} key={id} onMouseOver={() => editingId || setHoverId(id)}
                onMouseLeave={() => setHoverId('')}>
              {
                cells.map(cell => {
                  return <td key={randomBits()}>{cell}</td>
                })
              }
              <td>
                <div style={{ display: 'flex' }}>
                {
                  editingId === id ? (
                    <>
                      <div className={`button small primary`} onClick={e => save({ id })}>Save</div>
                      <div className={'button small secondary'} onClick={e => cancel({ id })}>Cancel</div>
                      <div className={'button small secondary'} onClick={e => remove({ id })}>Remove</div>
                    </>
                  ) : (
                    hoverId === id &&
                    <div className={'button small primary'} onClick={e => editRow({ id })}>Edit</div>
                  )
                }
                </div>
              </td>
            </tr>
          )
        })
      }
        <tr className={'tr'}>
        {
          newRow.map(cell => {
            return <td>{cell}</td>
          })
        }
          <td>
            <input className={`button medium primary ${!newRow.isValid() && 'disabled'}`} type={'submit'} value={'Add Entry'} onClick={e => {
              e.target.value = 'Adding Entry...'

              setTimeout(() => {
                addEntry()
              }, 1000)

            }} disabled={!newRow.isValid()}/>
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export { Table }