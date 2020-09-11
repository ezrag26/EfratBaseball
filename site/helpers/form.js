import React, { useState } from "react";
import { randomBits } from "./unique";
import { Tab } from './tab'

const onBlur = elem => {
  const e = elem.target

  // raise label if input has text inside
  e.value ? e.nextElementSibling.classList.add('raise') : e.nextElementSibling.classList.remove('raise')
}

const onClick = elem => elem.target.previousElementSibling.focus() // focus the input element to raise label

const FormRow = ({ children }) => {
  return (
    <div style={{ display: 'flex' }}>{children}</div>
  )
}

const Input = ({ type, name, placeHolder, value = '', onChange }) => {
  return (
    <div className={'input'}>
      <input type={type} name={name} onBlur={onBlur} value={value} onChange={e => onChange(e.target.value)}/>
      <label className={'label'} htmlFor={name} onClick={onClick}>{placeHolder}</label>
    </div>
  )
}

const DropDown = ({ items, value, onChange }) => {

  return (
    <select name={'carrier'} id={'carrier'} style={{ backgroundColor: 'white', fontSize: '1.5rem', width: 'auto', height: 'auto', margin: 'auto 10px 2px 0' }} value={value} onChange={e => onChange(e.target.value)}>
      { items.map(item => <option key={randomBits()} value={item}>{item}</option>) }
    </select>
  )
}

const DropDownMenu = ({ selection, setSelection, items }) => {
  const [hideDropdown, setHideDropdown] = useState(true)

  return (
    <div className={'dropdown'} onBlur={() => setHideDropdown(true)} tabIndex={-1}>
      <div className={'dropdown-btn'} onClick={() => setHideDropdown(false)}>
        <div>{selection?.name || 'No Leagues'}</div>
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

export { FormRow, Input, DropDown, DropDownMenu }