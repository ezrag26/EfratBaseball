import React, { useState, useRef, useEffect } from "react";

import { DatePicker } from '../components/date-picker'

import { randomBits } from "./unique";

const FormRow = ({ children, style = {} }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginTop: '1.5em', marginBottom: '1.5em', ...style }}>{children}</div>
  )
}

const Input = ({ type = 'text', name, placeholder, value = '', autofocus, required, onChange, onBlur, selection = {}, items, helpText, error, icon, maxWidth }) => {
  const ref = useRef(null)
  const [mask, setMask] = useState(type === 'password')
  const [hideDropdown, setHideDropdown] = useState(true)

  const isSelect = () => type === 'select'

  const inputValue = () => isSelect() ? selection.name || '' : value

  const handleOnBlur = e => {
    if (onBlur) {
      onBlur(e.target.value) // used by user to validate, add error message if needed
    }

    if (isSelect()) {
      setHideDropdown(true)
    }
  }

  const handleOnClick = e => {
    if (isSelect()) {
      setHideDropdown(prev => !prev)
    }
  }

  const handlePasswordMask = () => {
    setMask(prev => !prev)
    // e.stopPropagation()
  }

  useEffect(() => {
    if (!hideDropdown) ref.current.focus()
    else ref.current.blur()
  }, [hideDropdown])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', paddingRight: '1rem' }}>
      <div className={`input ${placeholder ? 'has-label' : ''}`} ref={ref} onBlur={handleOnBlur} onClick={handleOnClick} tabIndex={-1}>
      {
        type === 'date' ?
        <DatePicker name={name} value={value} onChange={onChange} maxWidth={maxWidth} /> :
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input type={type === 'password' ? (mask ? 'password' : 'text') : type} name={name} value={inputValue()} onBlur={e => e.stopPropagation()} autoFocus={autofocus} readOnly={isSelect()} onChange={e => onChange(e.target.value)} style={{ maxWidth }} />
          {
            type === 'password' ?
            <i className={`fa-regular fa-eye${mask ? '' : '-slash'}`} onClick={handlePasswordMask}></i> :
            icon && <i className={icon}></i>
          }
        </div>
      }
        {placeholder && <label className={`label ${inputValue() !== '' ? 'raise' : ''}`} htmlFor={name}>{required && '*'} {placeholder}</label>}
        <p className={error ? 'error' : 'help'} onClick={e => {}}>{error ? error : helpText}</p>
      </div>
      {
        !hideDropdown &&
        <InputSelect items={items} value={selection} onClick={onChange} />
      }
    </div>
  )
}

const InputSelect = ({ items = [], value = {}, onClick }) => {
  return (
    <div className={'dropdown'}>
      <ul className={`dropdown-content`}>
        {
          items.map(item =>
            <li key={item.id} style={{ fontWeight: value.id === item.id ? '1000' : '' }} onMouseDown={() => {
              // Cannot use onClick as it is fired after onBlur.
              // onMouseDown is fired before onBlur, which is needed because
              // otherwise the dropdown would be hidden first from the parent Input
              // component, and therefore this event cannot be fired since it
              // won't exist
              onClick(item)
            }}>{item.name}</li>
          )
        }
      </ul>
    </div>
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
