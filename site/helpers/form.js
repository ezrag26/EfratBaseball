import React, { useState, useRef, useEffect } from "react";
import { randomBits } from "./unique";

const FormRow = ({ children }) => {
  return (
    <div style={{ display: 'flex' }}>{children}</div>
  )
}

const Input = ({ type, name, placeHolder, value = '', onChange, helpText, error }) => {
  const [raise, setRaise] = useState(false)
  const inputRef = useRef(null)

  const onBlur = e => {
    // raise label if input has text inside
    setRaise(e.target.value !== '')
  }

  const onClick = () => inputRef.current.focus() // focus the input element to raise label

  return (
    <>
      <div className={'input'} onClick={onClick}>
        <input type={type} name={name} ref={inputRef} value={value} onBlur={onBlur} onChange={e => onChange(e.target.value)}/>
        <label className={`label ${raise ? 'raise' : ''}`} htmlFor={name}>{placeHolder}</label>
        <p className={error ? 'error' : 'help'} onClick={e => {}}>{error ? error : helpText}</p>
      </div>
    </>
  )
}

const DropDownMenu = ({ selection, setSelection, items }) => {
  const [hideDropdown, setHideDropdown] = useState(true)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (!hideDropdown) dropdownRef.current.focus()
  }, [hideDropdown])

  return (
    <div className={'dropdown'}>
      <div className={'dropdown-btn'} style={{ borderRadius: !hideDropdown ? '5px 5px 0 0' : '' }} onClick={() => setHideDropdown(false)}>
        <div>{selection?.name || 'No Items'}</div>
        <div style={{ backgroundColor: !hideDropdown ? 'rgba(0, 0, 0, .1)' : '', borderRadius: !hideDropdown ? '0 5px 0 0' : '' }}>&#x25BE;</div>
      </div>

      <ul className={`dropdown-content ${hideDropdown ? 'hidden' : ''}`} ref={dropdownRef} onBlur={() => setHideDropdown(true)} tabIndex={-1}>
        {
          items.map(item =>
            <li key={randomBits()} style={{ fontWeight: selection.name === item.name ? '1000' : '' }} onClick={() => {
              setSelection(item)
              setHideDropdown(true)
            }}>{item.name}</li>
          )
        }
      </ul>
    </div>
  )
}

export { FormRow, Input, DropDownMenu }