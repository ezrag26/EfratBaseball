import React, { useState, useEffect } from 'react'
import { DropDownMenu } from './form'

const hours = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11']
const mins = ['00', '05', '10', '15', '20', '30', '35', '40', '45', '50', '55']
const meridiems = ['AM', 'PM']

const TimePicker = ({ value, onChange }) => {
	const [hour, setHour] = useState('')
	const [min, setMin] = useState('')
	const [meridiem, setMeridiem] = useState('AM')

	return (
		<div style={{ display: 'flex' }}>
			{/*<DropDownMenu items={hours.map(hour => ({ id: hour, name: hour }))} selection={hour} setSelection={val => setHour(val)} />*/}
			{/*<DropDownMenu items={mins.map(min => ({ id: min, name: min }))} selection={min} setSelection={val => setMin(val)} />*/}
			<input value={hour} onChange={e => setHour(e.target.value)}/>
			<input value={min} onChange={e => setMin(e.target.value)}/>
			<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
			{
				meridiems.map(m => {
					const highlight = m === meridiem
					return <div style={{ padding: '.5em 1em', display: 'flex', alignItems: 'center', cursor: 'pointer', flexGrow: 1, backgroundColor: highlight ? 'var(--primary)' : 'lightgrey', color: highlight ? 'white' : 'darkgrey' }} onClick={() => setMeridiem(m)}>{m}</div>
				})
			}
			</div>
		</div>
	)
}

export default TimePicker
