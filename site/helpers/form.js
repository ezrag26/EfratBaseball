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
  const [focus, setFocus] = useState(false)

  const isSelect = () => type === 'select'
  const isDate = () => type === 'date'

  const inputValue = () => isSelect() ? selection.name || '' : value

  const handleOnBlur = e => {
    if (onBlur) {
      onBlur(inputValue()) // used by user to validate, add error message if needed
    }

    setFocus(false)
  }

  const handleOnClick = e => {
    setFocus(true)
  }

  const handlePasswordMask = () => {
    setMask(prev => !prev)
    // e.stopPropagation()
  }

  useEffect(() => {
    if (!ref.current) return

    focus ? ref.current.focus() : ref.current.blur()
  }, [focus])

  return (
    <div className={'input'} onClick={handleOnClick} tabIndex={-1}>
      <div className={`input__box ${placeholder ? 'has-label' : ''}`}>
      {
        isDate() ?
        <DatePicker name={name} value={value} onChange={onChange} maxWidth={maxWidth} /> :
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input type={type === 'password' ? (mask ? 'password' : 'text') : type} name={name} value={inputValue()} ref={ref}  onBlur={handleOnBlur} autoFocus={autofocus} readOnly={isSelect()} onChange={e => onChange(e.target.value)} style={{ maxWidth }} />
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
        focus && isSelect() &&
        <InputSelect items={items} value={selection} onClick={item => {
          onChange(item)
          setFocus(false)
        }} />
      }
    </div>
  )
}

const InputSelect = ({ items = [], value = {}, onClick }) => {
  return (
    <div className={'input-select'}>
      <ul className={`input-select__list`}>
        {
          items.map(item =>
            <li key={item.id} style={{ fontWeight: value.id === item.id ? '1000' : '' }} onMouseDown={() => {
              // cannot use onClick here, as the parent component blurs before
              // the item is clicked and therefore never fires. However,
              // onMouseDown fires before the parent blurs
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
