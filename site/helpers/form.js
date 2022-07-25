import React, { useState, useRef, useEffect } from "react";

import { DatePicker } from '../components/date-picker'

import { randomBits } from "./unique";

const FormRow = ({ children, style = {} }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginTop: '1.5em', marginBottom: '1.5em', ...style }}>{children}</div>
  )
}

const Input = ({ type = 'text', name, placeholder, value = '', autofocus, required, onChange, onBlur, helpText, error, icon, maxWidth }) => {
  const [mask, setMask] = useState(type === 'password')

  const handleOnBlur = e => {
    onBlur && onBlur(e.target.value) // used for custom validation
  }

  const handlePasswordMask = () => {
    setMask(prev => !prev)
    // e.stopPropagation()
  }

  return (
    <>
      <div className={`input ${placeholder ? 'has-label' : ''}`}>
      {
        type === 'date' ?
        <DatePicker name={name} value={value} onChange={e => onChange(e.target.value)} maxWidth={maxWidth} /> :
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input type={type === 'password' ? (mask ? 'password' : 'text') : type} name={name} value={value} autoFocus={autofocus} onBlur={handleOnBlur} onChange={e => onChange(e.target.value)} style={{ maxWidth }}/>
          {
            type === 'password' ?
            <i className={`fa-regular fa-eye${mask ? '' : '-slash'}`} onClick={handlePasswordMask}></i> :
            icon && <i className={icon}></i>
          }
        </div>
      }
        {placeholder && <label className={`label ${value !== '' ? 'raise' : ''}`} htmlFor={name}>{required && '*'} {placeholder}</label>}
        <p className={error ? 'error' : 'help'} onClick={e => {}}>{error ? error : helpText}</p>
      </div>
    </>
  )
}

const DropDownMenu = ({ selection = {}, setSelection, items = [], form, placeholder }) => {
  const [hideDropdown, setHideDropdown] = useState(true)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (!hideDropdown) dropdownRef.current.focus()
		else dropdownRef.current.blur()
  }, [hideDropdown])

  return (
    <div className={'dropdown'} ref={dropdownRef} onClick={() => setHideDropdown(prev => !prev)} onBlur={() => setHideDropdown(true)} tabIndex={-1}>
      <div className={`dropdown-btn ${form ? 'form' : ''}`} >
				{
					selection.name !== undefined ?
					<div>{selection.name}</div> :
					<div style={{ color: 'grey' }}>{placeholder}</div>
				}
				<i className={`fa-solid fa-caret-${hideDropdown ? 'down' : 'up' }`}></i>
      </div>

      <ul className={`dropdown-content ${hideDropdown ? 'hidden' : ''}`} style={{ borderRadius: form ? '0 0 5px 5px' : '' }}>
				{
					placeholder && <li className={'placeholder'} onClick={
						e => e.stopPropagation() // prevent closing dropdown when clicked
					}>{placeholder}</li>
				}
        {
          items.map(item =>
            <li key={randomBits()} style={{ fontWeight: selection.id === item.id ? '1000' : '' }} onClick={() => {
              setSelection(item)
            }}>{item.name}</li>
          )
        }
      </ul>
    </div>
  )
}

export { FormRow, Input, DropDownMenu }
