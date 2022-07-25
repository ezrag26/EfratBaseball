import React, { useEffect, useState } from "react";
import { randomBits } from "./unique";
import { DropDownMenu } from "./form"
import { DatePicker } from '../components/date-picker'

const TableCell = ({ children, type = 'text', placeholder = '', value, size, onChange, disabled = false, dropDownItems = [], form }) => {
	switch (type) {
		case 'dropdown':
			return <td><DropDownMenu items={dropDownItems} selection={value} setSelection={e => onChange(e)} form={form} placeholder={placeholder}/></td>
			break;
		case 'checkbox':
			return <td><input type={type} placeholder={placeholder} checked={value} onChange={e => onChange(e.target.checked)} disabled={disabled}/></td>
			break;
		case 'date':
			return <td><DatePicker value={value} onChange={e => onChange(e)}/></td>
			break;
		default:
			return <td><input style={{ outline: 'none', border: 'none', backgroundColor: 'inherit' }} size={size} type={type} placeholder={placeholder} value={value} size={size} onChange={e => onChange(e.target.value)} disabled={disabled}/></td>
			break;
	}
  // return (
  //   <td>
  //   {
  //     children ||
  //     <input type={type} placeholder={placeholder} value={value} size={size} onChange={e => onChange(e.target.value)} disabled={disabled}/>
  //   }
  //   </td>
  // )
}

const Table = ({ cols, entries, edit, saveEdit, cancelEdit = () => {}, removeEntry, newRow, addEntry }) => {
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
		edit({ id })
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
					// console.log(cells);
          return (
            <tr className={`tr ${editingId === id ? 'edit' : 'disabled'}`} key={id} onMouseOver={() => editingId || setHoverId(id)} onMouseLeave={() => setHoverId('')}>
              {
                cells?.map((cell, i) => {
									// console.log(cell);
                  return (
										editingId !== id ?
										<td key={randomBits()}>{cell.dropDownInfo ? cell.current.name : cell.current}</td> : (
											cell.dropDownInfo ?
											<TableCell>
												<DropDownMenu key={randomBits()} items={cell.dropDownInfo} selection={cell.current} setSelection={value => cell.set({ value })} />
											</TableCell> :
											<TableCell value={cell.current} onChange={value => cell.set({ value })} />
										)
									)
                })
              }
              <td>
                {
                  editingId === id ? (
                    <div style={{ display: 'flex' }}>
                      <div className={`button small primary`} onClick={e => save({ id })}>Save</div>
                      <div className={'button small secondary'} onClick={e => cancel({ id })}>Cancel</div>
                      <div className={'button small secondary'} onClick={e => remove({ id })}>Remove</div>
                    </div>
                  ) : (
                    hoverId === id &&
										<div style={{ display: 'flex' }}>
	                    <div className={'button small primary'} onClick={e => editRow({ id })}>Edit</div>
										</div>
                  )
                }
              </td>
            </tr>
          )
        })
      }{/*
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
        </tr>*/}
      </tbody>
    </table>
  )
}

export { Table, TableCell }
