import React, { useState, useRef } from "react";
import { randomBits } from "./unique";
import { Tab } from './tab'

const FormRow = ({ children }) => {
  return (
    <div style={{ display: 'flex' }}>{children}</div>
  )
}

const Input = ({ type, name, placeHolder, value = '', onChange }) => {
  const [raise, setRaise] = useState(false)
  const inputRef = useRef(null)

  const onBlur = e => {
    // raise label if input has text inside
    e.target.value ? setRaise(true) : setRaise(false)
  }

  const onClick = () => inputRef.current.focus() // focus the input element to raise label

  return (
    <div className={'input'}>
      <input type={type} name={name} ref={inputRef} onBlur={onBlur} value={value} onChange={e => onChange(e.target.value)}/>
      <label className={`label ${raise ? 'raise' : ''}`} htmlFor={name} onClick={onClick}>{placeHolder}</label>
    </div>
  )
}

const DropDownMenu = ({ selection, setSelection, items }) => {
  const [hideDropdown, setHideDropdown] = useState(true)

  return (
    <div className={'dropdown'} onBlur={() => setHideDropdown(true)} tabIndex={-1}>
      <div className={'dropdown-btn'} onClick={() => setHideDropdown(false)}>
        <div>{selection?.name || 'No Items'}</div>
        <div>&#x25BE;</div>
      </div>

      <ul className={`dropdown-content ${hideDropdown ? 'hidden' : ''}`}>
        {
          items.map(item =>
            <Tab key={randomBits()} text={`${item.name}`} onClick={() => {
              setSelection(item)
              setHideDropdown(true)
            }} />
          )
        }
      </ul>
    </div>
  )
}

export { FormRow, Input, DropDownMenu }