import React, { useState, useEffect, useRef } from 'react'

import { getAbbreviatedMonth, getDaysInMonth, getDayOfWeekOfFirstDay, formatYYYY_MMM_DD } from '../helpers/date'

const NUM_MONTHS = 12
const JAN = 1
const DEC = 12

const DatePicker = ({ value, onChange = () => {} }) => {
	const [year, setYear] = useState()
	const [month, setMonth] = useState()
	const [selection, setSelection] = useState({ year: '', month: '', date: '' })
	const [showPicker, setShowPicker] = useState(false)
	const ref = useRef(null)

	useEffect(() => {
		const date = value ? new Date(value) : new Date()
		setYear(date.getFullYear())
		setMonth(date.getMonth() + 1)

		setSelection({ year: date.getFullYear(), month: date.getMonth() + 1, date: date.getDate()})
	}, [])

	useEffect(() => {
		if (showPicker) ref.current.focus()
		else ref.current.blur()
	}, [showPicker])

	const prevMonth = () => {
		if (month === JAN) setYear(prev => prev - 1)

		setMonth(prev => NUM_MONTHS - ((NUM_MONTHS - (prev - 1)) % NUM_MONTHS))
	}

	const nextMonth = () => {
		if (month === DEC) setYear(prev => prev + 1)

		setMonth(prev => (prev % NUM_MONTHS) + 1)
	}

	const goToToday = () => {
		const now = new Date()
		setYear(now.getFullYear())
		setMonth(now.getMonth() + 1)
	}

	const calcLength = () => {
		const daysInMonth = getDaysInMonth({ year, month })
		const dayOfWeekOfFirstDay = getDayOfWeekOfFirstDay({ year, month })
		return ((7 - ((daysInMonth + dayOfWeekOfFirstDay) % 7)) % 7) + daysInMonth + dayOfWeekOfFirstDay
	}

	const selectedDate = ({ date }) => {
		return year === selection.year && month === selection.month && date === selection.date
	}

	const setElementOffset = e => {
		const offset = e.parentElement.getBoundingClientRect()
		const calendar = e.parentElement.nextElementSibling

		if (offset.top > window.innerHeight / 2) {
			calendar.style.top = 'initial'
			calendar.style.bottom = '100%'
		} else {
			calendar.style.top = '100%'
			calendar.style.bottom = 'initial'
		}
	}

	const formatDate = ({ year, month, date = '' }) => {
		return formatYYYY_MMM_DD({ year, month, date })
	}

	return (
		<div className={'picker'} style={{ position: 'relative' }}>
			<div style={{ display: 'flex' }} onMouseDown={e => {
				/* onMouseDown will close the picker properly if current state of picker is open.
					onClick will not since it fires when mouse is released,
					which causes the picker to blur first, set showPicker to false,
					and then reset showPicker to true (thereby re-focusing the picker) when this function runs. */
				setElementOffset(e.target)
				setShowPicker(prev => !prev)
			}}>
				<input style={{ backgroundColor: 'inherit', border: 'none', borderRight: 'solid 1px var(--primary)', padding: '1em' }} value={formatDate(selection)} readOnly />
				<button>Edit</button>
			</div>
			<div className={`calendar ${showPicker ? '' : 'hidden'}`} ref={ref} onBlur={() => setShowPicker(false)} tabIndex={-1}>
				<div className={'nav'} style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', marginBottom: '.5rem', gridColumn: '1 / span 7', gridRow: '1 / span 2' }}>
					<button className={'month prev'} onClick={prevMonth}></button>
					<h3>{getAbbreviatedMonth({ month })} {year}</h3>
					<button className={'month next'} onClick={nextMonth}></button>
					{/*<div style={{ display: 'flex', justifyContent: 'center' }}>
						<button onClick={goToToday}>Today</button>
					</div>*/}
				</div>
				{
					['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => {
						return <div key={i} className={'days-of-week'} style={{ gridColumn: `${i + 1} / span 1`, gridRow: `3 / span 1` }}>{day}</div>
					})
				}
				{
					Array.from({ length: calcLength() }).fill(0).map((e, i) => {
						const firstday = getDayOfWeekOfFirstDay({ year, month })
						const date = i - firstday + 1
						return i < firstday || date > getDaysInMonth({ year, month }) ?
						<div key={i} className={'date disabled'} style={{ gridColumn: `${(i % 7) + 1} / span 1`, gridRow: `${(i / 7) + 4} / span 1` }}>&nbsp;</div> :
						<div
							key={i}
							className={`date ${selectedDate({ date }) ? 'selected' : ''}`}
							style={{ gridColumn: `${(i % 7) + 1} / span 1`, gridRow: `${(i / 7) + 4} / span 1` }}
							onClick={() => {
								setSelection({ year, month, date })
								setShowPicker(false)
								onChange(`${year}-${month < 10 ? '0' + month : month}-${date < 10 ? '0' + date : date}`)
							}}>{date}
						</div>
					})
				}
			</div>

		</div>
	)
}

export { DatePicker }
