import React, { useState, useRef, useEffect } from "react";

import { randomBits } from "./unique";

const FormRow = ({ children, style = {} }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginTop: '1.5em', marginBottom: '1.5em', ...style }}>{children}</div>
  )
}

const Input = ({ type, name, placeholder, value = '', autofocus, required, onChange, onBlur, helpText, error }) => {
  // const [raise, setRaise] = useState(value !== '')
  const inputRef = useRef(null)
  const [mask, setMask] = useState(type === 'password')

  const handleOnBlur = e => {
    // raise label if input has text inside
    // setRaise(e.target.value !== '')
    onBlur && onBlur(e.target.value)
  }

  const onClick = () => inputRef.current.focus() // focus the input element to raise label

  return (
    <>
      <div className={'input'} onClick={onClick}>
        <input type={type === 'password' ? (mask ? 'password' : 'text') : type} name={name} ref={inputRef} value={value} autoFocus={autofocus} onBlur={handleOnBlur} onChange={e => onChange(e.target.value)}/>
        <label className={`label ${value !== '' ? 'raise' : ''}`} htmlFor={name}>{required && '*'} {placeholder}</label>
        {type === 'password' && <p className={'mask'} onClick={e => {
					setMask(prev => !prev)
					e.stopPropagation() // prevent the input from becoming focused
				}}>{mask ? 'Show' : 'Hide'}</p>}
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
				{
					hideDropdown ?
					<div>&#x25BE;</div> :
					<div className={'mirror'}>&#x25BE;</div>
				}
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
